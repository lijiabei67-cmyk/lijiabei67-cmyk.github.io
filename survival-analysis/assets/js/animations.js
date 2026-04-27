/* ============================================
   GSAP Animations - Survival Analysis Blog
   Interactive Data Storytelling Experience
   ============================================ */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAnimations, 100);
});

function initAnimations() {
    initHeroAnimation();
    initSectionAnimations();
    initStatCardAnimations();
    initChartAnimations();
    initTableAnimations();
    initFindingAnimations();
    initCustomerTypeAnimations();
    initSidebarAnimation();
}

/* ============================================
   1. Hero Section Animation - Title Typewriter
   ============================================ */
function initHeroAnimation() {
    const heroTitleContainer = document.getElementById('heroTitleContainer');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const articleMeta = document.getElementById('articleMeta');
    const articleKeywords = document.getElementById('articleKeywords');

    // Create main timeline
    const heroTL = gsap.timeline();

    // Step 1: Typewriter effect for title
    heroTL.add(() => {
        titleTypewriterEffect();
    });

    // Wait for typewriter to complete
    heroTL.to({}, { duration: 2.5 });

    // Step 2: Show subtitle
    heroTL.to(heroSubtitle, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    });

    // Step 3: Floating icons appear
    heroTL.from('.floating-icon', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)'
    }, '-=0.3');

    // Start continuous floating animation
    heroTL.add(() => {
        startFloatingAnimation();
    });

    // Step 4: Show meta and keywords
    heroTL.to(articleMeta, {
        opacity: 1,
        duration: 0.4
    });

    heroTL.to(articleKeywords, {
        opacity: 1,
        duration: 0.4
    }, '-=0.2');

    heroTL.from('.article-keywords-hero .keyword', {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        stagger: 0.06,
        ease: 'back.out(1.5)'
    }, '-=0.2');
}

// Title typewriter effect
function titleTypewriterEffect() {
    const text = '用生存分析预测客户流失';
    const typewriterEl = document.querySelector('.typewriter-title');
    if (!typewriterEl) return;

    let index = 0;

    function type() {
        if (index < text.length) {
            typewriterEl.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(type, 100);
        }
    }

    type();
}

// Floating icons continuous animation
function startFloatingAnimation() {
    gsap.to('.icon-calculator', {
        y: -10,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });

    gsap.to('.icon-notebook', {
        y: -8,
        rotation: 3,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.2
    });

    gsap.to('.icon-chart', {
        y: -12,
        rotation: -2,
        duration: 1.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.4
    });
}

/* ============================================
   3. Section Animations (Scroll-triggered)
   ============================================ */
function initSectionAnimations() {
    // Animate each section heading
    gsap.utils.toArray('.article-section').forEach((section) => {
        const heading = section.querySelector('h2');
        const textContent = section.querySelectorAll('h3, h4, p, ul, ol');

        if (heading) {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        if (textContent.length > 0) {
            gsap.from(textContent, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    });

    // Highlight boxes with special animation
    gsap.utils.toArray('.highlight-box, .key-finding, .interpretation-box').forEach(box => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.95,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    // Target highlight with arrow animation
    const targetHighlight = document.querySelector('.target-highlight');
    if (targetHighlight) {
        const arrowGroup = targetHighlight.querySelector('.arrow-group');
        const targetRings = targetHighlight.querySelectorAll('.target-ring-1, .target-ring-2');

        if (arrowGroup) {
            ScrollTrigger.create({
                trigger: targetHighlight,
                start: 'top 85%',
                onEnter: () => {
                    // Arrow flies in
                    gsap.to(arrowGroup, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        delay: 0.3,
                        ease: 'power2.out',
                        onStart: function() {
                            arrowGroup.style.transform = 'rotate(45deg)';
                        }
                    });

                    // Target rings pulse after hit
                    if (targetRings.length > 0) {
                        gsap.fromTo(targetRings,
                            { scale: 1 },
                            {
                                scale: 1.1,
                                duration: 0.15,
                                delay: 0.8,
                                stagger: 0.05,
                                yoyo: true,
                                repeat: 1,
                                ease: 'power1.inOut'
                            }
                        );
                    }
                }
            });
        }
    }

    // Formula boxes
    gsap.utils.toArray('.formula-box').forEach(box => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            x: -30,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out'
        });
    });
}

/* ============================================
   4. Stat Card Animations (with counter)
   ============================================ */
