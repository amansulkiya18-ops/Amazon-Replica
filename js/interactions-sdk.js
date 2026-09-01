/**
 * interactions-sdk.js
 * 
 * Emulates the Salesforce Interactions SDK (Personalization / Data Cloud Web SDK)
 * to trace, log, and trigger event tracking on client behavior (page views, cart additions,
 * identity linking, promotion views, brand views, and purchases).
 */

class MCNextTracker {
    constructor() {
        this.config = {
            tenantUrl: '',
            namespace: '',
            mid: '',
            mode: 'simulate'
        };
        this.initialized = false;
        
        // Emulate standard Salesforce Interactions SDK structure
        window.SalesforceInteractions = window.SalesforceInteractions || {
            initialized: false,
            init: (cfg) => this.emulateInit(cfg),
            sendEvent: (eventObj) => this.emulateSendEvent(eventObj),
            initSitemap: (cfg) => this.emulateInitSitemap(cfg),
            reprocess: () => this.emulateReprocessSitemap(),
            // SDK Constants
            CatalogObjectInteractionName: {
                ViewCatalogObject: "View Catalog Object",
                QuickViewCatalogObject: "Quick View Catalog Object"
            },
            CartInteractionName: {
                ReplaceCartLineItems: "Replace Cart Line Items"
            },
            OrderInteractionName: {
                Purchase: "Purchase"
            }
        };
    }

    /**
     * Set configuration parameters dynamically
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.logSystem(`SDK Configuration updated: Mode=${this.config.mode.toUpperCase()}`);
        
        if (this.config.mode === 'active' && this.config.tenantUrl && this.config.namespace) {
            this.loadRealSDK();
        } else {
            this.initialized = true;
            window.SalesforceInteractions.initialized = true;
        }
    }

    /**
     * Load the official Evergage/Interactions SDK CDN script
     */
    loadRealSDK() {
        if (document.getElementById('sf-interactions-beacon')) return;
        
        this.logSystem(`Loading real Salesforce Interactions SDK script from tenant CDN...`);
        const script = document.createElement('script');
        script.id = 'sf-interactions-beacon';
        script.type = 'text/javascript';
        script.async = true;
        
        let account = 'cura';
        try {
            const url = new URL(this.config.tenantUrl);
            account = url.hostname.split('.')[0];
        } catch (e) {
            this.logError(`Invalid Tenant URL. Using fallback account name.`);
        }
        
        script.src = `https://cdn.evergage.com/beacon/${account}/${this.config.namespace}/scripts/evergage.min.js`;
        
        script.onload = () => {
            this.logSystem(`Salesforce Interactions SDK script loaded successfully!`);
            this.initializeRealSDK(account);
        };
        
        script.onerror = () => {
            this.logError(`Failed to load SDK script from ${script.src}. Falling back to simulation mode.`);
            this.config.mode = 'simulate';
            this.initialized = true;
        };
        
        document.head.appendChild(script);
    }

    initializeRealSDK(account) {
        try {
            if (window.Evergage) {
                window.Evergage.init({
                    cookieDomain: window.location.hostname,
                    dataset: this.config.namespace,
                    target: this.config.tenantUrl
                });
                this.initialized = true;
                this.logSystem(`Real SDK initialized with dataset: ${this.config.namespace}`);
            }
        } catch (err) {
            this.logError(`Error initializing real SDK: ${err.message}`);
        }
    }

    /**
     * Emulate SDK Init
     */
    emulateInit(config) {
        this.logSystem(`SalesforceInteractions.init() called client-side`);
        return Promise.resolve();
    }

    /**
     * Emulate initSitemap
     */
    emulateInitSitemap(config) {
        this.sitemapConfig = config;
        this.logSystem(`SalesforceInteractions.initSitemap() registered successfully.`);
        // Run sitemap reprocess on initial load
        setTimeout(() => this.emulateReprocessSitemap(), 100);
    }

