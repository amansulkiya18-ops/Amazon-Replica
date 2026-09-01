/**
 * salesforce-connector.js
 * 
 * Manages Core Salesforce API integrations (Web-to-Lead, REST API proxy)
 * and Data Cloud Streaming Ingestion events.
 */

class SalesforceConnector {
    constructor() {
        this.config = {
            mode: 'simulate',
            orgId: '',
            authUrl: '',
            restUrl: '',
            clientId: '',
            clientSecret: '',
            dcIngestUrl: '',
            dcSource: '',
            dcEvent: '',
            serverUrl: 'http://localhost:3000'
        };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Submit a newsletter signup to Salesforce
     * In Simulation Mode: Show the Web-to-Lead HTML or API payload.
     * In Active Mode: Perform a Web-to-Lead post or route through proxy server.
     */
    async submitLead(email, fullName) {
        const names = this.splitName(fullName);
        const timestamp = new Date().toLocaleTimeString();

        // 1. Web-to-Lead Form Simulation (Standard method for capturing site visitors)
        const webToLeadPayload = {
            oid: this.config.orgId || '00D80000000abc1',
            first_name: names.first,
            last_name: names.last || 'Subscriber',
            email: email,
            lead_source: 'Amazon Replica Registry'
        };

        if (this.config.mode === 'simulate') {
            this.logAPI('Salesforce Web-to-Lead', {
                endpoint: 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8',
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: webToLeadPayload,
                curl: `curl -X POST "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" \\\n  -d "oid=${webToLeadPayload.oid}" \\\n  -d "first_name=${webToLeadPayload.first_name}" \\\n  -d "last_name=${webToLeadPayload.last_name}" \\\n  -d "email=${encodeURIComponent(webToLeadPayload.email)}" \\\n  -d "lead_source=Amazon%20Replica%20Registry"`
            }, 'Newsletter Signup logged to Console (Web-to-Lead)');
            return { success: true, message: 'Simulation completed' };
        }

        // Active Mode: Actually try Web-to-Lead or backend API Proxy
        if (this.config.orgId) {
            this.logSystem(`Submitting Web-to-Lead form to Org ID: ${this.config.orgId}`);
            try {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';
                form.target = '_blank';
                form.style.display = 'none';

                for (const key in webToLeadPayload) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = webToLeadPayload[key];
                    form.appendChild(input);
                }

                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
                
                this.logSystem('Web-to-Lead form submitted successfully.');
                return { success: true, message: 'Web-to-Lead form sent' };
            } catch (err) {
                this.logError(`Web-to-Lead error: ${err.message}`);
            }
        }

        if (this.config.restUrl && this.config.clientId) {
            this.logSystem('Submitting Lead via REST API server proxy...');
            try {
                const response = await fetch(`${this.config.serverUrl}/api/lead`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        firstName: names.first,
                        lastName: names.last || 'Subscriber',
                        leadSource: 'Amazon Replica Registry',
                        credentials: {
                            clientId: this.config.clientId,
                            clientSecret: this.config.clientSecret,
                            authUrl: this.config.authUrl,
                            restUrl: this.config.restUrl
                        }
                    })
                });

