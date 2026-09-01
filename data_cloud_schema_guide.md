# Salesforce Data Cloud Schema & Mapping Guide

To enable Salesforce Data Cloud to ingest checkout events streamed from your Amazon replica storefront, you must configure an **Ingestion API Data Stream** and upload a **JSON Schema** file. This guide outlines the steps to ingest and map the storefront telemetry payloads.

---

## 🛠️ Step 1: Create the Ingestion API Schema in Data Cloud

1. Log in to your Salesforce Data Cloud org.
2. Navigate to **Data Cloud Setup** -> **Ingestion API**.
3. Click **New** (or select your existing connector source).
4. Give it a name (e.g., `AmazonReplicaStore`).
5. Under Schema, click **Upload Schema** (or **New Schema**).
6. Upload the file [ingestion_schema.json](file:///Users/admin/.gemini/antigravity/brain/70f4a2a8-8309-4526-99a5-7a798646ab15/ingestion_schema.json). This defines the structure of the purchase payload sent from your website.

---

## 📦 Step 2: Create the Data Stream

1. Navigate to the **Data Streams** tab in Data Cloud and click **New**.
2. Select **Ingestion API** as your source.
3. Choose your Ingestion source (`AmazonReplicaStore`) and select the schema object (`ecom_purchase_event`).
4. Set the **Category** to **Transactional**.
5. Set the **Primary Key** to `EventID` (which maps to the order ID).
6. Set the **Event Time Field** to `DateTime`.
7. Click **Deploy**.

---

## 🗺️ Step 3: Map Data Source Objects (DSO) to Data Model Objects (DMO)

To unify the ingested data into the Customer 360 profile, map the schema fields (Data Source Object) to the standard Data Model Objects (DMOs) as follows:

### 1. Customer Identity & Contact Mapping
Map user contact info to the **Individual** and **Contact Point Email** DMOs:

| Ingestion Schema (DSO Field) | Standard DMO Name | Target DMO Field |
| :--- | :--- | :--- |
| `SubscriberKey` | `Individual` | `Individual Id` *(Primary Key)* |
| `FirstName` | `Individual` | `First Name` |
| `LastName` | `Individual` | `Last Name` |
| `EmailAddress` | `Contact Point Email` | `Email Address` |
| `SubscriberKey` | `Contact Point Email` | `Party Id` *(Foreign Key to Individual)* |
| `EmailAddress` | `Contact Point Email` | `Contact Point Id` *(Primary Key)* |

### 2. Sales Order Header Mapping
Map order details to the **Sales Order** DMO:

| Ingestion Schema (DSO Field) | Standard DMO Name | Target DMO Field |
| :--- | :--- | :--- |
| `EventID` | `Sales Order` | `Sales Order Number` *(Primary Key)* |
| `DateTime` | `Sales Order` | `Order Date` |
| `TotalAmount` | `Sales Order` | `Total Gross Amount` |
| `DiscountAmount` | `Sales Order` | `Total Discount Amount` |
| `SubscriberKey` | `Sales Order` | `Sold To Party Id` *(Foreign Key to Individual)* |

### 3. Sales Order Product Line Items Mapping (Nested Array)
Map the nested items inside `OrderDetails` to the **Sales Order Product** and **Product** DMOs:

| Ingestion Schema (DSO Field) | Standard DMO Name | Target DMO Field |
| :--- | :--- | :--- |
| `OrderDetails.SKU` | `Sales Order Product` | `Product Id` *(Foreign Key to Product)* |
| `OrderDetails.Quantity` | `Sales Order Product` | `Quantity` |
| `OrderDetails.UnitPrice` | `Sales Order Product` | `Unit Price` |
| `EventID` | `Sales Order Product` | `Sales Order Number` *(Foreign Key to Sales Order)* |
| `OrderDetails.SKU` | `Product` | `Product Id` *(Primary Key)* |
| `OrderDetails.ProductName` | `Product` | `Product Name` |
| `OrderDetails.Category` | `Product` | `Product Category` |
| `OrderDetails.Brand` | `Product` | `Product Brand` |

---

## ⚡ Integration Payload Reference

The website dispatches JSON streams in this structure when orders are completed. Use this for validating API feeds:

```json
{
  "EventID": "ORD-123456",
  "DateTime": "2026-08-23T09:17:15.000Z",
  "SubscriberKey": "jane.doe@example.com",
  "EmailAddress": "jane.doe@example.com",
  "FirstName": "Jane",
  "LastName": "Doe",
  "TotalAmount": 74.98,
  "DiscountAmount": 10.00,
  "PromoCodeApplied": "ECHODOT10",
  "OrderDetails": [
    {
      "SKU": "AMZ-001",
      "ProductName": "Echo Dot (5th Gen) | Smart Speaker with Alexa",
      "Category": "smarthome",
      "Brand": "Amazon",
      "Quantity": 1,
      "UnitPrice": 49.99
    }
  ]
}
```