function initStatCardAnimations() {
    gsap.utils.toArray('.stat-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out'
        });

        // Number counter animation
        const valueEl = card.querySelector('.stat-value');
        if (valueEl) {
            const originalText = valueEl.textContent;
            const endValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
            const suffix = originalText.replace(/[0-9.,]/g, '');

            if (!isNaN(endValue) && endValue > 0) {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => {
                        const isInteger = endValue % 1 === 0;
                        const duration = 1500; // ms
                        const startTime = performance.now();

                        function animateStat(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);

                            // Ease out
                            const eased = 1 - Math.pow(1 - progress, 2);
                            const currentValue = endValue * eased;

                            if (isInteger) {
                                valueEl.textContent = Math.round(currentValue).toLocaleString() + suffix;
                            } else {
                                valueEl.textContent = currentValue.toFixed(2) + suffix;
                            }

                            if (progress < 1) {
                                requestAnimationFrame(animateStat);
                            } else {
                                // Ensure exact final value
                                if (isInteger) {
                                    valueEl.textContent = Math.round(endValue).toLocaleString() + suffix;
                                } else {
                                    valueEl.textContent = endValue.toFixed(2) + suffix;
                                }
                            }
                        }

                        requestAnimationFrame(animateStat);
                    }
                });
            }
        }
    });
}

/* ============================================
   5. Chart Container Animations
   ============================================ */
function initChartAnimations() {
    gsap.utils.toArray('.chart-container').forEach((container, index) => {
        gsap.from(container, {
            scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.05,
            ease: 'power3.out'
        });

        const caption = container.querySelector('.chart-caption');
        if (caption) {
            gsap.from(caption, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                duration: 0.5,
                delay: 0.3
            });
        }
    });
}

/* ============================================
   6. Table Animations
   ============================================ */
function initTableAnimations() {
    gsap.utils.toArray('.table-wrapper').forEach(table => {
        gsap.from(table, {
            scrollTrigger: {
                trigger: table,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out'
        });

        const rows = table.querySelectorAll('tbody tr');
        if (rows.length > 0) {
            gsap.from(rows, {
                scrollTrigger: {
                    trigger: table,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: -20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power1.out'
            });
        }
    });
}

/* ============================================
   7. Finding Item Animations
   ============================================ */
function initFindingAnimations() {
    gsap.utils.toArray('.finding-item').forEach((item) => {
        const number = item.querySelector('.finding-number');
        const content = item.querySelector('.finding-content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.from(number, {
            scale: 0,
            rotation: -180,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });

        tl.from(content, {
            x: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3');
    });

    gsap.utils.toArray('.recommendation').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });
}

/* ============================================
   8. Customer Type Card Animations
   ============================================ */
function initCustomerTypeAnimations() {
    gsap.utils.toArray('.customer-type').forEach((card, index) => {
        const clvValue = card.querySelector('.clv-value');

        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'back.out(1.4)'
        });

        if (clvValue) {
            // Get the target value from the HTML content
            const originalHTML = clvValue.innerHTML;
            const originalText = clvValue.textContent;
            const targetValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));

            if (!isNaN(targetValue) && targetValue > 0) {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 85%',
                    once: true,  // Only run once
                    onEnter: () => {
                        // Animate from 0 to target value
                        let currentValue = 0;
                        const duration = 1200; // ms
                        const startTime = performance.now();

                        function animateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);

                            // Ease out
                            const eased = 1 - Math.pow(1 - progress, 2);
                            currentValue = targetValue * eased;

                            clvValue.textContent = '$' + currentValue.toFixed(2);

                            if (progress < 1) {
                                requestAnimationFrame(animateCounter);
                            } else {
                                // Ensure exact final value
                                clvValue.textContent = '$' + targetValue.toFixed(2);
                            }
                        }

                        requestAnimationFrame(animateCounter);
                    }
                });
            }
        }
    });
}

/* ============================================
   9. Sidebar Animation
   ============================================ */
function initSidebarAnimation() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    gsap.from(sidebar, {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
    });

    const navLinks = sidebar.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                x: 5,
                duration: 0.2,
                ease: 'power1.out'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                x: 0,
                duration: 0.2,
                ease: 'power1.out'
            });
        });
    });
}

/* ============================================
   10. Smooth Scroll Enhancement
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 0.8,
                scrollTo: {
                    y: target,
                    offsetY: 20
                },
                ease: 'power2.inOut'
            });
        }
    });
});
