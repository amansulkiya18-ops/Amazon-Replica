# Amazon Replica — Salesforce Data Cloud & Personalization Storefront

A fully functional, client-side **Amazon Replica Storefront** built for testing and integrating with **Salesforce Data Cloud**, **Salesforce Marketing Cloud Personalization (formerly Interaction Studio / Evergage)**, and **Salesforce Interactions SDK**.

---

## 🌟 Features

- **Amazon-Styled UI & Components**:
  - Top navigation bar with multi-level dropdowns, category selector, search bar, and cart badge.
  - Interactive SPA views: **Home / Shop Catalog**, **Department Categories**, **Product Details Page (PDP)** with 3-column buy box, **Shopping Cart**, **Checkout**, **Order Confirmation / Success**, and **Your Account** with 6 sub-panes (Orders History, Login & Security, Payments, Prime, Gift Cards, Customer Support).
- **Salesforce Data Cloud & Personalization Integration**:
  - **Interactions Web SDK Support**: Real-time event tracking for Page Views, Catalog Views, Cart Additions, and Purchases.
  - **Event Schema (`sitemap.json`)**: Pre-configured JSON schema ready for upload to Salesforce Data Cloud Web & Mobile App Connectors.
  - **Interactions Sitemap (`js/sitemap.js`)**: Configured SPA matching rules and listeners with built-in dynamic personalization actions (such as promo banners and popup modals).
  - **XML Sitemap (`sitemap.xml`)**: Standard sitemap for search crawlers and Data Cloud Web Content ingestion.
  - **MC Next Live Event Console**: In-browser debug console to inspect emitted SDK payloads, cURL equivalents, and live telemetry.
- **Pure Client-Side Ready**:
  - Double-click and run directly in the browser (`index.html`) without CORS issues.
  - Optional backend proxy (`server.js`) for secure OAuth Client Credentials and REST API routing.

---

## 🚀 Quick Start

### 1. View Locally
Simply double-click `index.html` or open it with any web browser.

Alternatively, use any local static server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server -p 8000
```
Visit `http://localhost:8000` in your browser.

### 2. Run API Proxy (Optional)
To test Salesforce OAuth Client Credentials or Core REST APIs:
```bash
npm install
npm start
```
The server runs on `http://localhost:3000`.

---

## 📂 Project Structure

```
├── index.html              # Main application shell with all SPA containers
├── index.css               # Amazon styling system and component stylesheets
├── sitemap.json            # Salesforce Data Cloud Web Connector event schema
├── sitemap.xml             # XML sitemap for web crawlers
├── package.json            # Node dependencies for server proxy
├── server.js               # Express API proxy for OAuth and REST endpoints
├── js/
│   ├── app.js              # Application router, catalog data, and DOM controllers
│   ├── interactions-sdk.js # Salesforce Web SDK handler and event simulation layer
│   ├── salesforce-connector.js # Core REST and Data Cloud Ingestion connector
│   └── sitemap.js          # Salesforce Interactions sitemap configuration
```

---

## ⚙️ Salesforce Integration Setup

1. **Upload Schema to Data Cloud**:
   - In Salesforce Data Cloud Setup, go to **Websites & Mobile Apps**.
   - Open your Website record, locate **Sitemap**, and upload `sitemap.json`.
2. **Add CDN Script to Website**:
   - Add your connection's CDN beacon tag into the `<head>` of `index.html`.
3. **Deploy Sitemap JS**:
   - Use `js/sitemap.js` in your Salesforce Personalization Sitemap Editor or include it locally in the storefront.
