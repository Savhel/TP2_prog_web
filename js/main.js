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










});