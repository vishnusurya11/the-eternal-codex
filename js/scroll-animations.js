/**
 * SCROLL ANIMATIONS
 *
 * Handles scroll-triggered reveal animations using Intersection Observer
 */

(function() {
    'use strict';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Initialize scroll reveal animations
     */
    function init() {
        // Skip if user prefers reduced motion
        if (prefersReducedMotion) {
            console.log('Scroll animations disabled (reduced motion preference)');
            return;
        }

        // Create intersection observer
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
            threshold: 0.1
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        // Observe all scroll-reveal elements
        const revealElements = document.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

        // Auto-add scroll-reveal class to certain elements
        autoAddScrollReveal();
    }

    /**
     * Handle intersection changes
     */
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is visible, add revealed class
                entry.target.classList.add('revealed');

                // Optionally unobserve after revealing (one-time animation)
                // observer.unobserve(entry.target);
            } else {
                // Optionally remove revealed class when element scrolls out
                // (allows re-triggering animation on scroll back)
                // entry.target.classList.remove('revealed');
            }
        });
    }

    /**
     * Auto-add scroll-reveal classes to specific elements
     */
    function autoAddScrollReveal() {
        // Add scroll-reveal to visurena panels
        const panels = document.querySelectorAll('.visurena-panel');
        panels.forEach((panel, index) => {
            if (!panel.classList.contains('scroll-reveal')) {
                if (index % 2 === 0) {
                    panel.classList.add('scroll-reveal-left');
                } else {
                    panel.classList.add('scroll-reveal-right');
                }
            }
        });

        // Add scroll-reveal to section headings (h2, h3) in main content
        const mainContent = document.querySelector('.wiki-content');
        if (mainContent) {
            const headings = mainContent.querySelectorAll('h2, h3');
            headings.forEach(heading => {
                if (!heading.classList.contains('scroll-reveal')) {
                    heading.classList.add('scroll-reveal-scale');
                }
            });
        }

        // Add scroll-reveal to tables
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.classList.contains('scroll-reveal')) {
                table.classList.add('scroll-reveal');
            }
        });

        // Add scroll-reveal to blockquotes/proclamations
        const proclamations = document.querySelectorAll('.visurena-proclamation, blockquote');
        proclamations.forEach(element => {
            if (!element.classList.contains('scroll-reveal')) {
                element.classList.add('scroll-reveal-left');
            }
        });
    }

    /**
     * Add smooth parallax effect to page header on scroll
     */
    function initParallaxHeader() {
        const pageHeader = document.querySelector('.page-header');
        if (!pageHeader || prefersReducedMotion) return;

        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset;
                    const parallaxSpeed = 0.5;

                    // Move header up slower than scroll (parallax effect)
                    pageHeader.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    pageHeader.style.opacity = Math.max(1 - scrolled / 400, 0.3);

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    /**
     * Add hover glow effect to links based on mouse position
     */
    function initLinkGlowEffect() {
        if (prefersReducedMotion) return;

        const links = document.querySelectorAll('a:not(.gateway-card):not(.toc-link)');

        links.forEach(link => {
            link.addEventListener('mousemove', function(e) {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                link.style.setProperty('--mouse-x', `${x}px`);
                link.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
            initParallaxHeader();
            initLinkGlowEffect();
        });
    } else {
        init();
        initParallaxHeader();
        initLinkGlowEffect();
    }

})();
