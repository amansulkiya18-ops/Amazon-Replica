/**
 * app.js
 * 
 * Core application controller for Amazon Replica. Orchestrates the storefront display,
 * shopping cart actions, page routing (SPA), brand filtering, search bar queries,
 * customer account panels, and Marketing Cloud Next integrations.
 * 
 * Loaded as a standard script to support file:// protocol executions without CORS errors.
 */

// Pre-defined Popular Amazon Products
const PRODUCTS = [
    {
        id: 'AMZ-001',
        name: 'Echo Dot (5th Gen, 2022 release) | Smart Speaker with Alexa',
        brand: 'Amazon',
        category: 'smarthome',
        price: '49.99',
        rating: 4.7,
        ratingsCount: '84,204',
        description: 'Our best-sounding Echo Dot yet — enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass and vibrant sound in any room. Play music, audiobooks, and podcasts from Amazon Music, Apple Music, Spotify and others. Alexa is happy to help — ask Alexa for weather updates, to set hands-free timers, or to control compatible smart home devices.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><circle cx='150' cy='150' r='60' fill='%231a1a1a'/><circle cx='150' cy='150' r='56' fill='%232c2c2c'/><circle cx='150' cy='150' r='48' fill='%230f0f0f'/><circle cx='150' cy='206' r='30' fill='%2300a8e1' opacity='0.8' filter='blur(4px)'/><text x='150' y='155' fill='%23FFF' font-family='sans-serif' font-weight='bold' font-size='10' text-anchor='middle'>alexa</text></svg>"
    },
    {
        id: 'APL-002',
        name: 'Apple AirPods Pro (2nd Gen) | Wireless Earbuds with USB-C',
        brand: 'Apple',
        category: 'electronics',
        price: '249.00',
        rating: 4.8,
        ratingsCount: '32,950',
        description: 'Up to 2x more Active Noise Cancellation than the previous generation, so you will hear dramatically less noise during your commute and when you need to focus. Adaptive Audio dynamically blends Transparency mode and Active Noise Cancellation. Personalized Spatial Audio surrounds you in sound tailored to your ears.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><rect x='110' y='80' width='80' height='90' rx='20' fill='%23FFF' stroke='%23aaa' stroke-width='2'/><path d='M110 110 L90 180 M190 110 L210 180' stroke='%23FFF' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/><path d='M110 110 L90 180 M190 110 L210 180' stroke='%232C2C2C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
    },
    {
        id: 'SON-003',
        name: 'Sony WH-1000XM4 Wireless Premium Noise Cancelling Headphones',
        brand: 'Sony',
        category: 'electronics',
        price: '348.00',
        rating: 4.7,
        ratingsCount: '44,188',
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charging. Speak-to-chat technology automatically reduces volume during conversations.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><circle cx='100' cy='150' r='30' fill='%231a1a1a' stroke='%232c2c2c' stroke-width='2'/><circle cx='200' cy='150' r='30' fill='%231a1a1a' stroke='%232c2c2c' stroke-width='2'/><path d='M100 120 A 50 50 0 0 1 200 120' fill='none' stroke='%231a1a1a' stroke-width='8' stroke-linecap='round'/></svg>"
    },
    {
        id: 'AMZ-004',
        name: 'Kindle Paperwhite (16 GB) | 6.8" Display with Adjustable Warm Light',
        brand: 'Amazon',
        category: 'books',
        price: '149.99',
        rating: 4.7,
        ratingsCount: '19,832',
        description: 'Now with a 6.8" display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. Purpose-built for reading — with a flush-front design and 300 ppi glare-free display that reads like real paper. Waterproof reading, so you are free to read and relax at the beach, by the pool, or in the bath.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><rect x='80' y='60' width='140' height='200' rx='10' fill='%231E1E1E' stroke='%232c2c2c' stroke-width='2'/><rect x='90' y='70' width='120' height='150' fill='%23F6F6F4'/><text x='150' y='150' fill='%23444' font-family='sans-serif' font-size='12' text-anchor='middle'>Kindle Paperwhite</text></svg>"
    },
    {
        id: 'ANK-005',
        name: 'Anker PowerCore 20K | 20000mAh Portable Power Bank Charger',
        brand: 'Anker',
        category: 'electronics',
        price: '42.99',
        rating: 4.6,
        ratingsCount: '12,410',
        description: 'Ultra-high cell capacity: The massive 20,000mAh capacity provides more than 5 charges for iPhone XS, almost 5 full charges for Samsung Galaxy S10, and over 2 and a half charges for iPad mini. Advanced Charging Technology: Ankers exclusive PowerIQ and VoltageBoost technology combine to deliver an optimized charge to your devices.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><rect x='90' y='90' width='120' height='140' rx='12' fill='%231a1a1a' stroke='%232c2c2c' stroke-width='2'/><rect x='105' y='110' width='90' height='20' fill='%230D9488' opacity='0.3'/><circle cx='120' cy='180' r='6' fill='%230D9488'/></svg>"
    },
    {
        id: 'AMZ-006',
        name: 'Amazon Smart Plug | Works with Alexa',
        brand: 'Amazon',
        category: 'smarthome',
        price: '24.99',
        rating: 4.7,
        ratingsCount: '512,940',
        description: 'Amazon Smart Plug lets you voice control your lights, fans, coffee makers, and more. All you need is an Alexa-enabled device like Echo, Fire TV, tablet, or phone. Simple to set up and use — plug in, open the Alexa app, and get started in minutes. Compact design keeps your second outlet free.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><rect x='95' y='100' width='110' height='120' rx='8' fill='%23FFF' stroke='%232C2C2C' stroke-width='2'/><circle cx='130' cy='160' r='8' fill='%23DDD'/><circle cx='170' cy='160' r='8' fill='%23DDD'/><path d='M125 190 L175 190' stroke='%23DDD' stroke-width='4'/></svg>"
    },
    {
        id: 'BSE-007',
        name: 'Bose SoundLink Flex | Portable Bluetooth Waterproof Speaker',
        brand: 'Bose',
        category: 'electronics',
        price: '149.00',
        rating: 4.8,
        ratingsCount: '15,804',
        description: 'State-of-the-art design: SoundLink Flex outdoor speaker is packed with exclusive technologies and a custom-engineered transducer for deep, clear, and immersive audio at home or on the go. Waterproof and dustproof speaker: Rigorously tested to meet IP67 utility standards. PositionIQ technology detects orientation for optimal sound.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><rect x='75' y='110' width='150' height='100' rx='20' fill='%231a1a1a' stroke='%232c2c2c' stroke-width='2'/><line x1='90' y1='160' x2='210' y2='160' stroke='%23555' stroke-width='15' stroke-dasharray='2 4'/></svg>"
    },
    {
        id: 'BOK-008',
        name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits (Hardcover)',
        brand: 'Penguin',
        category: 'books',
        price: '16.20',
        rating: 4.9,
        ratingsCount: '154,800',
        description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies. Learn how to make time for new habits, overcome a lack of motivation, design your environment, and get back on track when you fall off course.',
        imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='320' viewBox='0 0 300 320'><rect width='100%' height='100%' fill='%23EAEDED'/><path d='M90 60 L210 60 L210 260 L90 260 Z' fill='%23002f6c' stroke='%232C2C2C' stroke-width='2'/><circle cx='150' cy='130' r='30' fill='%23f4a261' opacity='0.8'/><text x='150' y='210' fill='%23FFF' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>ATOMIC HABITS</text></svg>"
    }
];