    /**
     * Evaluate matching pageType rules and fire corresponding actions
     */
    emulateReprocessSitemap() {
        if (!this.sitemapConfig || !this.sitemapConfig.pageTypes) return;

        this.logSystem(`Evaluating Sitemap page matching rules...`);
        const matched = this.sitemapConfig.pageTypes.find(pageType => {
            try {
                return typeof pageType.isMatch === 'function' && pageType.isMatch();
            } catch (e) {
                return false;
            }
        });

        if (matched) {
            this.logSystem(`Sitemap Matched Page Type: "${matched.name}"`);
            
            // Execute the action for the matched page type if defined
            if (typeof matched.onAction === 'function') {
                try {
                    matched.onAction();
                } catch (e) {
                    this.logError(`Error running sitemap onAction callback: ${e.message}`);
                }
            }
        } else {
            this.logSystem(`Sitemap: No page types matched the current page state.`);
        }
    }

    /**
     * Intercept and log events sent via SalesforceInteractions.sendEvent
     */
    emulateSendEvent(eventObj) {
        const timestamp = new Date().toLocaleTimeString();
        const eventName = eventObj.interaction?.name || 'Unknown Event';
        
        // Render in UI console
        this.renderConsoleLog(eventName, eventObj);

        // If in active mode and the real Evergage SDK is loaded, forward the event
        if (this.config.mode === 'active' && window.Evergage && window.Evergage.initialized) {
            try {
                window.Evergage.sendEvent(eventObj);
                this.logSystem(`Forwarded event [${eventName}] to real Salesforce Data Cloud account.`);
            } catch (e) {
                this.logError(`Failed forwarding event to Real SDK: ${e.message}`);
            }
        }
    }

    /* Core Event Methods Exposed to app.js */

    trackPageView(pageName, category = '') {
        const event = {
            interaction: {
                name: 'View Page'
            },
            user: {
                attributes: {
                    lastViewedPage: pageName,
                    lastViewedCategory: category
                }
            }
        };
        window.SalesforceInteractions.sendEvent(event);
    }

    trackProductView(product) {
        const event = {
            interaction: {
                name: window.SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
                catalogObject: {
                    type: "Product",
                    id: product.id,
                    attributes: {
                        name: product.name,
                        price: parseFloat(product.price),
                        imageUrl: product.imageUrl || '',
                        url: window.location.href + `#product/${product.id}`,
                        category: product.category,
                        brand: product.brand
                    }
                }
            }
        };
        window.SalesforceInteractions.sendEvent(event);
    }

    trackCartUpdate(cartItems) {
        const lineItems = cartItems.map(item => ({
            catalogObject: {
                type: "Product",
                id: item.product.id
            },
            quantity: parseInt(item.quantity),
            price: parseFloat(item.product.price)
        }));

        const event = {
            interaction: {
                name: window.SalesforceInteractions.CartInteractionName.ReplaceCartLineItems,
                lineItems: lineItems
            }
        };
        window.SalesforceInteractions.sendEvent(event);
    }

    trackPurchase(orderId, cartItems, totalValue, discountApplied = 0.0, promoCode = '') {
        const lineItems = cartItems.map(item => ({
            catalogObject: {
                type: "Product",
                id: item.product.id
            },
            quantity: parseInt(item.quantity),
            price: parseFloat(item.product.price)
        }));

        const orderObj = {
            id: orderId,
            lineItems: lineItems,
            totalValue: parseFloat(totalValue)
        };

        if (promoCode) {
            orderObj.promoCode = promoCode;
            orderObj.discountAmount = parseFloat(discountApplied);
        }

        const event = {
            interaction: {
                name: window.SalesforceInteractions.OrderInteractionName.Purchase,
                order: orderObj
            }
        };
        window.SalesforceInteractions.sendEvent(event);
    }

    trackIdentity(email, firstName = '', lastName = '') {
        const userAttributes = {};
        if (firstName) userAttributes.firstName = firstName;
        if (lastName) userAttributes.lastName = lastName;
        
        const event = {
            interaction: {
                name: 'Identify Customer'
            },
            user: {
                identities: {
                    emailAddress: email
                }
            }
        };
        
        if (Object.keys(userAttributes).length > 0) {
            event.user.attributes = userAttributes;
        }

        window.SalesforceInteractions.sendEvent(event);
    }

