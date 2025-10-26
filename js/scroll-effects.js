/* ==============================================
   SCROLL EFFECTS & ANIMATIONS
   The Eternal Codex
   ============================================== */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initScrollAnimations();
        initLazyAnimations();
        checkReducedMotion();
    });

    /**
     * Initialize scroll-triggered animations
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

        // Intersection Observer for fade-in effects
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Lazy load animations for better performance
     */
    function initLazyAnimations() {
        // Animate sections as they come into view
        const sections = document.querySelectorAll('.main-section');

        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -100px 0px'
        });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            sectionObserver.observe(section);
        });
    }

    /**
     * Check if user prefers reduced motion
     */
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            // Disable animations
            document.body.classList.add('reduce-motion');

            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Add parallax effect to pyramid diagram
     */
    function initParallax() {
        const pyramid = document.querySelector('.pyramid-diagram');
        if (!pyramid) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const pyramidOffset = pyramid.offsetTop;
            const windowHeight = window.innerHeight;

            if (scrolled > pyramidOffset - windowHeight && scrolled < pyramidOffset + pyramid.offsetHeight) {
                const rate = (scrolled - pyramidOffset + windowHeight) * 0.05;
                pyramid.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Uncomment to enable parallax effect
    // initParallax();

    /**
     * Add hover effects to house sections
     */
    function initHouseHoverEffects() {
        const highHouses = document.querySelectorAll('.high-house');

        highHouses.forEach(house => {
            house.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.01)';
                this.style.transition = 'transform 0.3s ease';
            });

            house.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    initHouseHoverEffects();

    /**
     * Animate tables on scroll
     */
    function initTableAnimations() {
        const tables = document.querySelectorAll('table');

        const tableObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const rows = entry.target.querySelectorAll('tbody tr');
                    rows.forEach((row, index) => {
                        setTimeout(() => {
                            row.style.opacity = '1';
                            row.style.transform = 'translateX(0)';
                        }, index * 50);
                    });
                    tableObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';
                row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            tableObserver.observe(table);
        });
    }

    initTableAnimations();

    /**
     * Add typing effect to sacred verses
     */
    function initTypingEffect() {
        const verses = document.querySelectorAll('.sacred-verse em');

        verses.forEach(verse => {
            const text = verse.textContent;
            verse.textContent = '';
            verse.style.display = 'inline-block';

            let index = 0;
            function type() {
                if (index < text.length) {
                    verse.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, 50);
                }
            }

            // Start typing when verse is in view
            const verseObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        type();
                        verseObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            verseObserver.observe(verse);
        });
    }

    // Uncomment to enable typing effect (may be distracting)
    // initTypingEffect();

    /**
     * Add glow effect on scroll to headings
     */
    function initHeadingGlow() {
        const headings = document.querySelectorAll('h2, h3.subsection-heading');

        headings.forEach(heading => {
            const glowObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
                        setTimeout(() => {
                            entry.target.style.textShadow = '';
                        }, 1000);
                    }
                });
            }, {
                threshold: 0.8
            });

            glowObserver.observe(heading);
        });
    }

    initHeadingGlow();

    /**
     * Animate collapsible details opening
     */
    function initDetailsAnimation() {
        const allDetails = document.querySelectorAll('details');

        allDetails.forEach(details => {
            details.addEventListener('toggle', function() {
                if (this.open) {
                    const content = this.querySelector('.lesser-house-content');
                    if (content) {
                        content.style.animation = 'fadeIn 0.4s ease-out';
                    }
                }
            });
        });
    }

    initDetailsAnimation();

    /**
     * Add sparkle effect on hover for golden elements
     */
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #FFD700, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleFloat 1s ease-out forwards;
        `;

        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }

    // Add sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-30px) scale(0);
            }
        }
    `;
    document.head.appendChild(sparkleStyle);

    // Add sparkles on hover over gold elements
    const goldElements = document.querySelectorAll('.codex-title, .section-heading, .toc-link.active');
    goldElements.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const x = rect.left + Math.random() * rect.width;
                    const y = rect.top + Math.random() * rect.height;
                    createSparkle(x, y);
                }, i * 100);
            }
        });
    });

    /**
     * Add reading time indicator
     */
    function calculateReadingTime() {
        const content = document.querySelector('.main-content');
        if (!content) return;

        const text = content.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

        const indicator = document.createElement('div');
        indicator.className = 'reading-time';
        indicator.textContent = `📖 ${readingTime} min read`;
        indicator.style.cssText = `
            position: fixed;
            bottom: 5rem;
            right: 2rem;
            padding: 0.5rem 1rem;
            background: rgba(26, 31, 46, 0.9);
            border: 1px solid #FFD700;
            border-radius: 20px;
            color: #FFD700;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            z-index: 998;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(indicator);

        // Show reading time on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                indicator.style.opacity = '1';
            } else {
                indicator.style.opacity = '0';
            }
        });
    }

    calculateReadingTime();

    /**
     * Performance optimization: Debounce scroll events
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Log scroll depth for analytics (optional)
     */
    let maxScrollDepth = 0;
    window.addEventListener('scroll', debounce(function() {
        const scrollPercentage = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);

        // Log milestones
        if (maxScrollDepth > 25 && !window.scrollMilestone25) {
            console.log('📜 Scroll milestone: 25% of Codex explored');
            window.scrollMilestone25 = true;
        }
        if (maxScrollDepth > 50 && !window.scrollMilestone50) {
            console.log('📜 Scroll milestone: 50% of Codex explored');
            window.scrollMilestone50 = true;
        }
        if (maxScrollDepth > 75 && !window.scrollMilestone75) {
            console.log('📜 Scroll milestone: 75% of Codex explored');
            window.scrollMilestone75 = true;
        }
        if (maxScrollDepth > 95 && !window.scrollMilestone100) {
            console.log('🎉 Codex completed! You have read the entire sacred archive.');
            window.scrollMilestone100 = true;
        }
    }, 500));

    /**
     * Add easter egg: Konami code
     */
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });

    function activateEasterEgg() {
        console.log('🎊 Secret activated! The First Flame burns brighter!');
        document.body.style.animation = 'glowPulse 2s ease-in-out 3';

        // Add golden rain effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = -20;
                createSparkle(x, y);
            }, i * 50);
        }
    }

    // Log welcome message
    console.log('%c👑 Welcome to The Eternal Codex', 'font-size: 20px; font-weight: bold; color: #FFD700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);');
    console.log('%cThe Sacred Archive of the Celestial Dominion of Visurena', 'font-style: italic; color: #C0C0C0;');
    console.log('%c"May the Flame Eternal burn until the last word is written."', 'font-style: italic; color: #9ca3af;');

})();
