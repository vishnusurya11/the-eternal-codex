/* ==============================================
   NAVIGATION & SMOOTH SCROLLING
   The Eternal Codex
   ============================================== */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScrolling();
        initActiveSection();
        initBackToTop();
        initMobileNav();
    });

    /**
     * Initialize smooth scrolling for all navigation links
     */
    function initSmoothScrolling() {
        const tocLinks = document.querySelectorAll('.toc-link');

        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = 100; // Offset for fixed elements
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active state
                    updateActiveLink(this);

                    // Close mobile nav if open
                    const sidebar = document.querySelector('.sidebar-nav');
                    if (sidebar && sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                    }
                }
            });
        });
    }

    /**
     * Track active section based on scroll position
     */
    function initActiveSection() {
        const sections = document.querySelectorAll('.main-section, .subsection');
        const tocLinks = document.querySelectorAll('.toc-link');

        function updateActiveSectionOnScroll() {
            let currentSection = '';
            const scrollPosition = window.pageYOffset + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Update active link
            tocLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1); // Remove #

                if (href === currentSection) {
                    link.classList.add('active');
                }
            });
        }

        // Throttle scroll event for better performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveSectionOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        updateActiveSectionOnScroll();
    }

    /**
     * Update active link in TOC
     */
    function updateActiveLink(clickedLink) {
        const tocLinks = document.querySelectorAll('.toc-link');
        tocLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    /**
     * Initialize Back to Top button
     */
    function initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');

        if (!backToTopButton) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Initialize mobile navigation toggle
     */
    function initMobileNav() {
        // Create mobile menu button if it doesn't exist
        if (window.innerWidth <= 1024) {
            createMobileMenuButton();
        }

        // Handle resize
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 1024 && !document.querySelector('.mobile-menu-toggle')) {
                createMobileMenuButton();
            } else if (window.innerWidth > 1024) {
                removeMobileMenuButton();
                const sidebar = document.querySelector('.sidebar-nav');
                if (sidebar) sidebar.classList.remove('open');
            }
        });
    }

    /**
     * Create mobile menu toggle button
     */
    function createMobileMenuButton() {
        if (document.querySelector('.mobile-menu-toggle')) return;

        const button = document.createElement('button');
        button.className = 'mobile-menu-toggle';
        button.setAttribute('aria-label', 'Toggle navigation menu');
        button.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        document.body.appendChild(button);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-toggle {
                position: fixed;
                top: 1rem;
                left: 1rem;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #FFD700 0%, #ffed4e 100%);
                border: 2px solid #FFD700;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                z-index: 1001;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 10px 40px rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
            }

            .mobile-menu-toggle span {
                width: 25px;
                height: 3px;
                background: #0a0e1a;
                border-radius: 2px;
                transition: all 0.3s ease;
            }

            .mobile-menu-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 10px 40px rgba(0, 0, 0, 0.5);
            }

            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translateY(9px);
            }

            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translateY(-9px);
            }

            @media (min-width: 1025px) {
                .mobile-menu-toggle {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);

        // Add click handler
        button.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar-nav');
            if (sidebar) {
                sidebar.classList.toggle('open');
                button.classList.toggle('active');
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            const sidebar = document.querySelector('.sidebar-nav');
            const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
            const isClickOnButton = button.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnButton && sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                button.classList.remove('active');
            }
        });
    }

    /**
     * Remove mobile menu button
     */
    function removeMobileMenuButton() {
        const button = document.querySelector('.mobile-menu-toggle');
        if (button) {
            button.remove();
        }
    }

    /**
     * Add keyboard navigation support
     */
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile nav
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar-nav');
            const button = document.querySelector('.mobile-menu-toggle');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (button) button.classList.remove('active');
            }
        }

        // Ctrl/Cmd + Up arrow = back to top
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    /**
     * Add scroll progress indicator
     */
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight);
            progressBar.style.transform = `scaleX(${scrolled})`;
        });
    }

    // Uncomment to enable scroll progress bar
    // createScrollProgress();

})();