    /**
     * Track Promotions events (Views/Clicks)
     */
    trackPromotionView(promoId, promoName, creative = 'Standard Card') {
        const event = {
            interaction: {
                name: 'View Promotion',
                promotion: {
                    id: promoId,
                    name: promoName,
                    creative: creative
                }
            }
        };
        window.SalesforceInteractions.sendEvent(event);
    }

    trackPromotionClick(promoId, promoName) {
        const event = {
            interaction: {
                name: 'Click Promotion',
                promotion: {
                    id: promoId,
                    name: promoName
                }
            }
        };
        window.SalesforceInteractions.sendEvent(event);
    }

    /**
     * Track Brand Selection actions
     */
    trackBrandSelection(brandName) {
        const event = {
            interaction: {
                name: 'Filter Brand',
                brand: brandName
            }
        };
        window.SalesforceInteractions.sendEvent(event);
    }

    /* Console Logging Helpers */

    renderConsoleLog(eventName, payload) {
        const consoleEl = document.getElementById('console-output');
        if (!consoleEl) return;

        const timeStr = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'console-line sdk-line';
        
        // JS Code snippet output
        let jsSnippet = '';
        if (eventName === 'View Page') {
            jsSnippet = `SalesforceInteractions.sendEvent({\n  interaction: { name: 'View Page' },\n  user: { attributes: { lastViewedPage: '${payload.user.attributes.lastViewedPage}' } }\n});`;
        } else if (eventName.includes('Catalog Object')) {
            const obj = payload.interaction.catalogObject;
            jsSnippet = `SalesforceInteractions.sendEvent({\n  interaction: {\n    name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,\n    catalogObject: {\n      type: '${obj.type}',\n      id: '${obj.id}',\n      attributes: {\n        name: '${obj.attributes.name}',\n        price: ${obj.attributes.price},\n        category: '${obj.attributes.category}',\n        brand: '${obj.attributes.brand}'\n      }\n    }\n  }\n});`;
        } else if (eventName.includes('Cart')) {
            jsSnippet = `SalesforceInteractions.sendEvent({\n  interaction: {\n    name: SalesforceInteractions.CartInteractionName.ReplaceCartLineItems,\n    lineItems: ${JSON.stringify(payload.interaction.lineItems, null, 4).replace(/\n/g, '\n    ')}\n  }\n});`;
        } else if (eventName.includes('Purchase')) {
            jsSnippet = `SalesforceInteractions.sendEvent({\n  interaction: {\n    name: window.SalesforceInteractions.OrderInteractionName.Purchase,\n    order: ${JSON.stringify(payload.interaction.order, null, 4).replace(/\n/g, '\n    ')}\n  }\n});`;
        } else if (eventName.includes('Promotion')) {
            jsSnippet = `SalesforceInteractions.sendEvent({\n  interaction: {\n    name: '${eventName}',\n    promotion: ${JSON.stringify(payload.interaction.promotion, null, 4).replace(/\n/g, '\n    ')}\n  }\n});`;
        } else if (eventName.includes('Brand')) {
            jsSnippet = `SalesforceInteractions.sendEvent({\n  interaction: {\n    name: 'Filter Brand',\n    brand: '${payload.interaction.brand}'\n  }\n});`;
        } else {
            jsSnippet = `SalesforceInteractions.sendEvent(${JSON.stringify(payload, null, 2)});`;
        }

        line.innerHTML = `
            <span class="line-time">[${timeStr}]</span>
            <span class="line-tag">Interactions SDK</span>
            <span class="line-text font-bold">Event: "${eventName}"</span>
            <pre class="console-code">${jsSnippet}</pre>
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

// Instantiate and attach globally
const tracker = new MCNextTracker();
window.tracker = tracker;
