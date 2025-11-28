'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'vegefoods-cart-v1';
    const PRODUCT_DETAIL_KEY = 'vegefoods-selected-product';
    const DELIVERY_FREE_THRESHOLD = 40000;
    const DELIVERY_FEE = 2000;
    const THEME_KEY = 'biopanier-theme';
    const PROMO_CODES = {
        BIENVENUE: { type: 'percent', value: 10, label: 'Bienvenue -10%' },
    };
    const DEFAULT_PRODUCTS = {
        'panier-vitamine-8kg': {
            name: 'Panier vitaminé 8kg',
            price: 12500,
            image: 'images/product-1.jpg',
            category: 'Panier découverte',
            badge: 'Best-seller',
        },
        'box-famille-veggie': {
            name: 'Box famille veggie',
            price: 15900,
            image: 'images/product-5.jpg',
            category: 'Box hebdo',
            badge: 'Box hebdo',
        },
        'haricots-verts-croquants': {
            name: 'Haricots verts croquants',
            price: 2400,
            image: 'images/product-3.jpg',
            category: 'Primeur',
            badge: 'Primeur',
        },
        'pack-detox-3-jours': {
            name: 'Pack detox 3 jours',
            price: 17500,
            image: 'images/product-8.jpg',
            category: 'Atelier jus',
            badge: 'Cure jus',
        },
        'panier-essentiel-6kg': {
            name: 'Panier Essentiel 6kg',
            price: 10900,
            image: 'images/product-6.jpg',
            category: 'Paniers hebdo',
            badge: 'Nouveau',
        },
        'fraises-bafoussam': {
            name: 'Fraises de Bafoussam',
            price: 3800,
            image: 'images/product-2.jpg',
            category: 'Fruits',
            badge: 'Récolte locale',
        },
        'carottes-granny-bio': {
            name: 'Carottes Granny Bio',
            price: 2900,
            image: 'images/product-7.jpg',
            category: 'Fruits',
            badge: 'Croquantes',
        },
        'jus-green-glow': {
            name: 'Jus Green Glow',
            price: 2200,
            image: 'images/product-11.jpg',
            category: 'Jus pressés',
            badge: 'Best-seller',
        },
        'mix-crudites-15kg': {
            name: 'Mix crudités 1,5kg',
            price: 4500,
            image: 'images/product-5.jpg',
            category: 'Légumes',
            badge: 'Prêt à cuisiner',
        },
        'chou-rouge-tendre': {
            name: 'Chou rouge tendre',
            price: 1800,
            image: 'images/product-4.jpg',
            category: 'Légumes',
            badge: 'Ultra frais',
        },
        'mix-snacks-energetiques': {
            name: 'Mix snacks énergétiques',
            price: 5200,
            image: 'images/product-9.jpg',
            category: 'Épicerie fine',
            badge: 'Sans additifs',
        },
        'pack-decouverte-smoothies': {
            name: 'Pack Découverte Smoothies',
            price: 12000,
            image: 'images/product-12.jpg',
            category: 'Jus pressés',
            badge: 'Dégustation',
        },
    };
    const CATEGORY_SLUG_MAP = {
        panier: 'panier',
        paniers: 'panier',
        'paniers hebdo': 'panier',
        fruits: 'fruits',
        primeur: 'fruits',
        legumes: 'legumes',
        'légumes': 'legumes',
        'jus presses': 'jus',
        'jus': 'jus',
        boissons: 'jus',
        epicerie: 'epicerie',
        'épicerie': 'epicerie',
        'epicerie fine': 'epicerie',
        'épicerie fine': 'epicerie',
    };
    const BLOG_POSTS = {
        'empreinte-carbone': {
            slug: 'empreinte-carbone',
            title: 'Réduire son empreinte carbone en cuisinant local',
            category: 'Impact',
            date: '15 mai 2025',
            readTime: '12 minutes de lecture',
            author: 'Megane Tsaffo',
            heroImage: 'images/category.jpg',
            inlineImage: 'images/image_3.jpg',
            tags: ['Circuits courts', 'Zero waste', 'Saison'],
            quote: '« Chaque panier livré représente 1,2 kg de CO₂ économisé par rapport à une chaîne conventionnelle » — Boris Ngoa',
            sections: [
                { type: 'p', text: "Adopter une cuisine responsable ne signifie pas renoncer au plaisir gustatif. Chez BioPanier, nous accompagnons plus de 12 000 familles et 80 restaurants pour élaborer des menus qui respectent la planète." },
                { type: 'h2', text: '1. Valoriser les circuits ultra-courts' },
                { type: 'p', text: "Choisissez des produits issus de fermes situées à moins de 150 km : vous réduisez l'empreinte transport et soutenez les producteurs locaux." },
                { type: 'blockquote', text: 'Notre hub logistique mutualise les trajets pour limiter les retours à vide.' },
                { type: 'h3', text: 'Conseils pratiques' },
                { type: 'ul', items: ['Planifiez vos menus chaque semaine.', 'Transformez les surplus en pickles, pestos ou confitures.', 'Optimisez le frigo en respectant les zones de température.'] },
                { type: 'h2', text: '2. Cuisiner les légumes de saison' },
                { type: 'p', text: 'Une aubergine hors saison peut générer 4x plus d’émissions. Appuyez-vous sur les paniers hebdo pour rester dans le calendrier.' },
                { type: 'h2', text: '3. Passer en énergie verte' },
                { type: 'p', text: 'Induction, cuisson vapeur douce, fours éco-performants : réduisez la consommation énergétique sans sacrifier le goût.' },
                { type: 'h2', text: '4. Réduire le gaspillage à la source' },
                { type: 'p', text: 'Fiches anti-gaspi personnalisées, chips d’épluchures, pestos de fanes : chaque geste compte pour une cuisine circulaire.' },
            ],
            cta: {
                title: 'Téléchargez notre guide transition cuisine durable',
                text: "Un PDF de 20 pages avec des recettes et des checklists d'équipements.",
            },
        },
        'smoothies-verts': {
            slug: 'smoothies-verts',
            title: '3 smoothies verts pour booster votre matinée',
            category: 'Recettes',
            date: '28 avril 2025',
            readTime: '8 minutes de lecture',
            author: 'Wilfred Ngassa',
            heroImage: 'images/image_1.jpg',
            inlineImage: 'images/product-11.jpg',
            tags: ['Recettes', 'Petit-déjeuner', 'Fibres'],
            quote: '« Un bon smoothie associe fibres, protéines et bons gras pour tenir jusqu’à midi. »',
            sections: [
                { type: 'p', text: 'Des recettes rapides, riches en fibres, adaptées aux produits du panier vitaminé.' },
                { type: 'h2', text: '1. Green Glow express' },
                { type: 'ul', items: ['1 poignée d’épinards', '1/2 mangue', '1 banane', '200 ml d’eau de coco', '1 c. à soupe de graines de chia'] },
                { type: 'p', text: 'Mixez 30 secondes. Ajoutez du jus de citron vert pour relever.' },
                { type: 'h2', text: '2. Morning cacao-protéines' },
                { type: 'ul', items: ['200 ml de lait végétal', '1 banane', '1 c. à soupe de cacao', '1 c. à soupe de beurre de cacahuète', 'Flocons d’avoine'] },
                { type: 'p', text: 'Mixez et laissez 2 minutes pour épaissir.' },
                { type: 'h2', text: '3. Boost tropical' },
                { type: 'ul', items: ['Ananas', 'Papaye', 'Menthe', 'Gingembre frais', 'Eau ou lait de coco'] },
                { type: 'p', text: 'Idéal après sport : vitamines + hydratation.' },
            ],
            cta: {
                title: 'Téléchargez le mini e-book smoothies',
                text: '6 recettes prêtes en 5 minutes, adaptées aux paniers BioPanier.',
            },
        },
        'portrait-rosine': {
            slug: 'portrait-rosine',
            title: 'Portrait · Rosine, productrice à Nkometou',
            category: 'Portraits',
            date: '10 avril 2025',
            readTime: '6 minutes de lecture',
            author: 'Charline Tchaweu',
            heroImage: 'images/image_2.jpg',
            inlineImage: 'images/person_1.jpg',
            tags: ['Producteurs', 'Agroforesterie', 'Impact'],
            quote: '« Diversifier les variétés protège mes sols et nos assiettes. » — Rosine',
            sections: [
                { type: 'p', text: 'Rosine cultive des légumes-feuilles en agroforesterie et forme d’autres agriculteurs.' },
                { type: 'h2', text: 'Une ferme qui inspire' },
                { type: 'p', text: 'Intercropping manioc, bananier, légumineuses : la parcelle reste fertile et humide.' },
                { type: 'h2', text: 'Transmettre les pratiques' },
                { type: 'p', text: 'Ateliers mensuels avec 25 producteurs, démonstrations compost et couverture des sols.' },
                { type: 'h2', text: 'Partenaire BioPanier' },
                { type: 'p', text: 'Rosine livre 3 fois par semaine. Ses salades et légumes-feuilles composent nos paniers Green.' },
            ],
            cta: {
                title: 'Visitez la ferme de Rosine',
                text: 'Inscrivez-vous à la prochaine visite terrain depuis votre espace client.',
            },
        },
        'meal-prep-ete': {
            slug: 'meal-prep-ete',
            title: "Meal prep d'été : 5 idées prêtes en 30 minutes",
            category: 'Organisation',
            date: '2 mai 2025',
            readTime: '10 minutes de lecture',
            author: 'Jordan Toulepi',
            heroImage: 'images/image_3.jpg',
            inlineImage: 'images/product-6.jpg',
            tags: ['Organisation', 'Batch cooking', 'Famille'],
            quote: '« Préparez 3 bases, déclinez-les en 5 repas : gain de temps assuré. »',
            sections: [
                { type: 'p', text: 'Des plats colorés et équilibrés avec les légumes de la semaine.' },
                { type: 'h2', text: 'Base 1 : légumes rôtis' },
                { type: 'p', text: 'Patates douces, carottes, courgettes à 190°C pendant 25 minutes. Utilisez-les en bowl, tacos ou omelette.' },
                { type: 'h2', text: 'Base 2 : céréales & légumineuses' },
                { type: 'p', text: 'Quinoa + pois chiches cuits d’avance pour des salades prêtes en 2 minutes.' },
                { type: 'h2', text: 'Base 3 : sauces rapides' },
                { type: 'ul', items: ['Pesto de fanes', 'Sauce yaourt-citron', 'Vinaigrette miel-moutarde'] },
                { type: 'p', text: 'Assemblez chaque soir : 10 minutes suffisent pour un repas complet.' },
            ],
            cta: {
                title: 'Téléchargez le plan de batch cooking',
                text: 'Planning sur 5 jours + liste de courses liée aux paniers hebdo.',
            },
        },
    };
    const PRODUCT_DESCRIPTIONS = {
        'panier-vitamine-8kg': '15 variétés de saison pour couvrir 5 repas + jus maison.',
        'box-famille-veggie': 'Box familiale 10 kg avec menus guidés pour 4 personnes.',
        'haricots-verts-croquants': 'Haricots verts très fins, prêts à poêler en 5 minutes.',
        'pack-detox-3-jours': 'Cure detox · 6 jus pressés à froid pour 3 jours.',
        'panier-essentiel-6kg': 'Mix de 5 fruits et 8 légumes de saison pour 3 repas équilibrés.',
        'fraises-bafoussam': 'Barquette de 500 g cueillie le matin même sur Bafoussam.',
        'carottes-granny-bio': 'Croquantes et acidulées, cultivées sur la ferme d’Obala.',
        'jus-green-glow': 'Concombre, pomme, persil, citron vert · pression à froid.',
        'mix-crudites-15kg': 'Carotte, concombre, betterave, laitue croquante · prêt à cuisiner.',
        'chou-rouge-tendre': 'Texture croquante, idéal pour salades et pickles maison.',
        'mix-snacks-energetiques': 'Noix de cajou grillées, ananas séché, chips de plantain.',
        'pack-decouverte-smoothies': '6 recettes signature, riche en fibres et sans sucres ajoutés.',
    };
    const SHOP_PRODUCTS = Object.entries(DEFAULT_PRODUCTS).map(([id, product], index) => ({
        id,
        ...product,
        description: PRODUCT_DESCRIPTIONS[id] || 'Récolté chaque matin sur nos fermes partenaires.',
        badge: product.badge || product.category || 'BioPanier',
        url: buildProductUrl({ id }),
        popularity: index,
    }));
    const SHOP_PAGINATION_SIZE = 8;

    const body = document.body;
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navMenu = document.querySelector('[data-nav]');
    const header = document.querySelector('.site-header');
    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select';
    const mqDesktop = window.matchMedia('(min-width: 961px)');


         
        function sanitizeCartData(raw) {
        const data = { items: [], promo: null };
        if (raw && typeof raw === 'object') {
            if (Array.isArray(raw.items)) {
                data.items = raw.items
                    .map((item) => ({
                        id: String(item.id || '').trim(),
                        name: String(item.name || '').trim(),
                        price: Number(item.price) || 0,
                        quantity: Number(item.quantity) || 0,
                        image: item.image ? String(item.image) : '',
                        url: item.url ? String(item.url) : 'product-single.html',
                        category: item.category ? String(item.category) : '',
                    }))
                    .filter((item) => item.id && item.name && item.price > 0 && item.quantity > 0);
            }
            if (raw.promo && typeof raw.promo.code === 'string' && raw.promo.code.trim()) {
                data.promo = { code: raw.promo.code.trim().toUpperCase() };
            }
        }
        return data;
    }

    function loadCart() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            return sanitizeCartData(raw);
        } catch (error) {
            console.warn('Cart: données invalides, réinitialisation.', error);
            return { items: [], promo: null };
        }
    }

    function saveCart(data) {
        const sanitized = sanitizeCartData(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        return sanitized;
    }

    function formatPrice(value) {
        const number = Number(value) || 0;
        return `${number.toLocaleString('fr-FR')} FCFA`;
    }

    function announce(message) {
        if (!announce.region) {
            const region = document.createElement('div');
            region.className = 'sr-only';
            region.setAttribute('aria-live', 'polite');
            body.appendChild(region);
            announce.region = region;
        }
        announce.region.textContent = message;
    }

    function getActivePromo(data) {
        if (!data.promo || typeof data.promo.code !== 'string') {
            return null;
        }
        const promo = PROMO_CODES[data.promo.code];
        return promo ? { code: data.promo.code, ...promo } : null;
    }

    function getTotals(data) {
        const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const promo = getActivePromo(data);
        let discount = 0;

        if (promo && promo.type === 'percent') {
            discount = Math.round((subtotal * promo.value) / 100);
        }

        const delivery = subtotal === 0 || subtotal >= DELIVERY_FREE_THRESHOLD ? 0 : DELIVERY_FEE;
        const total = Math.max(0, subtotal - discount + delivery);

        return { subtotal, discount, delivery, total, promo };
    }
    function normalizeCategorySlug(value) {
        const base = (value || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const compact = base.replace(/[^a-z0-9]+/g, ' ').trim();
        const direct = CATEGORY_SLUG_MAP[compact] || CATEGORY_SLUG_MAP[compact.replace(/\s+/g, ' ')] || compact.replace(/\s+/g, '-');
        return direct || 'all';
    }

    function buildProductUrl(product) {
        if (!product?.id) {
            return product?.url || 'product-single.html';
        }
        return `product-single.html?product=${encodeURIComponent(product.id)}`;
    }

    function saveSelectedProduct(product) {
        if (!product?.id) {
            return;
        }
        const payload = {
            ...DEFAULT_PRODUCTS[product.id],
            ...product,
            url: buildProductUrl(product),
        };
        try {
            localStorage.setItem(PRODUCT_DETAIL_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn('Impossible de mémoriser le produit sélectionné', error);
        }
    }

    function loadSelectedProduct() {
        try {
            const raw = JSON.parse(localStorage.getItem(PRODUCT_DETAIL_KEY) || 'null');
            if (raw?.id) {
                return raw;
            }
        } catch (error) {
            console.warn('Produit sélectionné invalide', error);
        }
        return null;
    }

    function getProductFromSlug(slug) {
        if (!slug) {
            return null;
        }
        const stored = loadSelectedProduct();
        if (stored?.id === slug) {
            return stored;
        }
        if (DEFAULT_PRODUCTS[slug]) {
            return { id: slug, ...DEFAULT_PRODUCTS[slug], url: buildProductUrl({ id: slug }) };
        }
        return null;
    }

    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('product') || '';
    }
function addToCart(product, quantity = 1) {
        if (!product?.id || !product?.name) {
            return;
        }

        const finalQuantity = Math.max(1, Number(quantity) || 1);
        const data = loadCart();
        const index = data.items.findIndex((item) => item.id === product.id);

        if (index >= 0) {
            data.items[index].quantity += finalQuantity;
        } else {
            data.items.push({
                id: product.id,
                name: product.name,
                price: Math.max(0, Number(product.price) || 0),
                quantity: finalQuantity,
                image: product.image || '',
                url: buildProductUrl(product),
                category: product.category || '',
            });
        }

        saveCart(data);
        refreshCartUI();
        announce(`« ${product.name} » a été ajouté au panier.`);
    }

    function setCartItemQuantity(productId, quantity) {
        const data = loadCart();
        const item = data.items.find((entry) => entry.id === productId);
        if (!item) {
            return;
        }

        item.quantity = Math.max(1, Number(quantity) || 1);
        saveCart(data);
        refreshCartUI();
    }

    function removeCartItem(productId) {
        const data = loadCart();
        const index = data.items.findIndex((entry) => entry.id === productId);
        if (index === -1) {
            return;
        }

        const [removed] = data.items.splice(index, 1);
        saveCart(data);
        refreshCartUI();
        announce(`« ${removed.name} » a été retiré du panier.`);
    }

    function clearCart() {
        saveCart({ items: [], promo: null });
        refreshCartUI();
    }

    function applyPromo(code) {
        const data = loadCart();

        if (!code || !code.trim()) {
            data.promo = null;
            saveCart(data);
            refreshCartUI();
            return { success: true, message: 'Aucune promotion appliquée.' };
        }

        const normalized = code.trim().toUpperCase();
        const promo = PROMO_CODES[normalized];

        if (!promo) {
            return { success: false, message: "Ce code n'est pas valide." };
        }

        data.promo = { code: normalized };
        saveCart(data);
        refreshCartUI();
        return { success: true, message: `Code ${normalized} appliqué : ${promo.label}.` };
    }


    function renderCheckoutSummary(data) {
        const checkoutSummary = document.querySelector('[data-checkout-summary]');
        if (!checkoutSummary) {
            return;
        }

        const checkoutItemsList = checkoutSummary.querySelector('[data-checkout-items]');
        const checkoutSubtotalEl = checkoutSummary.querySelector('[data-checkout-subtotal]');
        const checkoutDeliveryEl = checkoutSummary.querySelector('[data-checkout-delivery]');
        const checkoutTotalEl = checkoutSummary.querySelector('[data-checkout-total]');
        const checkoutDiscountRow = checkoutSummary.querySelector('[data-checkout-discount-row]');
        const checkoutDiscountEl = checkoutSummary.querySelector('[data-checkout-discount]');
        const checkoutEmpty = checkoutSummary.querySelector('[data-checkout-empty]');
        const checkoutForm = document.querySelector('[data-checkout-form]');
        const checkoutSubmitBtn = checkoutForm?.querySelector('[type="submit"]');

        const totals = getTotals(data);

        if (checkoutItemsList) {
            checkoutItemsList.innerHTML = '';
            data.items.forEach((item) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                `;
                checkoutItemsList.appendChild(li);
            });
        }

        if (checkoutEmpty) {
            checkoutEmpty.hidden = data.items.length > 0;
        }

        checkoutSubtotalEl && (checkoutSubtotalEl.textContent = formatPrice(totals.subtotal));
        checkoutDeliveryEl && (checkoutDeliveryEl.textContent = totals.delivery === 0 ? 'Offerte' : formatPrice(totals.delivery));
        checkoutTotalEl && (checkoutTotalEl.textContent = formatPrice(totals.total));

        if (checkoutDiscountRow && checkoutDiscountEl) {
            if (totals.discount > 0) {
                checkoutDiscountRow.hidden = false;
                checkoutDiscountEl.textContent = `- ${formatPrice(totals.discount)}`;
            } else {
                checkoutDiscountRow.hidden = true;
                checkoutDiscountEl.textContent = '-0 FCFA';
            }
        }

        if (checkoutSubmitBtn) {
            checkoutSubmitBtn.disabled = data.items.length === 0;
        }
    }

    function refreshCartUI() {
        const data = loadCart();
        updateCartBadge(data);
        renderCartPage(data);
        renderCheckoutSummary(data);
    }


    function updateCartBadge(data) {
        const count = data.items.reduce((total, item) => total + item.quantity, 0);
        const label =
            count === 0 ? '0 article dans le panier' : `${count} article${count > 1 ? 's' : ''} dans le panier`;

        document.querySelectorAll('[data-cart-count]').forEach((badge) => {
            badge.textContent = count;
            badge.setAttribute('aria-label', label);
        });
    }

    function renderCartPage(data) {
        const cartTableBody = document.querySelector('[data-cart-items]');
        if (!cartTableBody) {
            return;
        }

        const cartMessage = document.querySelector('[data-cart-message]');
        const cartSubtotalEl = document.querySelector('[data-cart-subtotal]');
        const cartDeliveryEl = document.querySelector('[data-cart-delivery]');
        const cartTotalEl = document.querySelector('[data-cart-total]');
        const cartDiscountRow = document.querySelector('[data-cart-discount-row]');
        const cartDiscountEl = document.querySelector('[data-cart-discount]');
        const cartPromoToggle = document.querySelector('[data-cart-toggle-promo]');
        const cartPromoSection = document.querySelector('[data-cart-promo]');
        const cartPromoInput = document.querySelector('[data-cart-promo-input]');
        const cartPromoFeedback = document.querySelector('[data-cart-promo-feedback]');
        const cartNote = document.querySelector('[data-cart-note]');

        const totals = getTotals(data);

        if (data.items.length === 0) {
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        <div class="cart-empty">
                            <h2>Votre panier est vide</h2>
                            <p>Ajoutez vos fruits et légumes biologiques préférés pour commencer votre commande.</p>
                            <a class="btn btn--primary" href="shop.html">Découvrir la boutique</a>
                        </div>
                    </td>
                </tr>
            `;
            cartMessage && (cartMessage.hidden = true);
            if (cartPromoSection) {
                cartPromoSection.hidden = true;
            }
            if (cartPromoToggle) {
                cartPromoToggle.textContent = 'Ajouter un code';
            }
        } else {
            cartTableBody.innerHTML = '';
            data.items.forEach((item) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="table__meta">
                            <div class="table__thumb">
                                <img src="${item.image || 'images/product-1.jpg'}" alt="${item.name}">
                            </div>
                            <div>
                                <strong>${item.name}</strong>
                                ${item.category ? `<p class="table__note">${item.category}</p>` : ''}
                            </div>
                        </div>
                    </td>
                    <td>${formatPrice(item.price)}</td>
                    <td>
                        <div class="quantity-selector">
                            <button type="button" aria-label="Diminuer la quantité de ${item.name}" data-cart-decrease="${item.id}">−</button>
                            <input type="number" value="${item.quantity}" min="1" aria-label="Quantité pour ${item.name}" data-cart-input="${item.id}">
                            <button type="button" aria-label="Augmenter la quantité de ${item.name}" data-cart-increase="${item.id}">+</button>
                        </div>
                    </td>
                    <td>${formatPrice(item.price * item.quantity)}</td>
                    <td><button class="link-remove" type="button" data-cart-remove="${item.id}">Retirer</button></td>
                `;
                cartTableBody.appendChild(row);
            });
            cartMessage && (cartMessage.hidden = false);
        }

        cartSubtotalEl && (cartSubtotalEl.textContent = formatPrice(totals.subtotal));
        cartDeliveryEl && (cartDeliveryEl.textContent = totals.delivery === 0 ? 'Offerte' : formatPrice(totals.delivery));
        cartTotalEl && (cartTotalEl.textContent = formatPrice(totals.total));

        if (cartDiscountRow && cartDiscountEl) {
            if (totals.discount > 0) {
                cartDiscountRow.hidden = false;
                cartDiscountEl.textContent = `- ${formatPrice(totals.discount)}`;
            } else {
                cartDiscountRow.hidden = true;
                cartDiscountEl.textContent = '-0 FCFA';
            }
        }

        if (cartPromoInput) {
            cartPromoInput.value = totals.promo ? totals.promo.code : '';
        }

        if (cartPromoFeedback) {
            cartPromoFeedback.textContent = '';
            cartPromoFeedback.classList.remove('is-success', 'is-error');
        }

        if (cartPromoToggle) {
            if (!cartPromoSection || cartPromoSection.hidden) {
                cartPromoToggle.textContent = totals.promo ? 'Modifier le code' : 'Ajouter un code';
            } else {
                cartPromoToggle.textContent = 'Masquer le code';
            }
        }

        if (cartNote) {
            if (totals.subtotal === 0) {
                cartNote.textContent = 'Paiement sécurisé · Orange Money, MTN, cartes Visa/Mastercard';
            } else if (totals.subtotal < DELIVERY_FREE_THRESHOLD) {
                const remaining = DELIVERY_FREE_THRESHOLD - totals.subtotal;
                cartNote.textContent = `Ajoutez ${formatPrice(remaining)} pour profiter de la livraison offerte.`;
            } else {
                cartNote.textContent =
                    'Livraison offerte sur votre commande. Paiement sécurisé · Orange Money, MTN, cartes Visa/Mastercard';
            }
        }
    }

    function renderCheckoutSummary(data) {
        const checkoutSummary = document.querySelector('[data-checkout-summary]');
        if (!checkoutSummary) {
            return;
        }

        const checkoutItemsList = checkoutSummary.querySelector('[data-checkout-items]');
        const checkoutSubtotalEl = checkoutSummary.querySelector('[data-checkout-subtotal]');
        const checkoutDeliveryEl = checkoutSummary.querySelector('[data-checkout-delivery]');
        const checkoutTotalEl = checkoutSummary.querySelector('[data-checkout-total]');
        const checkoutDiscountRow = checkoutSummary.querySelector('[data-checkout-discount-row]');
        const checkoutDiscountEl = checkoutSummary.querySelector('[data-checkout-discount]');
        const checkoutEmpty = checkoutSummary.querySelector('[data-checkout-empty]');
        const checkoutForm = document.querySelector('[data-checkout-form]');
        const checkoutSubmitBtn = checkoutForm?.querySelector('[type="submit"]');

        const totals = getTotals(data);

        if (checkoutItemsList) {
            checkoutItemsList.innerHTML = '';
            data.items.forEach((item) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                `;
                checkoutItemsList.appendChild(li);
            });
        }

        if (checkoutEmpty) {
            checkoutEmpty.hidden = data.items.length > 0;
        }

        checkoutSubtotalEl && (checkoutSubtotalEl.textContent = formatPrice(totals.subtotal));
        checkoutDeliveryEl && (checkoutDeliveryEl.textContent = totals.delivery === 0 ? 'Offerte' : formatPrice(totals.delivery));
        checkoutTotalEl && (checkoutTotalEl.textContent = formatPrice(totals.total));

        if (checkoutDiscountRow && checkoutDiscountEl) {
            if (totals.discount > 0) {
                checkoutDiscountRow.hidden = false;
                checkoutDiscountEl.textContent = `- ${formatPrice(totals.discount)}`;
            } else {
                checkoutDiscountRow.hidden = true;
                checkoutDiscountEl.textContent = '-0 FCFA';
            }
        }

        if (checkoutSubmitBtn) {
            checkoutSubmitBtn.disabled = data.items.length === 0;
        }
    }

    function refreshCartUI() {
        const data = loadCart();
        updateCartBadge(data);
        renderCartPage(data);
        renderCheckoutSummary(data);
    }


    function getProductFromElement(trigger) {
        const card = trigger.closest('[data-product-card]');
        if (!card) {
            return null;
        }
        return {
            id: card.dataset.productId,
            name: card.dataset.productName,
            price: Number(card.dataset.productPrice) || 0,
            image: card.dataset.productImage || '',
            url: card.dataset.productUrl || buildProductUrl({ id: card.dataset.productId }),
            category: card.dataset.productCategory || '',
        };
    }

    function initAddToCartButtons() {
        document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
            if (button.dataset.bound === 'true') {
                return;
            }
            button.dataset.bound = 'true';
            button.addEventListener('click', () => {
                const product = getProductFromElement(button);
                if (!product) {
                    return;
                }
                let quantity = 1;
                const quantityInput = button.closest('[data-product-card]')?.querySelector('[data-quantity-input]');
                if (quantityInput) {
                    quantity = Number(quantityInput.value) || 1;
                }
                addToCart(product, quantity);
            });
        });
    }

    function initProductDetailLinks() {
        document.querySelectorAll('[data-product-card] a[href*="product-single"]').forEach((link) => {
            if (link.dataset.bound === 'true') {
                return;
            }
            link.dataset.bound = 'true';
            const product = getProductFromElement(link);
            if (!product?.id) {
                return;
            }
            const detailUrl = buildProductUrl(product);
            link.setAttribute('href', detailUrl);
            link.addEventListener('click', () => saveSelectedProduct(product));
        });
    }

    function initBuyNowButtons() {
        document.querySelectorAll('[data-buy-now]').forEach((button) => {
            button.addEventListener('click', () => {
                const product = getProductFromElement(button);
                if (!product) {
                    return;
                }
                let quantity = 1;
                const quantityInput = button.closest('[data-product-card]')?.querySelector('[data-quantity-input]');
                if (quantityInput) {
                    quantity = Number(quantityInput.value) || 1;
                }
                addToCart(product, quantity);
                window.location.href = 'checkout.html';
            });
        });
    }

    const shopState = {
        page: 1,
        perPage: SHOP_PAGINATION_SIZE,
        sort: 'popular',
        filters: {
            category: 'all',
            badge: 'all',
            search: '',
            priceMin: '',
            priceMax: '',
        },
    };

    function filterShopProducts(list) {
        const { category, badge, search, priceMin, priceMax } = shopState.filters;
        const normalizedSearch = search.trim().toLowerCase();
        const min = Number(priceMin) || 0;
        const max = Number(priceMax) || 0;

        return list.filter((product) => {
            const categorySlug = normalizeCategorySlug(product.category);
            const badgeSlug = normalizeCategorySlug(product.badge);

            const categoryOk = category === 'all' || categorySlug === category || categorySlug.startsWith(category);
            const badgeOk = badge === 'all' || badgeSlug === badge;
            const priceOk = (!min || product.price >= min) && (!max || product.price <= max);
            const textOk =
                !normalizedSearch ||
                product.name.toLowerCase().includes(normalizedSearch) ||
                (product.description && product.description.toLowerCase().includes(normalizedSearch));

            return categoryOk && badgeOk && priceOk && textOk;
        });
    }

    function sortShopProducts(list) {
        const sorted = list.slice();
        switch (shopState.sort) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'new':
                sorted.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'popular':
            default:
                sorted.sort((a, b) => a.popularity - b.popularity);
        }
        return sorted;
    }

    function paginateShopProducts(list) {
        const totalPages = Math.max(1, Math.ceil(list.length / shopState.perPage));
        const currentPage = Math.min(Math.max(1, shopState.page), totalPages);
        const start = (currentPage - 1) * shopState.perPage;
        const end = start + shopState.perPage;
        return {
            items: list.slice(start, end),
            totalPages,
            currentPage,
        };
    }

    function renderShopProducts() {
        const productGrid = document.querySelector('[data-product-grid]');
        const emptyState = document.querySelector('[data-product-empty]');
        const countLabel = document.querySelector('[data-product-count]');
        const pagination = document.querySelector('[data-pagination]');
        const paginationPages = document.querySelector('[data-pagination-pages]');
        const paginationPrev = document.querySelector('[data-pagination-prev]');
        const paginationNext = document.querySelector('[data-pagination-next]');

        if (!productGrid) {
            return;
        }

        const filtered = filterShopProducts(SHOP_PRODUCTS);
        const sorted = sortShopProducts(filtered);
        const { items, totalPages, currentPage } = paginateShopProducts(sorted);
        shopState.page = currentPage;

        productGrid.innerHTML = '';

        items.forEach((product) => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.setAttribute('data-reveal', '');
            card.setAttribute('data-product-card', '');
            card.dataset.productId = product.id;
            card.dataset.productName = product.name;
            card.dataset.productPrice = product.price;
            card.dataset.productImage = product.image;
            card.dataset.productUrl = product.url;
            card.dataset.productCategory = product.category;
            card.dataset.categorySlug = normalizeCategorySlug(product.category);
            card.innerHTML = `
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-card__body">
                    <span class="product-card__category">${product.category || 'BioPanier'}</span>
                    <h3 class="product-card__title"><a href="${product.url}">${product.name}</a></h3>
                    <p>${product.description}</p>
                    <p class="product-card__price">${formatPrice(product.price)}</p>
                    <div class="product-card__actions">
                        <button class="btn btn--primary" type="button" data-add-to-cart>Ajouter</button>
                        <a class="btn btn--outline" href="${product.url}">Détails</a>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });

        if (countLabel) {
            const total = filtered.length;
            const start = filtered.length === 0 ? 0 : (currentPage - 1) * shopState.perPage + 1;
            const end = Math.min(currentPage * shopState.perPage, total);
            countLabel.textContent = `${total} résultat${total > 1 ? 's' : ''}${total ? ` · ${start}–${end}` : ''}`;
        }

        if (emptyState) {
            emptyState.hidden = filtered.length > 0;
        }

        if (pagination && paginationPages && paginationPrev && paginationNext) {
            pagination.hidden = totalPages <= 1;
            paginationPages.innerHTML = '';

            paginationPrev.classList.toggle('is-disabled', currentPage === 1);
            paginationPrev.setAttribute('aria-disabled', currentPage === 1 ? 'true' : 'false');
            paginationNext.classList.toggle('is-disabled', currentPage === totalPages);
            paginationNext.setAttribute('aria-disabled', currentPage === totalPages ? 'true' : 'false');

            for (let page = 1; page <= totalPages; page += 1) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'pagination__page';
                if (page === currentPage) {
                    btn.classList.add('is-active');
                }
                btn.textContent = String(page);
                btn.dataset.page = String(page);
                paginationPages.appendChild(btn);
            }
        }

        setupRevealAnimations();
        initAddToCartButtons();
        initProductDetailLinks();
    }

    function initShopFilters() {
        if (!document.body.classList.contains('page-shop')) {
            return;
        }
        const categorySelect = document.querySelector('[data-category-filter]');
        const sortSelect = document.querySelector('[data-sort-filter]');
        const resetBtn = document.querySelector('[data-category-reset]');
        const searchInput = document.querySelector('[data-search-filter]');
        const priceMinInput = document.querySelector('[data-price-min]');
        const priceMaxInput = document.querySelector('[data-price-max]');
        const badgeSelect = document.querySelector('[data-badge-filter]');
        const pagination = document.querySelector('[data-pagination]');

        const applyFilters = () => {
            shopState.filters.category = categorySelect?.value || 'all';
            shopState.sort = sortSelect?.value || 'popular';
            shopState.filters.search = searchInput?.value || '';
            shopState.filters.priceMin = priceMinInput?.value || '';
            shopState.filters.priceMax = priceMaxInput?.value || '';
            shopState.filters.badge = badgeSelect?.value || 'all';
            shopState.page = 1;
            renderShopProducts();
        };

        categorySelect?.addEventListener('change', () => applyFilters());
        sortSelect?.addEventListener('change', () => applyFilters());
        searchInput?.addEventListener('input', () => applyFilters());
        priceMinInput?.addEventListener('change', () => applyFilters());
        priceMaxInput?.addEventListener('change', () => applyFilters());
        badgeSelect?.addEventListener('change', () => applyFilters());

        resetBtn?.addEventListener('click', () => {
            if (categorySelect) categorySelect.value = 'all';
            if (sortSelect) sortSelect.value = 'popular';
            if (searchInput) searchInput.value = '';
            if (priceMinInput) priceMinInput.value = '';
            if (priceMaxInput) priceMaxInput.value = '';
            if (badgeSelect) badgeSelect.value = 'all';
            shopState.page = 1;
            shopState.filters = {
                category: 'all',
                badge: 'all',
                search: '',
                priceMin: '',
                priceMax: '',
            };
            shopState.sort = 'popular';
            renderShopProducts();
        });

        pagination?.addEventListener('click', (event) => {
            const pageBtn = event.target.closest('[data-page]');
            const isPrev = event.target.closest('[data-pagination-prev]');
            const isNext = event.target.closest('[data-pagination-next]');

            if (pageBtn) {
                shopState.page = Number(pageBtn.dataset.page) || 1;
                renderShopProducts();
            }

            if (isPrev) {
                shopState.page = Math.max(1, shopState.page - 1);
                renderShopProducts();
            }

            if (isNext) {
                shopState.page += 1;
                renderShopProducts();
            }
        });

        renderShopProducts();
    }

    function renderRelatedProducts(productId) {
        const relatedContainer = document.querySelector('[data-product-related]');
        if (!relatedContainer) {
            return;
        }

        const candidates = Object.keys(DEFAULT_PRODUCTS).filter((slug) => slug !== productId);
        const suggestions = candidates.slice(0, 3);

        if (!suggestions.length) {
            return;
        }

        relatedContainer.innerHTML = '';
        suggestions.forEach((slug) => {
            const product = DEFAULT_PRODUCTS[slug];
            const card = document.createElement('article');
            card.className = 'product-card';
            card.setAttribute('data-product-card', '');
            card.dataset.productId = slug;
            card.dataset.productName = product.name;
            card.dataset.productPrice = product.price;
            card.dataset.productImage = product.image;
            card.dataset.productUrl = buildProductUrl({ id: slug });
            card.dataset.productCategory = product.category;
            card.innerHTML = `
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-card__body">
                    <span class="product-card__category">${product.category || 'BioPanier'}</span>
                    <h3 class="product-card__title"><a href="${buildProductUrl({ id: slug })}">${product.name}</a></h3>
                    <p class="product-card__price">${formatPrice(product.price)}</p>
                    <div class="product-card__actions">
                        <button class="btn btn--primary" type="button" data-add-to-cart>Ajouter</button>
                        <a class="btn btn--outline" href="${buildProductUrl({ id: slug })}">Voir détails</a>
                    </div>
                </div>
            `;
            relatedContainer.appendChild(card);
        });

        initAddToCartButtons();
        initProductDetailLinks();
    }

    function renderProductDetailPage() {
        const detail = document.querySelector('[data-product-detail]');
        if (!detail) {
            return;
        }

        const slugFromUrl = getSlugFromUrl();
        const fallbackFromDom = getProductFromElement(detail);
        const product =
            getProductFromSlug(slugFromUrl) ||
            (fallbackFromDom?.id ? { ...DEFAULT_PRODUCTS[fallbackFromDom.id], ...fallbackFromDom } : null);

        if (!product?.id) {
            return;
        }

        const breadcrumb = document.querySelector('[data-product-breadcrumb]');
        const title = detail.querySelector('[data-product-title]');
        const price = detail.querySelector('[data-product-price-display]');
        const priceNote = detail.querySelector('[data-product-price-note]');
        const mainImage = detail.querySelector('[data-product-main-image]');
        const badge = detail.querySelector('[data-product-badge]');
        const status = document.querySelector('[data-product-status]');
        const tags = detail.querySelector('[data-product-tags]');

        const resolved = {
            ...product,
            name: product.name || 'Produit BioPanier',
            price: Math.max(0, Number(product.price) || 0),
            image: product.image || 'images/product-1.jpg',
            category: product.category || '',
            badge: product.badge || product.category || 'En stock',
            url: buildProductUrl(product),
        };

        detail.dataset.productId = resolved.id;
        detail.dataset.productSlug = resolved.id;
        detail.dataset.productName = resolved.name;
        detail.dataset.productPrice = resolved.price;
        detail.dataset.productImage = resolved.image;
        detail.dataset.productUrl = resolved.url;
        detail.dataset.productCategory = resolved.category;

        breadcrumb && (breadcrumb.textContent = resolved.name);
        title && (title.textContent = resolved.name);
        price && (price.textContent = formatPrice(resolved.price));
        priceNote && (priceNote.textContent = resolved.category ? `${resolved.category} · Livraison incluse` : 'Livraison incluse');
        mainImage && mainImage.setAttribute('src', resolved.image);
        mainImage && mainImage.setAttribute('alt', resolved.name);
        badge && (badge.textContent = resolved.badge);
        status && (status.textContent = `${resolved.category || 'En stock'} · Livraison 24h`);

        if (tags && resolved.category) {
            tags.innerHTML = '';
            ['Bio local', resolved.category, 'Fraîcheur garantie'].forEach((tagLabel) => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tagLabel;
                tags.appendChild(span);
            });
        }

        saveSelectedProduct(resolved);
        renderRelatedProducts(resolved.id);
    }

    function initProductQuantityControls() {
        document.querySelectorAll('[data-quantity-selector]').forEach((selector) => {
            const input = selector.querySelector('[data-quantity-input]');
            const decrease = selector.querySelector('[data-quantity-decrease]');
            const increase = selector.querySelector('[data-quantity-increase]');

            if (decrease && input) {
                decrease.addEventListener('click', () => {
                    const current = Number(input.value) || 1;
                    input.value = Math.max(1, current - 1);
                });
            }

            if (increase && input) {
                increase.addEventListener('click', () => {
                    const current = Number(input.value) || 1;
                    input.value = current + 1;
                });
            }

            if (input) {
                input.addEventListener('change', () => {
                    input.value = Math.max(1, Number(input.value) || 1);
                });
            }
        });
    }

    function initCartTableListeners() {
        const cartTableBody = document.querySelector('[data-cart-items]');
        if (!cartTableBody || cartTableBody.dataset.bound === 'true') {
            return;
        }
        cartTableBody.dataset.bound = 'true';

        cartTableBody.addEventListener('click', (event) => {
            const decreaseBtn = event.target.closest('[data-cart-decrease]');
            const increaseBtn = event.target.closest('[data-cart-increase]');
            const removeBtn = event.target.closest('[data-cart-remove]');

            if (decreaseBtn) {
                const id = decreaseBtn.dataset.cartDecrease;
                const data = loadCart();
                const item = data.items.find((entry) => entry.id === id);
                if (item && item.quantity > 1) {
                    setCartItemQuantity(id, item.quantity - 1);
                }
            }

            if (increaseBtn) {
                const id = increaseBtn.dataset.cartIncrease;
                const data = loadCart();
                const item = data.items.find((entry) => entry.id === id);
                if (item) {
                    setCartItemQuantity(id, item.quantity + 1);
                }
            }

            if (removeBtn) {
                const id = removeBtn.dataset.cartRemove;
                removeCartItem(id);
            }
        });

        cartTableBody.addEventListener('change', (event) => {
            const input = event.target.closest('input[data-cart-input]');
            if (!input) {
                return;
            }
            const id = input.dataset.cartInput;
            const value = Math.max(1, Number(input.value) || 1);
            setCartItemQuantity(id, value);
        });
    }

    function initCartPromoControls() {
        const cartPromoToggle = document.querySelector('[data-cart-toggle-promo]');
        const cartPromoSection = document.querySelector('[data-cart-promo]');
        const cartPromoApply = document.querySelector('[data-cart-apply-promo]');
        const cartPromoInput = document.querySelector('[data-cart-promo-input]');
        const cartPromoFeedback = document.querySelector('[data-cart-promo-feedback]');

        if (cartPromoToggle) {
            cartPromoToggle.addEventListener('click', () => {
                if (!cartPromoSection) {
                    return;
                }
                const shouldOpen = cartPromoSection.hidden;
                cartPromoSection.hidden = !shouldOpen;
                cartPromoToggle.textContent = shouldOpen ? 'Masquer le code' : 'Ajouter un code';
                if (shouldOpen) {
                    cartPromoInput?.focus();
                } else if (cartPromoFeedback) {
                    cartPromoFeedback.textContent = '';
                    cartPromoFeedback.classList.remove('is-success', 'is-error');
                }
            });
        }

        if (cartPromoApply && cartPromoInput) {
            cartPromoApply.addEventListener('click', () => {
                const { success, message } = applyPromo(cartPromoInput.value);
                if (cartPromoFeedback) {
                    cartPromoFeedback.textContent = message;
                    cartPromoFeedback.classList.toggle('is-success', success);
                    cartPromoFeedback.classList.toggle('is-error', !success);
                }
            });
        }
    }

function initCheckoutButton() {
        const checkoutButton = document.querySelector('[data-checkout-button]');
        if (!checkoutButton) {
            return;
        }
        checkoutButton.addEventListener('click', () => {
            const data = loadCart();
            if (data.items.length === 0) {
                announce('Votre panier est vide.');
                const cartPromoFeedback = document.querySelector('[data-cart-promo-feedback]');
                if (cartPromoFeedback) {
                    cartPromoFeedback.textContent = 'Ajoutez des produits avant de poursuivre.';
                    cartPromoFeedback.classList.add('is-error');
                }
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    function initCheckoutForm() {
        const checkoutForm = document.querySelector('[data-checkout-form]');
        if (!checkoutForm) {
            return;
        }

        const checkoutSuccess = document.querySelector('[data-checkout-success]');
        const checkoutSuccessText = document.querySelector('[data-checkout-success-text]');
        const checkoutSummary = document.querySelector('[data-checkout-summary]');
        const checkoutPromoInput = checkoutForm.querySelector('input[name="promo"]');

        const data = loadCart();
        const activePromo = getActivePromo(data);
        if (checkoutPromoInput && activePromo) {
            checkoutPromoInput.value = activePromo.code;
        }

        if (checkoutPromoInput) {
            checkoutPromoInput.addEventListener('change', () => {
                const { message } = applyPromo(checkoutPromoInput.value);
                announce(message);
            });
        }

        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const currentData = loadCart();
            if (currentData.items.length === 0) {
                announce('Le panier est vide, la commande ne peut pas être créée.');
                return;
            }

            const formData = new FormData(checkoutForm);
            const promoValue = (formData.get('promo') || '').toString();
            if (promoValue) {
                applyPromo(promoValue);
            }
            const customerName = formData.get('firstname') || 'client·e';
            const orderId = `VEG-${Date.now().toString().slice(-6)}`;

            console.group('Commande simulée');
            console.log('Numéro de commande :', orderId);
            console.log('Données client :', Object.fromEntries(formData.entries()));
            console.log('Panier :', currentData.items);
            console.groupEnd();

            clearCart();

            checkoutForm.setAttribute('hidden', 'true');
            checkoutSummary?.setAttribute('hidden', 'true');
            if (checkoutSuccess) {
                checkoutSuccess.hidden = false;
            }
            if (checkoutSuccessText) {
                checkoutSuccessText.textContent = `Merci ${customerName}, votre commande ${orderId} a bien été enregistrée. Nous revenons vers vous sous 2 heures pour confirmer la livraison.`;
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            announce('Votre commande a été enregistrée avec succès.');
        });
    }

    function initPodcastPlayer() {
        const toggle = document.querySelector('[data-podcast-toggle]');
        const audio = document.querySelector('[data-podcast-audio]');
        const status = document.querySelector('[data-podcast-status]');
        if (!toggle || !audio) {
            return;
        }

        const setLabel = (isPlaying, message) => {
            toggle.textContent = isPlaying ? 'Mettre en pause' : "Écouter l'épisode";
            toggle.setAttribute('aria-pressed', String(isPlaying));
            toggle.setAttribute('aria-label', isPlaying ? 'Mettre le podcast en pause' : "Lancer le podcast");
            toggle.classList.toggle('is-playing', isPlaying);
            if (status) {
                status.textContent = message || '';
            }
        };

        setLabel(!audio.paused && !audio.ended);

        toggle.addEventListener('click', () => {
            if (audio.paused) {
                audio.currentTime = 0;
                audio.play().then(() => setLabel(true)).catch((error) => {
                    console.warn('Podcast audio error', error);
                    setLabel(false, "Impossible de lire l'épisode");
                });
            } else {
                audio.pause();
                setLabel(false);
            }
        });

        audio.addEventListener('ended', () => setLabel(false));
        audio.addEventListener('pause', () => setLabel(false));
    }

    function setupRevealAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealEls = document.querySelectorAll('[data-reveal]');

        if (prefersReducedMotion) {
            revealEls.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        if (!revealEls.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -10% 0px',
            }
        );

        revealEls.forEach((el, index) => {
            el.style.setProperty('--reveal-delay', `${index * 60}ms`);
            observer.observe(el);
        });
    }
    function setupNavigation() {
            if (!navToggle || !navMenu) {
                return;
            }

            const navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            body.appendChild(navOverlay);
            let isOpen = false;

            function setNavState(open) {
                isOpen = open;
                navMenu.classList.toggle('is-open', open);
                navToggle.setAttribute('aria-expanded', String(open));
                body.classList.toggle('has-nav-open', open);
                navOverlay.classList.toggle('is-visible', open);

                if (open) {
                    const firstLink = navMenu.querySelector(focusableSelectors);
                    firstLink?.focus({ preventScroll: true });
                } else {
                    navToggle.focus({ preventScroll: true });
                }
            }

            navToggle.addEventListener('click', () => {
                setNavState(!isOpen);
            });

            navOverlay.addEventListener('click', () => setNavState(false));

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && isOpen) {
                    setNavState(false);
                }
            });

            navMenu.addEventListener('keydown', (event) => {
                if (!isOpen) {
                    return;
                }

                if (event.key === 'Escape') {
                    setNavState(false);
                    return;
                }

                if (event.key === 'Tab') {
                    const focusables = Array.from(navMenu.querySelectorAll(focusableSelectors));
                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];

                    if (event.shiftKey && document.activeElement === first) {
                        event.preventDefault();
                        last.focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first.focus();
                    }
                }
            });

            navMenu.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    if (!mqDesktop.matches) {
                        setNavState(false);
                    }
                });
            });

            mqDesktop.addEventListener('change', () => {
                if (mqDesktop.matches) {
                    setNavState(false);
                }
            });
    }

    function setupHeaderOnScroll() {
            if (!header) {
                return;
            }
            const toggleHeaderState = () => {
                header.classList.toggle('is-condensed', window.scrollY > 24);
            };
            toggleHeaderState();
            window.addEventListener('scroll', toggleHeaderState, { passive: true });
    }

    function initThemeToggle() {
        const root = document.documentElement;
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'dark') {
            root.classList.add('theme-dark');
        }

        const headerInner = document.querySelector('.site-header__inner');
        if (!headerInner) {
            return;
        }
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'theme-toggle';
        toggle.setAttribute('data-theme-toggle', '');
        headerInner.appendChild(toggle);

        const apply = (mode) => {
            if (mode === 'dark') {
                root.classList.add('theme-dark');
                localStorage.setItem(THEME_KEY, 'dark');
                toggle.textContent = '🌙';
                toggle.setAttribute('aria-label', 'Basculer en thème clair');
            } else {
                root.classList.remove('theme-dark');
                localStorage.setItem(THEME_KEY, 'light');
                toggle.textContent = '☀️';
                toggle.setAttribute('aria-label', 'Basculer en thème sombre');
            }
        };

        apply(root.classList.contains('theme-dark') ? 'dark' : 'light');

        toggle.addEventListener('click', () => {
            const next = root.classList.contains('theme-dark') ? 'light' : 'dark';
            apply(next);
        });
    }

    function renderBlogPostPage() {
        const article = document.querySelector('[data-blog-article]');
        if (!article) {
            return;
        }
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('post') || 'empreinte-carbone';
        const post = BLOG_POSTS[slug] || BLOG_POSTS['empreinte-carbone'];

        const titleEl = article.querySelector('[data-blog-title]');
        const dateEl = article.querySelector('[data-blog-date]');
        const timeEl = article.querySelector('[data-blog-time]');
        const authorEl = article.querySelector('[data-blog-author]');
        const tagContainer = article.querySelector('[data-blog-tags]');
        const heroLabel = article.querySelector('[data-blog-hero-label]');
        const coverEl = article.querySelector('[data-blog-cover]');
        const inlineCoverEl = article.querySelector('[data-blog-inline]');
        const quoteEl = article.querySelector('[data-blog-quote]');
        const bodyEl = article.querySelector('[data-blog-body]');
        const ctaTitle = article.querySelector('[data-blog-cta-title]');
        const ctaText = article.querySelector('[data-blog-cta-text]');
        const authorNameEl = article.querySelector('[data-blog-author-name]');
        const breadcrumb = document.querySelector('[data-blog-breadcrumb]');

        titleEl && (titleEl.textContent = post.title);
        breadcrumb && (breadcrumb.textContent = post.title);
        dateEl && (dateEl.textContent = post.date);
        timeEl && (timeEl.textContent = post.readTime);
        authorEl && (authorEl.textContent = post.author);
        authorNameEl && (authorNameEl.textContent = post.author);

        if (categoryEl) categoryEl.textContent = post.category;
        if (heroLabel) heroLabel.textContent = post.category;

        if (tagContainer) {
            tagContainer.innerHTML = '';
            post.tags.forEach((tag) => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tag;
                tagContainer.appendChild(span);
            });
        }

        coverEl && coverEl.setAttribute('src', post.heroImage);
        coverEl && coverEl.setAttribute('alt', post.title);
        inlineCoverEl && inlineCoverEl.setAttribute('src', post.inlineImage);
        inlineCoverEl && inlineCoverEl.setAttribute('alt', post.title);
        quoteEl && (quoteEl.textContent = post.quote);

        if (bodyEl) {
            bodyEl.innerHTML = '';
            post.sections.forEach((section) => {
                if (section.type === 'p') {
                    const p = document.createElement('p');
                    p.textContent = section.text;
                    bodyEl.appendChild(p);
                } else if (section.type === 'h2' || section.type === 'h3') {
                    const el = document.createElement(section.type);
                    el.textContent = section.text;
                    bodyEl.appendChild(el);
                } else if (section.type === 'blockquote') {
                    const bq = document.createElement('blockquote');
                    bq.textContent = section.text;
                    bodyEl.appendChild(bq);
                } else if (section.type === 'ul' && Array.isArray(section.items)) {
                    const ul = document.createElement('ul');
                    section.items.forEach((item) => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        ul.appendChild(li);
                    });
                    bodyEl.appendChild(ul);
                }
            });
        }

        if (ctaTitle) ctaTitle.textContent = post.cta.title;
        if (ctaText) ctaText.textContent = post.cta.text;
    }
   
    setupNavigation();
    setupHeaderOnScroll();
    initThemeToggle();
    setupRevealAnimations();
    initPodcastPlayer();
    initProductQuantityControls();
    initAddToCartButtons();
    initProductDetailLinks();
    initBuyNowButtons();
    initShopFilters();
    initCartTableListeners();
    initCartPromoControls();
    initCheckoutButton();
    initCheckoutForm();
    renderProductDetailPage();
    renderBlogPostPage();

    refreshCartUI();

    window.addEventListener('pageshow', refreshCartUI);
    window.addEventListener('load', refreshCartUI);
    window.addEventListener('storage', refreshCartUI);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            refreshCartUI();
        }
    });
});
        const categoryEl = article.querySelector('[data-blog-category]');