// Brands Showcase Directory
const BRANDS_LIST = [
    { name: 'Amazon', letter: 'A', desc: 'Alexa enabled smart speakers, Kindle paperwhites, and home automation solutions.' },
    { name: 'Apple', letter: 'Ap', desc: 'Premium AirPods Pro, wireless acoustics, and high-performance tech devices.' },
    { name: 'Sony', letter: 'S', desc: 'Premium industry-leading active noise-cancelling headsets and audio accessories.' },
    { name: 'Anker', letter: 'An', desc: 'Global leader in high-capacity portable power banks, chargers, and docks.' },
    { name: 'Bose', letter: 'B', desc: 'Legendary waterproof outdoor sound and portable wireless Bluetooth acoustics.' }
];

// Active Promotions List mapped to validation and discount logics
const PROMOTIONS = {
    'ECHODOT10': {
        id: 'promo_echodot_20',
        name: 'Alexa Smart Home discount',
        category: 'smarthome',
        discountPercent: 0.20,
        description: '20% off all smart speakers and home connectors'
    },
    'SOUND15': {
        id: 'promo_premium_sound_15',
        name: 'Apple & Sony audio sale',
        category: 'electronics',
        discountPercent: 0.15,
        description: '15% off premium wireless earphones and headsets'
    },
    'POWER10': {
        id: 'promo_anker_10',
        name: 'Anker battery and power gear sale',
        category: 'electronics',
        discountPercent: 0.10,
        description: '10% off high-capacity battery power banks'
    }
};

class AppStore {
    constructor() {
        this.cart = [];
        this.selectedProduct = null;
        this.activePromoCode = '';
        this.activeBrands = [];
        this.activeCategory = 'all';
        this.activePage = 'shop';
        
        // Account State Data
        this.userProfile = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '+1 (555) 019-2834'
        };
        this.wallet = {
            cards: [
                { brand: 'Visa', last4: '4444', exp: '12/28', name: 'Jane Doe', isDefault: true }
            ],
            giftBalance: 25.00
        };
        
        this.initDOMElements();
        this.bindEvents();
        this.loadSavedConfig();
        
        // Render initial UI blocks & bind pre-rendered items
        this.bindStaticProducts();
        this.bindStaticBrands();
        this.bindStaticCategoriesPage();
        this.renderBrandsSidebar();
        this.renderHeaderDropdowns();
        this.updateCartCounts();
        this.syncUserProfileUI();
        this.renderSavedCards();
        
