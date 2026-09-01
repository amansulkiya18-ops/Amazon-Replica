/**
 * server.js
 * 
 * Local Express backend server proxy. Enables CORS-free secure API
 * integrations with Salesforce Core OAuth2 credentials and Data Cloud
 * Ingestion endpoints.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables if defined in .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Console logging helper
const logRequest = (endpoint, method, message) => {
    const time = new Date().toLocaleTimeString();
    console.log(`\x1b[36m[${time}] [${method}] ${endpoint} \x1b[0m- ${message}`);
};

const logError = (endpoint, message, details = '') => {
    const time = new Date().toLocaleTimeString();
    console.error(`\x1b[31m[${time}] [ERROR] ${endpoint} \x1b[0m- ${message}`, details);
};

/**
 * Helper to fetch a Salesforce Access Token using Client Credentials Grant
 */
async function getSalesforceAccessToken(authUrl, clientId, clientSecret) {
    // Sanitize Auth URL (ensure it has protocol, remove trailing slashes)
    let sanitizedAuth = authUrl.trim().replace(/\/$/, '');
    if (!sanitizedAuth.startsWith('http')) {
        sanitizedAuth = `https://${sanitizedAuth}`;
    }
    
    const tokenUrl = `${sanitizedAuth}/services/oauth2/token`;
    
    // Salesforce Client Credentials OAuth payload
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
        const response = await axios.post(tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (err) {
        const errMsg = err.response && err.response.data 
            ? JSON.stringify(err.response.data) 
            : err.message;
        throw new Error(`Authentication failed: ${errMsg}`);
    }
}

/**
 * Endpoints
 */

// 1. Connection Test Endpoint
app.post('/api/auth-test', async (req, res) => {
    const { authUrl, clientId, clientSecret } = req.body;
    logRequest('/api/auth-test', 'POST', 'Testing Salesforce Authentication...');

    if (!authUrl || !clientId || !clientSecret) {
        logError('/api/auth-test', 'Missing credentials in payload');
        return res.status(400).json({ success: false, error: 'Auth URL, Client ID, and Client Secret are required.' });
    }

    try {
        const token = await getSalesforceAccessToken(authUrl, clientId, clientSecret);
        logRequest('/api/auth-test', 'SUCCESS', 'OAuth token retrieved successfully');
        res.json({ success: true, message: 'Authentication successful' });
    } catch (err) {
        logError('/api/auth-test', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Lead Creation REST Proxy (For Newsletter Signups)
app.post('/api/lead', async (req, res) => {
    const { email, firstName, lastName, leadSource, credentials } = req.body;
    logRequest('/api/lead', 'POST', `Inserting Lead: ${email}`);

    if (!email || !firstName || !lastName || !credentials) {
        logError('/api/lead', 'Missing required fields in payload');
        return res.status(400).json({ success: false, error: 'Email, Name, and API credentials are required.' });
    }

    try {
        // Authenticate
        const token = await getSalesforceAccessToken(credentials.authUrl, credentials.clientId, credentials.clientSecret);
        
        // REST endpoint for Lead object
        let restUrl = credentials.restUrl.trim().replace(/\/$/, '');
        if (!restUrl.startsWith('http')) {
            restUrl = `https://${restUrl}`;
        }
        const leadUrl = `${restUrl}/services/data/v60.0/sobjects/Lead`;

        // Post record
        const response = await axios.post(leadUrl, {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Company: 'Self-Employed (Aetheria E-Commerce)', // Required Lead field
            LeadSource: leadSource || 'Aetheria Home Web'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        logRequest('/api/lead', 'SUCCESS', `Created Lead Record ID: ${response.data.id}`);
        res.json({ success: true, data: response.data });
    } catch (err) {
        const errMsg = err.response && err.response.data 
            ? JSON.stringify(err.response.data) 
            : err.message;
        logError('/api/lead', errMsg);
        res.status(500).json({ success: false, error: errMsg });
    }
});

// 3. Data Cloud Ingestion Event Proxy (For Purchases/Checkouts)
app.post('/api/datacloud/event', async (req, res) => {
    const { ingestionPayload, config } = req.body;
    logRequest('/api/datacloud/event', 'POST', `Streaming event to Data Cloud`);

    if (!ingestionPayload || !config) {
        logError('/api/datacloud/event', 'Missing payloads or configurations');
        return res.status(400).json({ success: false, error: 'Payload and configuration details are required.' });
    }

    try {
        // Authenticate
        const token = await getSalesforceAccessToken(config.authUrl, config.clientId, config.clientSecret);

        // Data Cloud Ingestion URL mapping
        let ingestUrl = config.dcIngestUrl.trim().replace(/\/$/, '');
        if (!ingestUrl.startsWith('http')) {
            ingestUrl = `https://${ingestUrl}`;
        }

        const source = config.dcSource || 'AetheriaStore';
        const event = config.dcEvent || 'ecom_purchase_event';
        const endpointUrl = `${ingestUrl}/api/v1/ingestion/sources/${source}/actions/${event}`;

        logRequest('/api/datacloud/event', 'POSTING', `URL: ${endpointUrl}`);

        const response = await axios.post(endpointUrl, ingestionPayload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        logRequest('/api/datacloud/event', 'SUCCESS', `Data Cloud responded with status ${response.status}`);
        res.json({ success: true, data: response.data });
    } catch (err) {
        const errMsg = err.response && err.response.data 
            ? JSON.stringify(err.response.data) 
            : err.message;
        logError('/api/datacloud/event', errMsg);
        res.status(500).json({ success: false, error: errMsg });
    }
});

// Start Express Listener
app.listen(PORT, () => {
    console.log(`\x1b[32m==================================================`);
    console.log(`AETHERIA STORE PROXY SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Supports Salesforce Core REST and Data Cloud APIs`);
    console.log(`==================================================\x1b[0m`);
});
