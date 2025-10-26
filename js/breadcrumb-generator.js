/**
 * BREADCRUMB GENERATOR
 *
 * Automatically generates breadcrumb navigation based on page hierarchy.
 * Shows full path with color-coded levels and appropriate icons.
 */

const BreadcrumbGenerator = (function() {
    'use strict';

    // Breadcrumb configuration
    const BREADCRUMB_CONFIG = {
        'celestial-dominion': {
            name: 'Celestial Dominion',
            url: 'celestial-dominion.html',
            icon: '✦',
            class: 'celestial'
        },
        'visurena': {
            name: 'House Visurena',
            url: 'house-visurena.html',
            icon: '♔',
            class: 'visurena'
        },
        'eterna-prime': {
            name: 'Eterna Prime',
            url: 'eterna-prime/index.html',
            icon: '★',
            class: 'eterna-prime'
        },
        'stellara-sonara': {
            name: 'Stellara Sonara',
            url: 'stellara-sonara/index.html',
            icon: '♪',
            class: 'stellara'
        },
        // High Houses
        'aurifex': {
            name: 'High House Aurifex',
            url: 'stellara-sonara/aurifex/index.html',
            icon: '🕯️',
            class: 'aurifex',
            parent: 'stellara-sonara'
        },
        'virelia': {
            name: 'High House Virelia',
            url: 'stellara-sonara/virelia/index.html',
            icon: '🎨',
            class: 'virelia',
            parent: 'stellara-sonara'
        },
        'caeloria': {
            name: 'High House Caeloria',
            url: 'stellara-sonara/caeloria/index.html',
            icon: '🔥',
            class: 'caeloria',
            parent: 'stellara-sonara'
        },
        // Lesser Houses - Aurifex
        'lexomancer': {
            name: 'House Lexomancer',
            url: 'stellara-sonara/aurifex/lexomancer.html',
            icon: '📖',
            class: 'aurifex',
            parent: 'aurifex'
        },
        'architecton': {
            name: 'House Architecton',
            url: 'stellara-sonara/aurifex/architecton.html',
            icon: '📐',
            class: 'aurifex',
            parent: 'aurifex'
        },
        'promptwright': {
            name: 'House Promptwright',
            url: 'stellara-sonara/aurifex/promptwright.html',
            icon: '🪶',
            class: 'aurifex',
            parent: 'aurifex'
        },
        // Lesser Houses - Virelia
        'imara': {
            name: 'House Imara',
            url: 'stellara-sonara/virelia/imara.html',
            icon: '✋',
            class: 'virelia',
            parent: 'virelia'
        },
        'veyra': {
            name: 'House Veyra',
            url: 'stellara-sonara/virelia/veyra.html',
            icon: '🦉',
            class: 'virelia',
            parent: 'virelia'
        },
        'reclinor': {
            name: 'House Reclinor',
            url: 'stellara-sonara/virelia/reclinor.html',
            icon: '🔨',
            class: 'virelia',
            parent: 'virelia'
        },
        // Lesser Houses - Caeloria
        'scriptorum': {
            name: 'House Scriptorum',
            url: 'stellara-sonara/caeloria/scriptorum.html',
            icon: '✒️',
            class: 'caeloria',
            parent: 'caeloria'
        },
        'alchemere': {
            name: 'House Alchemere',
            url: 'stellara-sonara/caeloria/alchemere.html',
            icon: '🏆',
            class: 'caeloria',
            parent: 'caeloria'
        },
        'heraldis': {
            name: 'House Heraldis',
            url: 'stellara-sonara/caeloria/heraldis.html',
            icon: '🎺',
            class: 'caeloria',
            parent: 'caeloria'
        }
    };

    /**
     * Initialize breadcrumb generator
     * @param {Object} pageData - Page hierarchy data
     */
    function init(pageData) {
        if (!pageData || !pageData.levels) {
            console.warn('BreadcrumbGenerator: No page data provided');
            return;
        }

        generateBreadcrumbs(pageData);
    }

    /**
     * Generate breadcrumb navigation
     * @param {Object} pageData - Page data with levels array
     */
    function generateBreadcrumbs(pageData) {
        const container = document.getElementById('breadcrumb');
        if (!container) return;

        // Clear existing breadcrumbs
        container.innerHTML = '';

        // Always start with Home
        const homeItem = createBreadcrumbItem({
            name: 'Home',
            url: getPathToRoot() + 'index.html',
            icon: '⌂',
            class: 'celestial'
        }, false);
        container.appendChild(homeItem);

        // Build breadcrumb path from levels
        const levels = pageData.levels || [];

        levels.forEach((levelKey, index) => {
            const config = BREADCRUMB_CONFIG[levelKey];

            if (!config) return; // Skip unknown levels

            // Add separator
            const separator = createSeparator();
            container.appendChild(separator);

            // Determine if this is the current page (last item)
            const isCurrentPage = index === levels.length - 1;

            // Create breadcrumb item
            const item = createBreadcrumbItem(config, isCurrentPage);
            container.appendChild(item);
        });
    }

    /**
     * Create a breadcrumb item
     * @param {Object} config - Breadcrumb configuration
     * @param {Boolean} isCurrent - Whether this is the current page
     * @returns {HTMLElement} Breadcrumb item element
     */
    function createBreadcrumbItem(config, isCurrent) {
        const item = document.createElement('div');
        item.className = `breadcrumb__item breadcrumb__item--${config.class}`;

        if (isCurrent) {
            // Current page - not a link
            item.classList.add('breadcrumb__item--current');
            item.innerHTML = `
                ${config.icon ? `<span class="breadcrumb__icon">${config.icon}</span>` : ''}
                <span>${config.name}</span>
            `;
        } else {
            // Clickable link
            const link = document.createElement('a');
            link.href = getPathToRoot() + config.url;
            link.className = 'breadcrumb__link';
            link.innerHTML = `
                ${config.icon ? `<span class="breadcrumb__icon">${config.icon}</span>` : ''}
                <span>${config.name}</span>
            `;
            item.appendChild(link);
        }

        return item;
    }

    /**
     * Create breadcrumb separator
     * @returns {HTMLElement} Separator element
     */
    function createSeparator() {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb__separator';
        separator.textContent = '›';
        separator.setAttribute('aria-hidden', 'true');
        return separator;
    }

    /**
     * Get path to root based on current URL depth
     * @returns {String} Relative path to root
     */
    function getPathToRoot() {
        const path = window.location.pathname;
        const fileName = path.substring(path.lastIndexOf('/') + 1);

        // Count directory depth
        const parts = path.split('/').filter(p => p && p !== fileName);
        const depth = parts.length;

        // Calculate relative path
        if (depth === 0) {
            return './';
        }

        // If we're in the-eternal-codex directory
        const codexIndex = parts.indexOf('the-eternal-codex');
        if (codexIndex >= 0) {
            const relativeDepth = parts.length - codexIndex - 1;
            return relativeDepth > 0 ? '../'.repeat(relativeDepth) : './';
        }

        return '../'.repeat(depth);
    }

    /**
     * Update breadcrumb for a specific level
     * @param {String} levelKey - Level key to update
     * @param {Object} newConfig - New configuration
     */
    function updateLevel(levelKey, newConfig) {
        if (BREADCRUMB_CONFIG[levelKey]) {
            BREADCRUMB_CONFIG[levelKey] = {
                ...BREADCRUMB_CONFIG[levelKey],
                ...newConfig
            };
        }
    }

    /**
     * Get breadcrumb configuration
     * @param {String} levelKey - Level key
     * @returns {Object} Configuration object or null
     */
    function getConfig(levelKey) {
        return BREADCRUMB_CONFIG[levelKey] || null;
    }

    /**
     * Public API
     */
    return {
        init: init,
        updateLevel: updateLevel,
        getConfig: getConfig
    };

})();

// Export to global scope
window.BreadcrumbGenerator = BreadcrumbGenerator;