                const data = await response.json();
                if (data.success) {
                    this.logAPI('Salesforce Core REST API', {
                        endpoint: `${this.config.restUrl}/services/data/v60.0/sobjects/Lead`,
                        method: 'POST',
                        status: response.status,
                        response: data.data
                    }, 'Newsletter Subscriber Inserted as Salesforce Lead');
                    return { success: true };
                } else {
                    this.logError(`Salesforce API Error: ${data.error}`);
                    return { success: false, error: data.error };
                }
            } catch (err) {
                this.logError(`Server connection failed: ${err.message}. Make sure your local Node.js proxy server is running.`);
                return { success: false, error: 'Server connection failed' };
            }
        }

        this.logError('Web-to-Lead Org ID or Salesforce API Credentials missing. Fill in settings to post data.');
        return { success: false, error: 'Configuration missing' };
    }

    /**
     * Submit a Purchase/Checkout transaction
     * In Simulation Mode: Print the Data Cloud Ingestion API REST payload.
     * In Active Mode: Send checkout items and buyer profile to proxy server,
     * which posts to the Salesforce Data Cloud Ingestion API.
     */
    async submitPurchase(orderId, email, firstName, lastName, cartItems, totalAmount, discountAmount = 0.0, promoCode = '') {
        const names = { first: firstName, last: lastName };
        
        // Structure event payload for Data Cloud Streaming Ingestion API
        const ingestionPayload = {
            EventID: orderId,
            DateTime: new Date().toISOString(),
            SubscriberKey: email,
            EmailAddress: email,
            FirstName: names.first,
            LastName: names.last,
            TotalAmount: parseFloat(totalAmount),
            DiscountAmount: parseFloat(discountAmount),
            PromoCodeApplied: promoCode || 'None',
            OrderDetails: cartItems.map(item => ({
                SKU: item.product.id,
                ProductName: item.product.name,
                Category: item.product.category,
                Brand: item.product.brand,
                Quantity: parseInt(item.quantity),
                UnitPrice: parseFloat(item.product.price)
            }))
        };

        if (this.config.mode === 'simulate') {
            const endpoint = this.config.dcIngestUrl 
                ? `${this.config.dcIngestUrl}/api/v1/ingestion/sources/${this.config.dcSource || 'AmazonReplicaStore'}/actions/${this.config.dcEvent || 'ecom_purchase_event'}`
                : 'https://YOUR_TENANT.api.user.c360a.salesforce.com/api/v1/ingestion/sources/AmazonReplicaStore/actions/ecom_purchase_event';

            this.logAPI('Data Cloud Ingestion API (Streaming)', {
                endpoint: endpoint,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 00D80000000abc1!AR0AQ...',
                    'Content-Type': 'application/json'
                },
                body: ingestionPayload,
                curl: `curl -X POST "${endpoint}" \\\n  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(ingestionPayload, null, 2)}'`
            }, 'Purchase Transaction logged to Console (Streaming Ingestion)');
            return { success: true };
        }

        // Active Mode: Route request via backend proxy server
        if (this.config.dcIngestUrl) {
            this.logSystem('Streaming purchase transaction to Data Cloud API...');
            try {
                const response = await fetch(`${this.config.serverUrl}/api/datacloud/event`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ingestionPayload: ingestionPayload,
                        config: {
                            dcIngestUrl: this.config.dcIngestUrl,
                            dcSource: this.config.dcSource,
                            dcEvent: this.config.dcEvent,
                            clientId: this.config.clientId,
                            clientSecret: this.config.clientSecret,
                            authUrl: this.config.authUrl
                        }
                    })
                });

                const data = await response.json();
                if (data.success) {
                    this.logAPI('Data Cloud Ingestion API', {
                        endpoint: `${this.config.dcIngestUrl}/api/v1/ingestion/sources/${this.config.dcSource}/actions/${this.config.dcEvent}`,
                        method: 'POST',
                        status: response.status,
                        response: data.data
                    }, 'Transaction Ingested successfully into Data Cloud');
                    return { success: true };
                } else {
                    this.logError(`Data Cloud API Error: ${data.error}`);
                    return { success: false, error: data.error };
                }
            } catch (err) {
                this.logError(`Server connection failed: ${err.message}. Make sure your local Node.js proxy server is running.`);
                return { success: false, error: 'Server connection failed' };
            }
        }

        this.logError('Data Cloud Ingestion API credentials missing. Fill in settings to stream data.');
        return { success: false, error: 'Configuration missing' };
    }

    /**
     * Test connection credentials
     */
    async testConnection(credentials) {
        this.logSystem('Testing API connection to Salesforce core auth endpoint...');
        try {
            const response = await fetch(`${this.config.serverUrl}/api/auth-test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (data.success) {
                this.logSystem('Salesforce Connection Active! OAuth token retrieved successfully.');
                return { success: true };
            } else {
                this.logError(`Salesforce Auth Failed: ${data.error}`);
                return { success: false, error: data.error };
            }
        } catch (err) {
            this.logError(`Server connection failed: ${err.message}. Ensure node server.js is running.`);
            return { success: false, error: 'Server connection failed' };
        }
    }

    /* Helper Methods */

    splitName(fullName) {
        const parts = fullName.trim().split(/\s+/);
        return {
            first: parts[0] || '',
            last: parts.slice(1).join(' ') || ''
        };
    }

    logAPI(apiName, details, message) {
        const consoleEl = document.getElementById('console-output');
        if (!consoleEl) return;

        const timeStr = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'console-line api-line';
        
        let textDetails = `Endpoint: ${details.method} ${details.endpoint}\n`;
        if (details.headers) {
            textDetails += `Headers: ${JSON.stringify(details.headers, null, 2)}\n`;
        }
        textDetails += `Payload: ${JSON.stringify(details.body || details.response, null, 2)}`;
        
        if (details.curl) {
            textDetails += `\n\nEquivalent cURL Command:\n${details.curl}`;
        }

        line.innerHTML = `
            <span class="line-time">[${timeStr}]</span>
            <span class="line-tag">Salesforce API</span>
            <span class="line-text font-bold">${apiName}: ${message}</span>
            <pre class="console-code">${textDetails}</pre>
        `;
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    logSystem(message) {
        const consoleEl = document.getElementById('console-output');
        if (!consoleEl) return;

        const timeStr = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'console-line system-line';
        line.innerHTML = `
            <span class="line-time">[${timeStr}]</span>
            <span class="line-tag">System</span>
            <span class="line-text">${message}</span>
        `;
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    logError(message) {
        const consoleEl = document.getElementById('console-output');
        if (!consoleEl) return;

        const timeStr = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'console-line error-line';
        line.innerHTML = `
            <span class="line-time">[${timeStr}]</span>
            <span class="line-tag">Error</span>
            <span class="line-text">${message}</span>
        `;
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }
}

const connector = new SalesforceConnector();
window.connector = connector;
