/**
 * sitemap.js
 * 
 * Salesforce Personalization (formerly Interaction Studio) Sitemap.
 * Maps the Amazon Replica Single-Page Application (SPA) pages, catalog events,
 * cart changes, and transactional checkouts to Personalization events.
 * 
 * Upload this file to your Salesforce Personalization Sitemap Editor or inject
 * it using the Salesforce Interactions SDK Launcher extension.
 */

// Helper to inject a popup modal dynamically using only the sitemap
function showSitemapPopup() {
    if (sessionStorage.getItem('sitemap_popup_shown')) return;
    sessionStorage.setItem('sitemap_popup_shown', 'true');

    const overlay = document.createElement('div');
    overlay.id = 'sitemap-popup-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 99999; font-family: sans-serif;';

    const modal = document.createElement('div');
    modal.style.cssText = 'background: #fff; padding: 30px; border-radius: 8px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3); position: relative; border-top: 4px solid #ffd814;';

    modal.innerHTML = `
        <button id='sitemap-popup-close' style='position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #555;'>&times;</button>
        <div style='font-size: 40px; margin-bottom: 10px;'>🎁</div>
        <h3 style='margin: 0 0 10px 0; color: #111;'>Sitemap Personalization Deal!</h3>
        <p style='margin: 0 0 20px 0; font-size: 0.95rem; color: #444; line-height: 1.4;'>Claim a complimentary <b>$50.00 Credit</b> to use on Alexa, AirPods, or Kindle devices!</p>
        <button id='sitemap-popup-claim' style='background-color: #ffd814; border: 1px solid #fcd200; border-radius: 100px; padding: 10px 20px; font-weight: bold; cursor: pointer; width: 100%;'>Claim My Credit</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('sitemap-popup-close').onclick = () => document.body.removeChild(overlay);
    document.getElementById('sitemap-popup-claim').onclick = () => {
        document.body.removeChild(overlay);
        if (window.App) {
            window.App.switchPage('account');
            window.App.showAccountSubPane('giftcards');
            const input = document.getElementById('redeem-giftcard-input');
            if (input) input.value = 'AMZN50';
        }
    };
}

// Diagnostic helper to inject a simple banner at the top of the homepage
function showHelloTest() {
    if (document.getElementById('sitemap-hello-test')) return;

    const banner = document.createElement('div');
    banner.id = 'sitemap-hello-test';
    banner.style.cssText = 'background: #ffd814; color: #111; text-align: center; padding: 12px; font-size: 1.25rem; font-weight: bold; border-bottom: 3px solid #e77600; font-family: sans-serif; position: relative; z-index: 100000;';
    banner.textContent = 'Hello test';

    document.body.insertBefore(banner, document.body.firstChild);
}

// Run immediately to prove sitemap file execution
showHelloTest();

// Global listener to trace Identity events using standard DOM listeners (supports barebones Data Cloud SDK)
document.addEventListener("submit", (e) => {
    if (!e.target) return;
    
    if (e.target.id === "account-security-form") {
        const name = document.getElementById("sec-name").value;
        const email = document.getElementById("sec-email").value;
        if (window.SalesforceInteractions && typeof window.SalesforceInteractions.reidentify === "function") {
            window.SalesforceInteractions.reidentify(email, {
                firstName: name.split(" ")[0],
                lastName: name.split(" ").slice(1).join(" ") || ""
            });
        }
    }
    
    if (e.target.id === "newsletter-form") {
        const name = document.getElementById("subscribe-name").value;
        const email = document.getElementById("subscribe-email").value;
        if (window.SalesforceInteractions && typeof window.SalesforceInteractions.reidentify === "function") {
            window.SalesforceInteractions.reidentify(email, {
                firstName: name
            });
        }
    }
});

// Sitemap Configuration
const sitemapConfig = {
    global: {
        locale: "en_US",
        listeners: []
    },
        pageTypes: [
            // 1. Homepage / Catalog Shop Page
            {
                name: "home_catalog",
                isMatch: () => {
                    const el = document.getElementById("page-shop");
                    return el && el.classList.contains("active");
                },
                interaction: {
                    name: "Homepage"
                },
                // Trigger the popup injection on page action match
                onAction: () => {
                    showSitemapPopup();
                }
            },
            
            // 2. Dedicated Product Details Page
            {
                name: "product_detail",
                isMatch: () => {
                    const el = document.getElementById("page-product-details");
                    return el && el.classList.contains("active");
                },
                interaction: {
                    name: "View Product Details",
                    catalogObject: {
                        type: "Product",
                        id: () => {
                            return window.App && window.App.selectedProduct ? window.App.selectedProduct.id : "";
                        },
                        attributes: {
                            name: () => {
                                const nameEl = document.getElementById("details-product-name");
                                return nameEl ? nameEl.textContent : "";
                            },
                            price: () => {
                                const priceEl = document.getElementById("details-product-price");
                                return priceEl ? parseFloat(priceEl.textContent.replace("$", "")) : 0;
                            },
                            category: () => {
                                const catEl = document.getElementById("details-breadcrumb-category");
                                return catEl ? catEl.textContent : "";
                            },
                            imageUrl: () => {
                                const imgEl = document.getElementById("details-product-img");
                                return imgEl ? imgEl.src : "";
                            }
                        }
                    }
                }
            },
            
            // 3. Departments / Categories Showcase Page
            {
                name: "departments_directory",
                isMatch: () => {
                    const el = document.getElementById("page-categories");
                    return el && el.classList.contains("active");
                },
                interaction: {
                    name: "View Departments Directory"
                }
            },
            
            // 4. Shopping Cart Page
            {
                name: "shopping_cart",
                isMatch: () => {
                    const el = document.getElementById("page-cart");
                    return el && el.classList.contains("active");
                },
                interaction: {
                    name: "View Cart",
                    lineItems: () => {
                        if (window.App && window.App.cart) {
                            return window.App.cart.map(item => ({
                                catalogObject: {
                                    type: "Product",
                                    id: item.product.id
                                },
                                quantity: item.quantity,
                                price: parseFloat(item.product.price)
                            }));
                        }
                        return [];
                    }
                }
            },
            
            // 5. Checkout Process Page
            {
                name: "checkout_review",
                isMatch: () => {
                    const el = document.getElementById("page-checkout");
                    return el && el.classList.contains("active");
                },
                interaction: {
                    name: "Checkout Progress"
                }
            },
            
            // 6. Order Success / Purchase Confirmation
            {
                name: "order_confirmation",
                isMatch: () => {
                    const el = document.getElementById("page-success");
                    return el && el.classList.contains("active");
                },
                interaction: {
                    name: "Purchase",
                    order: {
                        id: () => {
                            const ordEl = document.getElementById("success-order-id");
                            return ordEl ? ordEl.textContent : "";
                        },
                        totalValue: () => {
                            const totEl = document.getElementById("success-order-total");
                            return totEl ? parseFloat(totEl.textContent.replace("$", "")) : 0;
                        },
                        lineItems: () => {
                            // Returns line items from active cart before clearing
                            return [];
                        }
                    }
                }
            },
            
            // 7. Your Account Dashboard
            {
                name: "customer_account",
                isMatch: () => {
                    const el = document.getElementById("page-account");
                    return el && el.classList.contains("active");
                },
                interaction: {
                    name: "View Account Dashboard"
                }
            }
        ]
    };

    SalesforceInteractions.initSitemap(sitemapConfig);