        // Track Initial Page View via Web SDK
        window.tracker.trackPageView('Homepage', 'Home');
    }

    initDOMElements() {
        // Drawers & Modals
        this.integrationPanel = document.getElementById('integration-panel');
        
        // Navigation Buttons & Links
        this.toggleIntegrationBtn = document.getElementById('toggle-integration-btn');
        this.closeIntegrationBtn = document.getElementById('close-integration-btn');
        this.homeLink = document.getElementById('home-link');
        
        this.navShopBtn = document.getElementById('nav-shop-btn');
        this.navBrandsBtn = document.getElementById('nav-brands-btn');
        this.navPromoBtn = document.getElementById('nav-promo-btn');
        this.navCartBtnLink = document.getElementById('nav-cart-btn-link');
        this.navCartBadge = document.getElementById('nav-cart-badge');
        
        // Header Account Actions
        this.navWelcomeUser = document.getElementById('nav-welcome-user');
        this.navAccountTriggerBtn = document.getElementById('nav-account-trigger-btn');
        this.navOrdersTriggerBtn = document.getElementById('nav-orders-trigger-btn');
        
        // Sub-nav Account triggers
        this.navAccountLinkBtn = document.getElementById('nav-account-link-btn');
        this.navSupportLinkBtn = document.getElementById('nav-support-link-btn');
        this.navCategoriesLinkBtn = document.getElementById('nav-categories-link-btn');
        
        // Integrated Search elements
        this.headerSearchForm = document.getElementById('header-search-form');
        this.searchCategorySelect = document.getElementById('search-category-select');
        this.searchQueryInput = document.getElementById('search-query-input');
        
        // Header Dropdown Lists
        this.headerCategoriesDropdown = document.getElementById('header-categories-dropdown');
        this.headerBrandsDropdown = document.getElementById('header-brands-dropdown');
        this.headerProductsDropdown = document.getElementById('header-products-dropdown');
        
        // SPA Page Blocks
        this.pages = {
            shop: document.getElementById('page-shop'),
            brands: document.getElementById('page-brands'),
            promotions: document.getElementById('page-promotions'),
            cart: document.getElementById('page-cart'),
            checkout: document.getElementById('page-checkout'),
            success: document.getElementById('page-success'),
            account: document.getElementById('page-account'),
            categories: document.getElementById('page-categories'),
            'product-details': document.getElementById('page-product-details')
        };
        
        // Account Page Views & Sub-panes
        this.accountCardsGrid = document.getElementById('account-cards-grid');
        this.accountBackBtn = document.getElementById('account-back-btn');
        this.accountSubPanes = document.querySelectorAll('.account-sub-pane');
        
        // Account Forms
        this.accountSecurityForm = document.getElementById('account-security-form');
        this.accountPaymentForm = document.getElementById('account-payment-form');
        this.accountSupportForm = document.getElementById('account-support-form');
        
        this.ordersHistoryList = document.getElementById('orders-history-list');
        this.savedCardsList = document.getElementById('saved-cards-list');
        this.giftcardWalletBalance = document.getElementById('giftcard-wallet-balance');
        this.redeemGiftcardInput = document.getElementById('redeem-giftcard-input');
        this.redeemGiftcardBtn = document.getElementById('redeem-giftcard-btn');
        
        // Shop Catalog Actions
        this.productsGrid = document.getElementById('products-grid');
        this.brandFiltersContainer = document.getElementById('brand-filters-container');
        
        // Brands Page Showcase
        this.brandsShowcaseGrid = document.getElementById('brands-showcase-grid');
        
        // Cart Page Actions
        this.cartTableBody = document.getElementById('cart-table-body');
        this.cartEmptyStateFull = document.getElementById('cart-empty-state-full');
        this.cartLayoutContainer = document.getElementById('cart-layout-container');
        this.cartSummaryWrapper = document.getElementById('cart-summary-wrapper');
        this.cartSubtotalVal = document.getElementById('cart-subtotal-val');
        this.cartDiscountVal = document.getElementById('cart-discount-val');
        this.cartDiscountRow = document.getElementById('cart-discount-row');
        this.cartTotalVal = document.getElementById('cart-total-val');
        
        // Cart Page Promo Inputs
        this.cartPagePromoInput = document.getElementById('cart-page-promo-input');
        this.applyPagePromoBtn = document.getElementById('apply-page-promo-btn');
        this.activePromoBadge = document.getElementById('active-promo-badge');
        this.promoBadgeText = document.getElementById('promo-badge-text');
        this.removePromoBtn = document.getElementById('remove-promo-btn');
        this.proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');
        
        // Checkout Page Actions
        this.checkoutForm = document.getElementById('checkout-form');
        this.checkoutItemsList = document.getElementById('checkout-summary-items-list');
        this.summarySubtotal = document.getElementById('summary-subtotal');
        this.summaryDiscountRow = document.getElementById('summary-discount-row');
        this.summaryDiscountVal = document.getElementById('summary-discount-val');
        this.summaryTotalVal = document.getElementById('summary-total-val');
        
        // Success Page Selectors
        this.successOrderId = document.getElementById('success-order-id');
        this.successOrderTotal = document.getElementById('success-order-total');
        this.successOrderEmail = document.getElementById('success-order-email');
        
        // Forms
        this.newsletterForm = document.getElementById('newsletter-form');
        
        // Dedicated Product Details Selectors
        this.detailsBreadcrumbCategory = document.getElementById('details-breadcrumb-category');
        this.detailsProductImg = document.getElementById('details-product-img');
        this.detailsProductName = document.getElementById('details-product-name');
        this.detailsProductPrice = document.getElementById('details-product-price');
        this.detailsBuyBoxPrice = document.getElementById('details-buy-box-price');
        this.detailsProductBrandLink = document.getElementById('details-product-brand-link');
        this.detailsProductStars = document.getElementById('details-product-stars');
        this.detailsProductBullets = document.getElementById('details-product-bullets');
        this.detailsQtySelect = document.getElementById('details-qty-select');
        this.detailsAddToCartBtn = document.getElementById('details-add-to-cart-btn');
        this.detailsBuyNowBtn = document.getElementById('details-buy-now-btn');

        // Config inputs
        this.configInputs = {
            mode: document.getElementsByName('integration-mode'),
            sdkTenant: document.getElementById('cfg-sdk-tenant'),
            sdkNamespace: document.getElementById('cfg-sdk-namespace'),
            sdkMid: document.getElementById('cfg-sdk-mid'),
            sfOrgId: document.getElementById('cfg-sf-orgid'),
            sfAuthUrl: document.getElementById('cfg-sf-authurl'),
            sfRestUrl: document.getElementById('cfg-sf-resturl'),
            sfClientId: document.getElementById('cfg-sf-clientid'),
            sfClientSecret: document.getElementById('cfg-sf-clientsecret'),
            dcIngestUrl: document.getElementById('cfg-dc-ingest-url'),
            dcSource: document.getElementById('cfg-dc-source'),
            dcEvent: document.getElementById('cfg-dc-event')
        };
    }

    bindEvents() {
        // Drawer Toggle Handlers
        this.toggleIntegrationBtn.addEventListener('click', () => this.toggleIntegration(true));
        this.closeIntegrationBtn.addEventListener('click', () => this.toggleIntegration(false));
        
        // Close integrations panel on action clicks
        document.querySelectorAll('.close-drawer-action').forEach(btn => {
            btn.addEventListener('click', () => this.toggleIntegration(false));
        });

        // Tab Navigation Routing
        this.homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchPage('shop');
        });
        this.navShopBtn.addEventListener('click', () => this.switchPage('shop'));
        this.navBrandsBtn.addEventListener('click', () => this.switchPage('brands'));
        this.navPromoBtn.addEventListener('click', () => this.switchPage('promotions'));
        this.navCartBtnLink.addEventListener('click', () => this.switchPage('cart'));
        this.navCategoriesLinkBtn.addEventListener('click', () => this.switchPage('categories'));
        
        // Account Link Routing
        this.navAccountTriggerBtn.addEventListener('click', () => this.switchPage('account'));
        this.navAccountLinkBtn.addEventListener('click', () => this.switchPage('account'));
        
        this.navOrdersTriggerBtn.addEventListener('click', () => {
            this.switchPage('account');
            this.showAccountSubPane('orders');
        });
        this.navSupportLinkBtn.addEventListener('click', () => {
            this.switchPage('account');
            this.showAccountSubPane('support');
        });
        
        // Route actions within pages
        document.querySelectorAll('.navigate-shop-action').forEach(btn => {
            btn.addEventListener('click', () => this.switchPage('shop'));
        });
        document.querySelectorAll('.navigate-cart-action').forEach(btn => {
            btn.addEventListener('click', () => this.switchPage('cart'));
        });

        // Amazon integrated search form submit handler
        this.headerSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.activeCategory = this.searchCategorySelect.value;
            const query = this.searchQueryInput.value.trim().toLowerCase();
            
            // Sync the catalog department headers active class
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-category') === this.activeCategory);
            });
            
            this.filterProducts(query);
            this.switchPage('shop');
            
            // Log Search Query Web SDK action
            window.tracker.logSystem(`Executed Amazon search: query="${query}" in Category="${this.activeCategory}"`);
        });

        // Apply Promotions page buttons clicks
        document.querySelectorAll('.apply-promo-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-code');
                this.applyCoupon(code);
                
                // Track Click Promotion SDK Event
                const promo = PROMOTIONS[code];
                if (promo) {
                    window.tracker.trackPromotionClick(promo.id, promo.name);
                }
                
                // Route to cart page to review discount
                this.switchPage('cart');
            });
        });

        // Sidebar ad banner click
        const adBtn = document.querySelector('.apply-ad-promo-btn');
        if (adBtn) {
            adBtn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-code');
                this.applyCoupon(code);
                
                const promo = PROMOTIONS[code];
                if (promo) {
                    window.tracker.trackPromotionClick(promo.id, promo.name);
                }
                this.switchPage('cart');
            });
        }

        // Apply cart page promo coupon button
        this.applyPagePromoBtn.addEventListener('click', () => {
            const code = this.cartPagePromoInput.value.trim().toUpperCase();
            if (code) {
                this.applyCoupon(code);
                this.cartPagePromoInput.value = '';
            }
        });
        this.removePromoBtn.addEventListener('click', () => {
            this.removeCoupon();
        });

        // Proceed to checkout routing
        this.proceedToCheckoutBtn.addEventListener('click', () => {
            this.switchPage('checkout');
        });

        // Filter Category catalog items
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.activeCategory = e.target.getAttribute('data-category');
                
                // Sync search category selector
                this.searchCategorySelect.value = this.activeCategory;
                
                this.filterProducts();
            });
        });

        // Checkout Trigger Handlers
        this.accountBackBtn.addEventListener('click', () => this.resetAccountView());

        // Submit Forms
        this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        this.checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));

        // 6 Account cards sub-pane triggers
        document.getElementById('account-card-orders').addEventListener('click', () => this.showAccountSubPane('orders'));
        document.getElementById('account-card-security').addEventListener('click', () => this.showAccountSubPane('security'));
        document.getElementById('account-card-payments').addEventListener('click', () => this.showAccountSubPane('payments'));
        document.getElementById('account-card-prime').addEventListener('click', () => this.showAccountSubPane('prime'));
        document.getElementById('account-card-giftcards').addEventListener('click', () => this.showAccountSubPane('giftcards'));
        document.getElementById('account-card-support').addEventListener('click', () => this.showAccountSubPane('support'));

        // Account Form Handlers
        this.accountSecurityForm.addEventListener('submit', (e) => this.handleSecuritySubmit(e));
        this.accountPaymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e));
        this.accountSupportForm.addEventListener('submit', (e) => this.handleSupportSubmit(e));
        this.redeemGiftcardBtn.addEventListener('click', () => this.handleGiftCardRedeem());

        // Binding Config Inputs for Dynamic Sync
        const handleConfigChange = () => this.saveConfigState();
        for (const key in this.configInputs) {
            if (key === 'mode') {
                this.configInputs.mode.forEach(radio => radio.addEventListener('change', handleConfigChange));
            } else {
                this.configInputs[key].addEventListener('input', handleConfigChange);
            }
        }

        // Console logger actions
        document.getElementById('clear-console-btn').addEventListener('click', () => {
            const consoleEl = document.getElementById('console-output');
            if (consoleEl) consoleEl.innerHTML = '';
            window.tracker.logSystem('Console cleared.');
        });
    }

    /* Page Routing Logic */

    switchPage(pageId) {
        // Toggle Active menu class names
        this.navShopBtn.classList.toggle('active', pageId === 'shop');
        this.navBrandsBtn.classList.toggle('active', pageId === 'brands');
        this.navPromoBtn.classList.toggle('active', pageId === 'promotions');
        this.navCartBtnLink.classList.toggle('active', pageId === 'cart');
        this.navCategoriesLinkBtn.classList.toggle('active', pageId === 'categories');
        
        // Hide all page containers and display target
        for (const key in this.pages) {
            this.pages[key].classList.remove('active');
        }
        
        const activePageEl = this.pages[pageId];
        if (activePageEl) {
            activePageEl.classList.add('active');
            this.activePage = pageId;
        }

        // Reset account page to standard grid view when navigating back to it
        if (pageId === 'account') {
            this.resetAccountView();
        }

        // Dispatch page tracking views dynamically
        if (pageId === 'shop') {
            window.tracker.trackPageView('Homepage', 'Home');
        } else if (pageId === 'brands') {
            window.tracker.trackPageView('Brands Showcase', 'Brands');
        } else if (pageId === 'promotions') {
            window.tracker.trackPageView('Promotions Page', 'Promotions');
            for (const code in PROMOTIONS) {
                const promo = PROMOTIONS[code];
                window.tracker.trackPromotionView(promo.id, promo.name);
            }
        } else if (pageId === 'cart') {
            this.renderCartPage();
            window.tracker.trackPageView('Cart Page', 'Cart');
        } else if (pageId === 'checkout') {
            this.renderCheckoutSummary();
            window.tracker.trackPageView('Checkout Page', 'Checkout');
        } else if (pageId === 'success') {
            window.tracker.trackPageView('Order Completion Page', 'Checkout');
        } else if (pageId === 'account') {
            window.tracker.trackPageView('Account Page', 'Account');
        } else if (pageId === 'categories') {
            window.tracker.trackPageView('Departments Page', 'Departments');
        }
        
        // Scroll back to top
        window.scrollTo(0, 0);

        // Reprocess the sitemap page configurations natively on transitions
        if (window.SalesforceInteractions && typeof window.SalesforceInteractions.reprocess === 'function') {
            window.SalesforceInteractions.reprocess();
        }
    }

    /* Dynamic Header Dropdowns populator and event bindings */
    renderHeaderDropdowns() {
        // 1. Categories Dropdown clicks mapping
        this.headerCategoriesDropdown.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cat = e.target.getAttribute('data-category');
                
                // Active corresponding catalog filter button
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-category') === cat);
                });
                
                // Sync search category selector
                this.searchCategorySelect.value = cat;
                
                this.activeCategory = cat;
                this.filterProducts();
                this.switchPage('shop');
                this.showToast(`Selected Department: ${e.target.textContent}`);
            });
        });

        // 2. Brands Dropdown population
        this.headerBrandsDropdown.innerHTML = '';
        BRANDS_LIST.forEach(brand => {
            const btn = document.createElement('button');
            btn.textContent = brand.name;
            btn.addEventListener('click', () => {
                // Set active brand filter
                this.activeBrands = [brand.name];
                
                // Track Brand selection SDK Event
                window.tracker.trackBrandSelection(brand.name);
                
                // Sync Brand checklist checks
                document.querySelectorAll('#brand-filters-container input').forEach(checkbox => {
                    checkbox.checked = checkbox.value === brand.name;
                });
                
                // Reset category filters
                this.activeCategory = 'all';
                this.searchCategorySelect.value = 'all';
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-category') === 'all');
                });
                
                this.filterProducts();
                this.switchPage('shop');
                this.showToast(`Showing products for brand: ${brand.name}`);
            });
            this.headerBrandsDropdown.appendChild(btn);
        });

        // 3. Products Dropdown population (Account widget)
        this.headerProductsDropdown.innerHTML = '';
        
        // Add Account Shortcuts
        const accLabel = document.createElement('div');
        accLabel.className = 'acc-dropdown-label';
        accLabel.innerHTML = `<strong>Your Account Shortcuts</strong>`;
        accLabel.style.padding = '8px 15px 4px 15px';
        accLabel.style.fontSize = '0.75rem';
        accLabel.style.textTransform = 'uppercase';
        accLabel.style.color = 'var(--text-secondary)';
        this.headerProductsDropdown.appendChild(accLabel);

        const ordersLink = document.createElement('button');
        ordersLink.textContent = 'Your Orders';
        ordersLink.addEventListener('click', () => {
            this.switchPage('account');
            this.showAccountSubPane('orders');
        });
        this.headerProductsDropdown.appendChild(ordersLink);

        const securityLink = document.createElement('button');
        securityLink.textContent = 'Login & Security';
        securityLink.addEventListener('click', () => {
            this.switchPage('account');
            this.showAccountSubPane('security');
        });
        this.headerProductsDropdown.appendChild(securityLink);

        const giftLink = document.createElement('button');
        giftLink.textContent = 'Gift Cards Wallet';
        giftLink.addEventListener('click', () => {
            this.switchPage('account');
            this.showAccountSubPane('giftcards');
        });
        this.headerProductsDropdown.appendChild(giftLink);

        const divider = document.createElement('div');
        divider.style.height = '1px';
        divider.style.backgroundColor = 'var(--border-color)';
        divider.style.margin = '5px 0';
        this.headerProductsDropdown.appendChild(divider);

        // Add Product Shortcuts
        const groupLabel = document.createElement('div');
        groupLabel.className = 'acc-dropdown-label';
        groupLabel.innerHTML = `<strong>Quick Product Views</strong>`;
        groupLabel.style.padding = '4px 15px';
        groupLabel.style.fontSize = '0.75rem';
        groupLabel.style.textTransform = 'uppercase';
        groupLabel.style.color = 'var(--text-secondary)';
        this.headerProductsDropdown.appendChild(groupLabel);

        PRODUCTS.forEach(product => {
            const btn = document.createElement('button');
            btn.textContent = product.name;
            btn.addEventListener('click', () => {
                this.openProductDetailsPage(product);
            });
            this.headerProductsDropdown.appendChild(btn);
        });
    }

    /* Statically Pre-rendered elements binding */

    bindStaticProducts() {
        document.querySelectorAll('.products-grid .product-card').forEach(card => {
            const prodId = card.getAttribute('data-prod-id');
            const product = PRODUCTS.find(p => p.id === prodId);
            if (!product) return;

            // Click image container -> Product Details Page
            const imgContainer = card.querySelector('.product-image-container');
            if (imgContainer) {
                imgContainer.addEventListener('click', () => {
                    this.openProductDetailsPage(product);
                });
            }

            // Quick Add to Cart button
            const addBtn = card.querySelector('.add-to-bag-quick');
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addToCart(product, 1);
                    this.showToast(`Added ${product.name} to Cart.`);
                });
            }
        });
    }

    bindStaticBrands() {
        document.querySelectorAll('.brands-showcase-grid .brand-card').forEach(card => {
            const brandName = card.getAttribute('data-brand-name');
            if (!brandName) return;

            card.addEventListener('click', () => {
                this.activeBrands = [brandName];
                window.tracker.trackBrandSelection(brandName);
                
                // Sync Sidebar checkboxes
                document.querySelectorAll('#brand-filters-container input').forEach(checkbox => {
                    checkbox.checked = checkbox.value === brandName;
                });
                
                this.activeCategory = 'all';
                this.searchCategorySelect.value = 'all';
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
                });
                
                this.filterProducts();
                this.switchPage('shop');
                this.showToast(`Showing products for ${brandName}`);
            });
        });
    }

    bindStaticCategoriesPage() {
        document.querySelectorAll('.categories-showcase-grid .category-showcase-card').forEach(card => {
            const category = card.getAttribute('data-category');
            if (!category) return;

            card.addEventListener('click', () => {
                this.activeCategory = category;
                this.searchCategorySelect.value = category;
                
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
                });

                this.filterProducts();
                this.switchPage('shop');
                this.showToast(`Showing department: ${category}`);
            });
        });
    }

    /* Dedicated Product Details Page controller */

    openProductDetailsPage(product) {
        this.selectedProduct = product;
        
        // Switch page SPA view
        this.switchPage('product-details');

        // Populate fields
        this.detailsBreadcrumbCategory.textContent = product.category.toUpperCase();
        this.detailsProductImg.src = product.imageUrl;
        this.detailsProductImg.alt = product.name;
        this.detailsProductName.textContent = product.name;
        this.detailsProductPrice.textContent = `$${product.price}`;
        this.detailsBuyBoxPrice.textContent = `$${product.price}`;
        this.detailsProductBrandLink.textContent = `Visit the ${product.brand} Store`;
        
        // Brand filter clicks inside details
        this.detailsProductBrandLink.onclick = (e) => {
            e.preventDefault();
            this.activeBrands = [product.brand];
            window.tracker.trackBrandSelection(product.brand);
            
            document.querySelectorAll('#brand-filters-container input').forEach(checkbox => {
                checkbox.checked = checkbox.value === product.brand;
            });
            this.activeCategory = 'all';
            this.searchCategorySelect.value = 'all';
            this.filterProducts();
            this.switchPage('shop');
        };

        // Render ratings stars
        let starsHTML = '';
        const floorRating = Math.floor(product.rating);
        for (let i = 0; i < 5; i++) {
            if (i < floorRating) {
                starsHTML += '<span class="star-icon">★</span>';
            } else {
                starsHTML += '<span class="star-icon" style="color: #ddd;">★</span>';
            }
        }
        this.detailsProductStars.innerHTML = `
            ${starsHTML}
            <span class="rating-count" style="margin-left: 5px;">${product.ratingsCount} ratings</span>
        `;

        // Render bullet lists
        this.detailsProductBullets.innerHTML = '';
        const bullets = product.description.split('.').filter(s => s.trim().length > 0);
        bullets.forEach(bullet => {
            const li = document.createElement('li');
            li.textContent = bullet.trim() + '.';
            this.detailsProductBullets.appendChild(li);
        });

        // Set default quantity selector value
        this.detailsQtySelect.value = '1';

        // Bind Buy Box Actions
        this.detailsAddToCartBtn.onclick = () => {
            const qty = parseInt(this.detailsQtySelect.value);
            this.addToCart(product, qty);
            this.switchPage('cart');
            this.showToast(`Added ${qty} ${product.name} to Cart.`, 'success');
        };

        this.detailsBuyNowBtn.onclick = () => {
            const qty = parseInt(this.detailsQtySelect.value);
            this.addToCart(product, qty);
            this.switchPage('checkout');
        };

        // Fire catalog object view sdk tracking event
        window.tracker.trackProductView(product);
    }

    /* Your Account sub-pane management */

    showAccountSubPane(paneKey) {
        // Hide card grid
        this.accountCardsGrid.classList.add('hidden');
        
        // Hide all sub-panes
        this.accountSubPanes.forEach(p => p.classList.add('hidden'));
        
        // Show target pane
        const targetPane = document.getElementById(`account-pane-${paneKey}`);
        if (targetPane) {
            targetPane.classList.remove('hidden');
            this.accountBackBtn.classList.remove('hidden');
            window.tracker.trackPageView(`Account - ${paneKey.toUpperCase()}`, 'Account');
        }
    }

    resetAccountView() {
        this.accountCardsGrid.classList.remove('hidden');
        this.accountSubPanes.forEach(p => p.classList.add('hidden'));
        this.accountBackBtn.classList.add('hidden');
    }

    syncUserProfileUI() {
        this.navWelcomeUser.textContent = `Hello, ${this.userProfile.name.split(' ')[0]}`;
        
        // Pre-fill forms
        document.getElementById('sec-name').value = this.userProfile.name;
        document.getElementById('sec-email').value = this.userProfile.email;
        document.getElementById('sec-phone').value = this.userProfile.phone;
        
        document.getElementById('checkout-first-name').value = this.userProfile.name.split(' ')[0] || '';
        document.getElementById('checkout-last-name').value = this.userProfile.name.split(' ').slice(1).join(' ') || '';
        document.getElementById('checkout-email').value = this.userProfile.email;
        document.getElementById('checkout-phone').value = this.userProfile.phone;
    }

    renderSavedCards() {
        this.savedCardsList.innerHTML = '';
        this.wallet.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'saved-card-item';
            cardEl.innerHTML = `
                <div class="card-brand-icon">💳</div>
                <div class="card-item-details">
                    <strong>${card.brand} ending in ${card.last4}</strong>
                    <span>Expires: ${card.exp} | Name: ${card.name}</span>
                </div>
                ${card.isDefault ? '<span class="default-card-badge">Default</span>' : ''}
            `;
            this.savedCardsList.appendChild(cardEl);
        });
    }

    filterProducts(searchQuery = '') {
        let filtered = PRODUCTS;
        
        if (this.activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.activeCategory);
        }
        
        if (this.activeBrands.length > 0) {
            filtered = filtered.filter(p => this.activeBrands.includes(p.brand));
        }

        if (searchQuery) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery) || p.brand.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery));
        }
        
        this.renderCatalog(filtered);
    }

    renderCatalog(products) {
        this.productsGrid.innerHTML = '';
        
        // Update results title count
        document.getElementById('catalog-title').textContent = `${products.length} Results`;

        if (products.length === 0) {
            this.productsGrid.innerHTML = `<p class="grid-empty">No products match your search details.</p>`;
            return;
        }
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-prod-id', product.id);
            card.setAttribute('data-category', product.category);
            card.setAttribute('data-brand', product.brand);
            
            // Build star ratings
            let starsHTML = '';
            const floorRating = Math.floor(product.rating);
            for (let i = 0; i < 5; i++) {
                if (i < floorRating) {
                    starsHTML += '<span class="star-icon">★</span>';
                } else {
                    starsHTML += '<span class="star-icon" style="color: #ddd;">★</span>';
                }
            }

            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <span class="product-badge-tag">${product.brand}</span>
                </div>
                <div class="product-info">
                    <span class="product-category-label">${product.category}</span>
                    <h3 class="product-card-title">${product.name}</h3>
                    
                    <div class="rating-stars">
                        ${starsHTML}
                        <span class="rating-count">${product.ratingsCount}</span>
                    </div>

                    <div class="product-card-price-row">
                        ${this.formatPriceToAmazon(product.price)}
                    </div>

                    <div class="prime-badge-row">
                        <span class="prime-label">prime</span>
                        <span class="delivery-date">FREE delivery Tomorrow</span>
                    </div>

                    <div class="product-card-actions">
                        <button class="btn btn-primary btn-block add-to-bag-quick" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            
            card.querySelector('.product-image-container').addEventListener('click', () => {
                this.openProductDetailsPage(product);
            });
            
            card.querySelector('.add-to-bag-quick').addEventListener('click', (e) => {
                e.stopPropagation();
                this.addToCart(product, 1);
                this.showToast(`Added ${product.name} to Cart.`);
            });

            this.productsGrid.appendChild(card);
        });
    }

    formatPriceToAmazon(price) {
        const parts = parseFloat(price).toFixed(2).split('.');
        return `<span class="price-currency">$</span><span class="price-val">${parts[0]}</span><span class="price-fraction">${parts[1]}</span>`;
    }

    updateCartCounts() {
        const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.navCartBadge.textContent = totalCount;
    }

    renderCartPage() {
        this.cartTableBody.innerHTML = '';
        
        if (this.cart.length === 0) {
            this.cartLayoutContainer.classList.add('hidden');
            this.cartEmptyStateFull.classList.remove('hidden');
            this.updateCartCounts();
            return;
        }

        this.cartLayoutContainer.classList.remove('hidden');
        this.cartEmptyStateFull.classList.add('hidden');
        
        let subtotal = 0.0;
        let discount = 0.0;

        this.cart.forEach(item => {
            const lineSub = parseFloat(item.product.price) * item.quantity;
            subtotal += lineSub;

            if (this.activePromoCode && PROMOTIONS[this.activePromoCode]) {
                const promo = PROMOTIONS[this.activePromoCode];
                if (promo.category === 'all' || item.product.category === promo.category) {
                    discount += lineSub * promo.discountPercent;
                }
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="table-product-cell">
                        <div class="table-product-img">
                            <img src="${item.product.imageUrl}" alt="${item.product.name}">
                        </div>
                        <div class="table-product-info">
                            <h4>${item.product.name}</h4>
                            <span>Brand: ${item.product.brand}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="cart-table-price">$${item.product.price}</span>
                </td>
                <td>
                    <div class="cart-table-qty-controls">
                        <button class="qty-dec-page" data-id="${item.product.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-inc-page" data-id="${item.product.id}">+</button>
                    </div>
                </td>
                <td>
                    <span class="cart-table-total">$${lineSub.toFixed(2)}</span>
                </td>
                <td>
                    <button class="cart-table-delete-btn" data-id="${item.product.id}">Delete</button>
                </td>
            `;

            tr.querySelector('.qty-dec-page').addEventListener('click', () => this.updateCartQty(item.product.id, item.quantity - 1));
            tr.querySelector('.qty-inc-page').addEventListener('click', () => this.updateCartQty(item.product.id, item.quantity + 1));
            tr.querySelector('.cart-table-delete-btn').addEventListener('click', () => this.updateCartQty(item.product.id, 0));

            this.cartTableBody.appendChild(tr);
        });

        const totalDue = subtotal - discount;
        this.cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;
        
        if (discount > 0) {
            this.cartDiscountRow.classList.remove('hidden');
            this.cartDiscountVal.textContent = `-$${discount.toFixed(2)}`;
        } else {
            this.cartDiscountRow.classList.add('hidden');
        }
        
        this.cartTotalVal.textContent = `$${totalDue.toFixed(2)}`;
        
        if (this.activePromoCode) {
            this.activePromoBadge.classList.remove('hidden');
            this.promoBadgeText.textContent = `${this.activePromoCode} (-$${discount.toFixed(2)})`;
        } else {
            this.activePromoBadge.classList.add('hidden');
        }

        this.updateCartCounts();
    }

    renderCheckoutSummary() {
        this.checkoutItemsList.innerHTML = '';
        
        let subtotal = 0.0;
        let discount = 0.0;

        this.cart.forEach(item => {
            const lineSub = parseFloat(item.product.price) * item.quantity;
            subtotal += lineSub;

            if (this.activePromoCode && PROMOTIONS[this.activePromoCode]) {
                const promo = PROMOTIONS[this.activePromoCode];
                if (promo.category === 'all' || item.product.category === promo.category) {
                    discount += lineSub * promo.discountPercent;
                }
            }

            const div = document.createElement('div');
            div.className = 'checkout-summary-item';
            div.innerHTML = `
                <div class="checkout-summary-item-left">
                    <span>${item.product.name}</span>
                    <span>Brand: ${item.product.brand} (Qty: ${item.quantity})</span>
                </div>
                <span class="checkout-summary-item-price">$${lineSub.toFixed(2)}</span>
            `;
            this.checkoutItemsList.appendChild(div);
        });

        const totalDue = subtotal - discount;
        this.summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        
        if (discount > 0) {
            this.summaryDiscountRow.classList.remove('hidden');
            this.summaryDiscountVal.textContent = `-$${discount.toFixed(2)}`;
        } else {
            this.summaryDiscountRow.classList.add('hidden');
        }

        this.summaryTotalVal.textContent = `$${totalDue.toFixed(2)}`;
    }

    /* Account Sub-pane Event Handlers */

    handleSecuritySubmit(e) {
        e.preventDefault();
        
        const newName = document.getElementById('sec-name').value;
        const newEmail = document.getElementById('sec-email').value;
        const newPhone = document.getElementById('sec-phone').value;
        
        this.userProfile = { name: newName, email: newEmail, phone: newPhone };
        this.syncUserProfileUI();
        
        this.showToast('Login & Security changes saved!', 'success');
        
        // Log Profile Identification Update via Interactions SDK
        window.tracker.trackIdentity(newEmail, newName.split(' ')[0], newName.split(' ').slice(1).join(' ') || '');
        window.tracker.logSystem(`Identity Profile Updated: Name="${newName}", Email="${newEmail}", Phone="${newPhone}"`);
    }

    handlePaymentSubmit(e) {
        e.preventDefault();
        
        const cardName = document.getElementById('pay-card-name').value;
        const cardNum = document.getElementById('pay-card-number').value.replace(/\s+/g, '');
        const cardExp = document.getElementById('pay-card-exp').value;
        
        if (cardNum.length < 4) {
            this.showToast('Invalid Credit Card number', 'error');
            return;
        }

        const last4Digits = cardNum.slice(-4);
        
        // Add card to wallet list
        this.wallet.cards.push({
            brand: 'Visa',
            last4: last4Digits,
            exp: cardExp,
            name: cardName,
            isDefault: false
        });
        
        this.renderSavedCards();
        this.accountPaymentForm.reset();
        
        this.showToast(`Saved Card Visa ending in ${last4Digits}!`, 'success');
        window.tracker.logSystem(`Wallet Updated: Added Visa card ending in "${last4Digits}" under name "${cardName}"`);
    }

    handleGiftCardRedeem() {
        const code = this.redeemGiftcardInput.value.trim().toUpperCase();
        if (!code) return;

        let amount = 0;
        if (code === 'AMZN50') {
            amount = 50.00;
        } else if (code === 'VOUCHER25') {
            amount = 25.00;
        } else {
            // Check if user entered active e-com promo codes
            const promo = PROMOTIONS[code];
            if (promo) {
                amount = 10.00;
            }
        }

        if (amount > 0) {
            this.wallet.giftBalance += amount;
            this.giftcardWalletBalance.textContent = `$${this.wallet.giftBalance.toFixed(2)}`;
            this.redeemGiftcardInput.value = '';
            
            this.showToast(`Redeemed code ${code} for $${amount.toFixed(2)}!`, 'success');
            window.tracker.logSystem(`Redeemed Gift Card Code "${code}" adding $${amount.toFixed(2)} to balance. New Balance: $${this.wallet.giftBalance.toFixed(2)}`);
        } else {
            this.showToast('Invalid Gift Card or Voucher code.', 'error');
        }
    }

    handleSupportSubmit(e) {
        e.preventDefault();
        
        const subject = document.getElementById('support-subject').value;
        const message = document.getElementById('support-message').value;
        
        this.showToast('Support ticket submitted successfully!', 'success');
        this.accountSupportForm.reset();
        
        // Log custom support event
        window.tracker.logSystem(`Helpdesk Support Ticket Logged: Subject="${subject}" Message="${message}"`);
    }

    /* Cart / Coupon Logic */

    addToCart(product, quantity) {
        const existing = this.cart.find(item => item.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.cart.push({ product, quantity });
        }
        
        window.tracker.trackCartUpdate(this.cart);
        this.updateCartCounts();
    }

    updateCartQty(productId, newQty) {
        const itemIndex = this.cart.findIndex(item => item.product.id === productId);
        if (itemIndex === -1) return;

        if (newQty <= 0) {
            this.cart.splice(itemIndex, 1);
        } else {
            this.cart[itemIndex].quantity = newQty;
        }

        if (this.activePage === 'cart') {
            this.renderCartPage();
        } else {
            this.updateCartCounts();
        }
        
        window.tracker.trackCartUpdate(this.cart);
    }

    applyCoupon(code) {
        const promo = PROMOTIONS[code];
        if (promo) {
            this.activePromoCode = code;
            if (this.activePage === 'cart') {
                this.renderCartPage();
            }
            this.showToast(`Applied coupon: ${code}`);
            window.tracker.logSystem(`Applied promotion code "${code}" (${promo.name}) to cart.`);
        } else {
            this.showToast(`Invalid promo code: ${code}`, 'error');
        }
    }

    removeCoupon() {
        if (this.activePromoCode) {
            this.activePromoCode = '';
            if (this.activePage === 'cart') {
                this.renderCartPage();
            }
            this.showToast('Coupon removed.');
        }
    }

    /* Modal Controls */

    toggleIntegration(open) {
        if (open) {
            this.integrationPanel.classList.add('open');
        } else {
            this.integrationPanel.classList.remove('open');
        }
    }

    closeModal(modalEl) {
        modalEl.classList.remove('open');
    }

    /* Form Submissions */

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('subscribe-email').value;
        const name = document.getElementById('subscribe-name').value;
        
        this.showToast('Submitting registry subscription...');
        
        window.tracker.trackIdentity(email, name);
        const result = await window.connector.submitLead(email, name);
        
        if (result.success) {
            this.showToast('Successfully registered in Amazon Registry!', 'success');
            this.newsletterForm.reset();
        } else {
            this.showToast(`Lead submission failed: ${result.error}`, 'error');
        }
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('checkout-email').value;
        const firstName = document.getElementById('checkout-first-name').value;
        const lastName = document.getElementById('checkout-last-name').value;
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        const subtotal = this.cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
        let discount = 0.0;
        
        if (this.activePromoCode && PROMOTIONS[this.activePromoCode]) {
            const promo = PROMOTIONS[this.activePromoCode];
            this.cart.forEach(item => {
                const lineSub = parseFloat(item.product.price) * item.quantity;
                if (promo.category === 'all' || item.product.category === promo.category) {
                    discount += lineSub * promo.discountPercent;
                }
            });
        }
        const total = subtotal - discount;
        
        this.showToast('Processing order checkout...');
        
        window.tracker.trackIdentity(email, firstName, lastName);
        window.tracker.trackPurchase(orderId, this.cart, total, discount, this.activePromoCode);
        
        const result = await window.connector.submitPurchase(orderId, email, firstName, lastName, this.cart, total, discount, this.activePromoCode);
        
        if (result.success) {
            this.successOrderId.textContent = orderId;
            this.successOrderTotal.textContent = `$${total.toFixed(2)}`;
            this.successOrderEmail.textContent = email;
            
            // Add order items to active orders page list
            this.prependOrderToHistory(orderId, this.cart, total);
            
            this.cart = [];
            this.activePromoCode = '';
            this.updateCartCounts();
            
            this.showToast(`Order Completed! ID: ${orderId}`, 'success');
            this.checkoutForm.reset();
            this.switchPage('success');
        } else {
            this.showToast(`Order API trigger failed: ${result.error}`, 'error');
        }
    }

    prependOrderToHistory(orderId, cartItems, totalAmount) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-history-card';
        
        let linesHTML = '';
        cartItems.forEach(item => {
            const itemSub = parseFloat(item.product.price) * item.quantity;
            linesHTML += `
                <div class="order-detail-line">
                    <span class="ord-line-title">${item.product.name}</span>
                    <span class="ord-line-qty">Qty: ${item.quantity}</span>
                    <span class="ord-line-price">$${itemSub.toFixed(2)}</span>
                </div>
            `;
        });

        const currentDateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        orderCard.innerHTML = `
            <div class="order-history-header">
                <div>
                    <span class="ord-meta-lbl">ORDER PLACED</span>
                    <span class="ord-meta-val">${currentDateStr}</span>
                </div>
                <div>
                    <span class="ord-meta-lbl">TOTAL</span>
                    <span class="ord-meta-val">$${totalAmount.toFixed(2)}</span>
                </div>
                <div>
                    <span class="ord-meta-lbl">SHIP TO</span>
                    <span class="ord-meta-val">${this.userProfile.name}</span>
                </div>
                <div class="ord-id-right">
                    <span class="ord-meta-lbl">ORDER #</span>
                    <span class="ord-meta-val">${orderId}</span>
                </div>
            </div>
            <div class="order-history-details">
                ${linesHTML}
                <div class="order-status-badge pending">Pending Dispatch</div>
            </div>
        `;
        
        // Prepend to order history container
        if (this.ordersHistoryList) {
            this.ordersHistoryList.insertBefore(orderCard, this.ordersHistoryList.firstChild);
        }
    }

    /* Config Persistence Layer */

    saveConfigState() {
        let activeMode = 'simulate';
        this.configInputs.mode.forEach(radio => {
            if (radio.checked) activeMode = radio.value;
        });

        const state = {
            mode: activeMode,
            sdkTenant: this.configInputs.sdkTenant.value,
            sdkNamespace: this.configInputs.sdkNamespace.value,
            sdkMid: this.configInputs.sdkMid.value,
            sfOrgId: this.configInputs.sfOrgId.value,
            sfAuthUrl: this.configInputs.sfAuthUrl.value,
            sfRestUrl: this.configInputs.sfRestUrl.value,
            sfClientId: this.configInputs.sfClientId.value,
            sfClientSecret: this.configInputs.sfClientSecret.value,
            dcIngestUrl: this.configInputs.dcIngestUrl.value,
            dcSource: this.configInputs.dcSource.value,
            dcEvent: this.configInputs.dcEvent.value
        };

        localStorage.setItem('sf_mcnext_config', JSON.stringify(state));

        window.tracker.updateConfig({
            mode: state.mode,
            tenantUrl: state.sdkTenant,
            namespace: state.sdkNamespace,
            mid: state.sdkMid
        });

        window.connector.updateConfig({
            mode: state.mode,
            orgId: state.sfOrgId,
            authUrl: state.sfAuthUrl,
            restUrl: state.sfRestUrl,
            clientId: state.sfClientId,
            clientSecret: state.sfClientSecret,
            dcIngestUrl: state.dcIngestUrl,
            dcSource: state.dcSource,
            dcEvent: state.dcEvent
        });
    }

    loadSavedConfig() {
        const raw = localStorage.getItem('sf_mcnext_config');
        if (!raw) {
            this.saveConfigState();
            return;
        }

        try {
            const state = JSON.parse(raw);
            
            this.configInputs.mode.forEach(radio => {
                radio.checked = radio.value === state.mode;
            });
            
            this.configInputs.sdkTenant.value = state.sdkTenant || '';
            this.configInputs.sdkNamespace.value = state.sdkNamespace || '';
            this.configInputs.sdkMid.value = state.sdkMid || '';
            this.configInputs.sfOrgId.value = state.sfOrgId || '';
            this.configInputs.sfAuthUrl.value = state.sfAuthUrl || '';
            this.configInputs.sfRestUrl.value = state.sfRestUrl || '';
            this.configInputs.sfClientId.value = state.sfClientId || '';
            this.configInputs.sfClientSecret.value = state.sfClientSecret || '';
            this.configInputs.dcIngestUrl.value = state.dcIngestUrl || '';
            this.configInputs.dcSource.value = state.dcSource || '';
            this.configInputs.dcEvent.value = state.dcEvent || '';

            window.tracker.updateConfig({
                mode: state.mode,
                tenantUrl: state.sdkTenant,
                namespace: state.sdkNamespace,
                mid: state.sdkMid
            });

            window.connector.updateConfig({
                mode: state.mode,
                orgId: state.sfOrgId,
                authUrl: state.sfAuthUrl,
                restUrl: state.sfRestUrl,
                clientId: state.sfClientId,
                clientSecret: state.sfClientSecret,
                dcIngestUrl: state.dcIngestUrl,
                dcSource: state.dcSource,
                dcEvent: state.dcEvent
            });
        } catch (e) {
            console.error('Config parsing error', e);
        }
    }

    /* UI Helper Methods */

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toast-in 0.3s reverse forwards ease';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3500);
    }
}

// Initial launch
document.addEventListener('DOMContentLoaded', () => {
    window.App = new AppStore();
});
