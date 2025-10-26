/**
 * THEME MANAGER
 *
 * Automatically applies the correct cascading theme layers based on page hierarchy.
 * Manages theme indicator bar and theme badges.
 */

const ThemeManager = (function() {
    'use strict';

    // Theme hierarchy configuration
    const THEME_LEVELS = {
        'celestial-dominion': {
            level: 0,
            name: 'Celestial Dominion',
            color: '#FFD700',
            bodyClass: '',
            cssFile: null // Always loaded in base
        },
        'visurena': {
            level: 1,
            name: 'House Visurena',
            color: '#D4AF37',
            bodyClass: 'theme-visurena',
            cssFile: null // Always loaded in base
        },
        'eterna-prime': {
            level: 2,
            name: 'Eterna Prime',
            color: '#1B3C70',
            bodyClass: 'theme-eterna-prime',
            cssFile: 'theme-eterna-prime.css'
        },
        'stellara-sonara': {
            level: 3,
            name: 'Stellara Sonara',
            color: '#0F52BA',
            bodyClass: 'theme-stellara-sonara',
            cssFile: 'theme-stellara-sonara.css'
        },
        'aurifex': {
            level: 4,
            name: 'High House Aurifex',
            color: '#6B8CC4',
            bodyClass: 'theme-aurifex',
            cssFile: null // Loaded in theme-houses.css
        },
        'virelia': {
            level: 4,
            name: 'High House Virelia',
            color: '#DC3545',
            bodyClass: 'theme-virelia',
            cssFile: null
        },
        'caeloria': {
            level: 4,
            name: 'High House Caeloria',
            color: '#FFD86B',
            bodyClass: 'theme-caeloria',
            cssFile: null
        },
        // Lesser Houses
        'lexomancer': {
            level: 5,
            name: 'House Lexomancer',
            color: '#A8B5C9',
            bodyClass: 'theme-lexomancer',
            parent: 'aurifex'
        },
        'architecton': {
            level: 5,
            name: 'House Architecton',
            color: '#5A7FA1',
            bodyClass: 'theme-architecton',
            parent: 'aurifex'
        },
        'promptwright': {
            level: 5,
            name: 'House Promptwright',
            color: '#6A4C93',
            bodyClass: 'theme-promptwright',
            parent: 'aurifex'
        },
        'imara': {
            level: 5,
            name: 'House Imara',
            color: '#C84B5B',
            bodyClass: 'theme-imara',
            parent: 'virelia'
        },
        'veyra': {
            level: 5,
            name: 'House Veyra',
            color: '#C8C8C8',
            bodyClass: 'theme-veyra',
            parent: 'virelia'
        },
        'reclinor': {
            level: 5,
            name: 'House Reclinor',
            color: '#CD7F32',
            bodyClass: 'theme-reclinor',
            parent: 'virelia'
        },
        'scriptorum': {
            level: 5,
            name: 'House Scriptorum',
            color: '#DAA520',
            bodyClass: 'theme-scriptorum',
            parent: 'caeloria'
        },
        'alchemere': {
            level: 5,
            name: 'House Alchemere',
            color: '#FFCA28',
            bodyClass: 'theme-alchemere',
            parent: 'caeloria'
        },
        'heraldis': {
            level: 5,
            name: 'House Heraldis',
            color: '#FFD700',
            bodyClass: 'theme-heraldis',
            parent: 'caeloria'
        }
    };

    // State
    let currentPageData = null;
    let activeThemes = [];

    /**
     * Initialize theme manager
     * @param {Object} pageData - Page hierarchy data from HTML
     */
    function init(pageData) {
        currentPageData = pageData;

        if (!pageData || !pageData.levels) {
            console.warn('ThemeManager: No page data provided');
            return;
        }

        // Determine active themes based on page hierarchy
        activeThemes = determineActiveThemes(pageData.levels);

        // Apply theme classes to body
        applyBodyThemeClasses();

        // Render theme indicator bar
        renderThemeIndicator();

        // Render theme badges
        renderThemeBadges();
    }

    /**
     * Determine which themes are active based on page hierarchy
     * @param {Array} levels - Array of hierarchy levels (e.g., ['celestial-dominion', 'visurena', ...])
     * @returns {Array} Active theme objects
     */
    function determineActiveThemes(levels) {
        const themes = [];

        // Always include base levels
        themes.push(THEME_LEVELS['celestial-dominion']);
        themes.push(THEME_LEVELS['visurena']);

        // Add additional levels based on page path
        levels.forEach(levelKey => {
            if (levelKey === 'celestial-dominion' || levelKey === 'visurena') {
                return; // Already added
            }

            const theme = THEME_LEVELS[levelKey];
            if (theme) {
                themes.push(theme);
            }
        });

        return themes.sort((a, b) => a.level - b.level);
    }

    /**
     * Apply theme classes to body element
     */
    function applyBodyThemeClasses() {
        const body = document.body;

        activeThemes.forEach(theme => {
            if (theme.bodyClass) {
                body.classList.add(theme.bodyClass);
            }
        });
    }

    /**
     * Render theme indicator bar at top of page
     */
    function renderThemeIndicator() {
        const indicator = document.getElementById('theme-indicator');
        if (!indicator) return;

        // Clear existing segments
        indicator.innerHTML = '';

        // Create segment for each active theme
        activeThemes.forEach(theme => {
            const segment = document.createElement('div');
            segment.className = `theme-indicator__segment theme-indicator__${getThemeClassSuffix(theme)}`;
            segment.style.background = theme.color;
            segment.setAttribute('title', theme.name);
            indicator.appendChild(segment);
        });
    }

    /**
     * Render theme badges showing hierarchy
     */
    function renderThemeBadges() {
        const container = document.getElementById('theme-badges');
        if (!container) return;

        // Clear existing badges
        container.innerHTML = '';

        // Create badge for each active theme (skip base levels for cleaner look)
        activeThemes.slice(2).forEach(theme => { // Skip Celestial Dominion & Visurena
            const badge = document.createElement('span');
            badge.className = `theme-badge theme-badge--${getThemeClassSuffix(theme)}`;
            badge.textContent = theme.name;
            badge.style.borderColor = theme.color;
            badge.style.color = theme.color;
            container.appendChild(badge);
        });

        // Show/hide container based on whether there are badges
        if (activeThemes.length <= 2) {
            container.style.display = 'none';
        }
    }

    /**
     * Get theme class suffix for CSS targeting
     * @param {Object} theme - Theme object
     * @returns {String} Class suffix
     */
    function getThemeClassSuffix(theme) {
        // Map theme names to CSS class suffixes
        const key = Object.keys(THEME_LEVELS).find(k => THEME_LEVELS[k] === theme);

        if (!key) return 'celestial';

        // Convert to CSS-friendly class name
        if (key === 'celestial-dominion') return 'celestial';
        if (key === 'visurena') return 'visurena';
        if (key === 'eterna-prime') return 'eterna-prime';
        if (key === 'stellara-sonara') return 'stellara';
        if (key.startsWith('aurifex')) return 'aurifex';
        if (key.startsWith('virelia')) return 'virelia';
        if (key.startsWith('caeloria')) return 'caeloria';

        return key;
    }

    /**
     * Get active theme hierarchy
     * @returns {Array} Active themes
     */
    function getActiveThemes() {
        return activeThemes;
    }

    /**
     * Get theme by key
     * @param {String} key - Theme key (e.g., 'aurifex')
     * @returns {Object} Theme object or null
     */
    function getTheme(key) {
        return THEME_LEVELS[key] || null;
    }

    /**
     * Check if a specific theme is active
     * @param {String} key - Theme key
     * @returns {Boolean}
     */
    function isThemeActive(key) {
        const theme = THEME_LEVELS[key];
        return theme ? activeThemes.includes(theme) : false;
    }

    /**
     * Get current page data
     * @returns {Object} Page data
     */
    function getPageData() {
        return currentPageData;
    }

    /**
     * Public API
     */
    return {
        init: init,
        getActiveThemes: getActiveThemes,
        getTheme: getTheme,
        isThemeActive: isThemeActive,
        getPageData: getPageData
    };

})();

// Export to global scope
window.ThemeManager = ThemeManager;
