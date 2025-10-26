/**
 * WIKI NAVIGATION SYSTEM
 *
 * Handles all interactive navigation features:
 * - Mobile menu toggle
 * - Scroll to top button
 * - Sidebar state management
 * - Back button functionality
 * - Smooth scrolling
 * - Active link highlighting
 */

const WikiNavigation = (function() {
    'use strict';

    // State
    let isMobileMenuOpen = false;
    let lastScrollPosition = 0;

    // DOM Elements (cached)
    let elements = {};

    /**
     * Initialize navigation system
     */
    function init() {
        cacheElements();
        attachEventListeners();
        initScrollToTop();
        initBackButton();
        setupSmoothScrolling();
        highlightActiveLinks();
    }

    /**
     * Cache DOM elements for performance
     */
    function cacheElements() {
        elements = {
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            mobileOverlay: document.getElementById('mobile-overlay'),
            sidebar: document.getElementById('wiki-sidebar'),
            scrollToTopBtn: document.getElementById('scroll-to-top'),
            backBtn: document.getElementById('sidebar-back-btn'),
            tocLinks: document.querySelectorAll('.toc-link'),
            body: document.body
        };
    }

    /**
     * Attach all event listeners
     */
    function attachEventListeners() {
        // Mobile menu toggle
        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Mobile overlay (close menu when clicked)
        if (elements.mobileOverlay) {
            elements.mobileOverlay.addEventListener('click', closeMobileMenu);
        }

        // Scroll events for scroll-to-top button
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Scroll to top button click
        if (elements.scrollToTopBtn) {
            elements.scrollToTopBtn.addEventListener('click', scrollToTop);
        }

        // Close mobile menu on window resize
        window.addEventListener('resize', handleResize);

        // TOC link clicks
        if (elements.tocLinks) {
            elements.tocLinks.forEach(link => {
                link.addEventListener('click', handleTocClick);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    /**
     * Toggle mobile menu open/closed
     */
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;

        if (isMobileMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        elements.sidebar?.classList.add('mobile-open');
        elements.mobileMenuToggle?.classList.add('active');
        elements.mobileOverlay?.classList.add('active');
        elements.body?.style.setProperty('overflow', 'hidden');
        isMobileMenuOpen = true;
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        elements.sidebar?.classList.remove('mobile-open');
        elements.mobileMenuToggle?.classList.remove('active');
        elements.mobileOverlay?.classList.remove('active');
        elements.body?.style.removeProperty('overflow');
        isMobileMenuOpen = false;
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close mobile menu on desktop breakpoint
        if (window.innerWidth > 768 && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Show/hide scroll-to-top button
        updateScrollToTopButton(currentScroll);

        // Update active TOC link based on scroll position
        updateActiveTocLink(currentScroll);

        lastScrollPosition = currentScroll;
    }

    /**
     * Initialize scroll to top button
     */
    function initScrollToTop() {
        if (!elements.scrollToTopBtn) return;

        // Initially hidden
        elements.scrollToTopBtn.classList.remove('visible');
    }

    /**
     * Update scroll-to-top button visibility
     */
    function updateScrollToTopButton(scrollPos) {
        if (!elements.scrollToTopBtn) return;

        // Show button after scrolling down 300px
        if (scrollPos > 300) {
            elements.scrollToTopBtn.classList.add('visible');
        } else {
            elements.scrollToTopBtn.classList.remove('visible');
        }
    }

    /**
     * Scroll smoothly to top of page
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Initialize back button
     */
    function initBackButton() {
        if (!elements.backBtn) return;

        elements.backBtn.addEventListener('click', function() {
            // Check if there's browser history
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Fallback: go to index
                window.location.href = getPathToRoot() + 'index.html';
            }
        });
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#main-content') return;

                e.preventDefault();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Close mobile menu if open
                    if (isMobileMenuOpen) {
                        closeMobileMenu();
                    }

                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL hash without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /**
     * Handle TOC link clicks
     */
    function handleTocClick(e) {
        // Remove active class from all links
        elements.tocLinks.forEach(link => link.classList.remove('active'));

        // Add active class to clicked link
        e.currentTarget.classList.add('active');

        // Close mobile menu if open
        if (isMobileMenuOpen) {
            setTimeout(closeMobileMenu, 300); // Small delay for better UX
        }
    }

    /**
     * Update active TOC link based on scroll position
     */
    function updateActiveTocLink(scrollPos) {
        // Get all sections on the page
        const sections = document.querySelectorAll('section[id], article[id], .content-section[id]');

        let currentSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for better triggering
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            // Remove active from all
            elements.tocLinks.forEach(link => link.classList.remove('active'));

            // Add active to matching link
            const activeLink = document.querySelector(`.toc-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    /**
     * Highlight active links in navigation
     */
    function highlightActiveLinks() {
        const currentPath = window.location.pathname;

        // Highlight matching links in sidebar
        document.querySelectorAll('.toc-link, .sidebar-link').forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;

            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboard(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }

        // Ctrl/Cmd + Home goes to top
        if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
            e.preventDefault();
            scrollToTop();
        }
    }

    /**
     * Helper: Get path to root based on current URL depth
     */
    function getPathToRoot() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p && p !== 'index.html');
        const depth = parts.length - 1;

        return depth > 0 ? '../'.repeat(depth) : './';
    }

    /**
     * Public API
     */
    return {
        init: init,
        openMobileMenu: openMobileMenu,
        closeMobileMenu: closeMobileMenu,
        scrollToTop: scrollToTop
    };

})();

// Auto-initialize if not explicitly initialized
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // WikiNavigation.init() will be called from base-page.html
    });
} else {
    // DOM already loaded
    // WikiNavigation.init() will be called from base-page.html
}

// Export for use in other modules
window.WikiNavigation = WikiNavigation;
