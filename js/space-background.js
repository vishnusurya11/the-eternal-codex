/**
 * LIGHTWEIGHT SPACE BACKGROUND INITIALIZER - PERFORMANCE OPTIMIZED
 *
 * Creates minimal static DOM elements for best performance
 * - Device detection to skip heavy elements on low-end devices
 * - Only 2 nebula layers (from 5)
 * - Only 3 star layers with 10 stars total (from 45+)
 * - GPU acceleration enabled
 * - NO ANIMATIONS
 */

(function() {
    'use strict';

    // Device detection
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const isLowEnd = detectLowEndDevice();

    /**
     * Detect low-end devices that struggle with blur filters
     */
    function detectLowEndDevice() {
        // Check for reduced motion preference (often enabled on low-end devices)
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return true;
        }

        // Check for low memory (< 4GB indicates mobile/low-end)
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            return true;
        }

        // Check for slow connection (indicates mobile/limited device)
        if (navigator.connection) {
            const conn = navigator.connection;
            if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g') {
                return true;
            }
            if (conn.saveData) {
                return true; // User has data saver enabled
            }
        }

        return false;
    }

    /**
     * Initialize lightweight space background
     */
    function init() {
        console.log('🌌 Initializing lightweight space background...');
        console.log(`Device: ${isMobile ? 'Mobile' : 'Desktop'}, Low-end: ${isLowEnd}`);

        // Skip nebula on mobile or low-end devices
        if (!isMobile && !isLowEnd) {
            createNebulaLayers();
        } else {
            console.log('⚡ Skipping nebula layers for performance');
        }

        // Always create stars (very lightweight)
        createStarLayers();

        // Always create vignette (no blur, very lightweight)
        createVignette();

        console.log('✅ Space background initialized');
    }

    /**
     * Create 2 lightweight nebula layers (desktop only)
     */
    function createNebulaLayers() {
        const body = document.body;

        // Layer 4: Teal/Cyan (mid-depth) - 15px blur
        const nebula4 = document.createElement('div');
        nebula4.className = 'nebula-layer-4';
        body.appendChild(nebula4);

        // Layer 5: Royal Blue (near) - 12px blur
        const nebula5 = document.createElement('div');
        nebula5.className = 'nebula-layer-5';
        body.appendChild(nebula5);

        console.log('🌫️ Created 2 nebula layers');
    }

    /**
     * Create 3 star layers (10 stars total)
     */
    function createStarLayers() {
        const body = document.body;

        // Distant stars (5 stars)
        const starsDistant = document.createElement('div');
        starsDistant.className = 'stars-distant';
        body.appendChild(starsDistant);

        // Skip mid and near stars on small mobile
        if (!isSmallMobile) {
            // Mid stars (3 stars)
            const starsMid = document.createElement('div');
            starsMid.className = 'stars-mid';
            body.appendChild(starsMid);

            // Near stars (2 stars)
            const starsNear = document.createElement('div');
            starsNear.className = 'stars-near';
            body.appendChild(starsNear);

            console.log('⭐ Created 3 star layers (10 stars)');
        } else {
            console.log('⭐ Created 1 star layer (minimal for mobile)');
        }
    }

    /**
     * Create vignette overlay (no blur)
     */
    function createVignette() {
        const vignette = document.createElement('div');
        vignette.className = 'space-vignette';
        document.body.appendChild(vignette);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
