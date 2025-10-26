/**
 * CREATIVE TOUCHES
 *
 * Optional creative interactions:
 * - Cursor glow effect
 * - 3D card tilt on mouse move
 */

(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    /**
     * Initialize creative touches
     */
    function init() {
        if (prefersReducedMotion || isMobile) {
            console.log('Creative touches disabled (mobile or reduced motion)');
            return;
        }

        initCursorGlow();
        init3DTilt();
    }

    /**
     * Cursor glow effect - follows mouse
     */
    function initCursorGlow() {
        let mouseX = 0;
        let mouseY = 0;
        let cursorGlowEnabled = false;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!cursorGlowEnabled) {
                document.body.classList.add('cursor-glow');
                cursorGlowEnabled = true;
            }

            // Update cursor glow position
            document.body.style.setProperty('--mouse-x', mouseX + 'px');
            document.body.style.setProperty('--mouse-y', mouseY + 'px');

            // Use requestAnimationFrame for smooth updates
            requestAnimationFrame(updateCursorPosition);
        });

        function updateCursorPosition() {
            const glow = document.querySelector('body::after');
            if (document.body.classList.contains('cursor-glow')) {
                document.documentElement.style.setProperty('--cursor-x', mouseX + 'px');
                document.documentElement.style.setProperty('--cursor-y', mouseY + 'px');
            }
        }

        // Update body::after position via CSS custom properties
        const style = document.createElement('style');
        style.textContent = `
            body.cursor-glow::after {
                left: var(--cursor-x, 0);
                top: var(--cursor-y, 0);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 3D tilt effect on cards
     */
    function init3DTilt() {
        const cards = document.querySelectorAll('.gateway-card, .visurena-panel');

        cards.forEach(card => {
            card.addEventListener('mousemove', handleTilt);
            card.addEventListener('mouseleave', resetTilt);
        });

        function handleTilt(e) {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();

            // Calculate mouse position relative to card center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation angles (max ±10 degrees)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.classList.add('tilt-active');
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale(1.02)
            `;
        }

        function resetTilt(e) {
            const card = e.currentTarget;
            card.classList.remove('tilt-active');
            card.style.transform = '';
        }
    }

    /**
     * Add page loading indicator
     */
    function showPageLoadingBar() {
        const loadingBar = document.createElement('div');
        loadingBar.className = 'page-loading-bar';
        document.body.appendChild(loadingBar);

        // Remove after 2 seconds (simulated page load)
        setTimeout(() => {
            loadingBar.remove();
        }, 2000);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Show loading bar on first load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showPageLoadingBar);
    }

})();
