'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'vegefoods-cart-v1';
    const DELIVERY_FREE_THRESHOLD = 40000;
    const DELIVERY_FEE = 2000;
    const PROMO_CODES = {
        BIENVENUE: { type: 'percent', value: 10, label: 'Bienvenue -10%' },
    };

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
                url: product.url || 'product-single.html',
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




});