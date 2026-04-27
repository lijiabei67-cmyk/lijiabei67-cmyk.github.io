/* ============================================
   GSAP Animations - Survival Analysis Blog
   Interactive Data Storytelling Experience
   ============================================ */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all content to load
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
   1. Hero Section Animation
   ============================================ */
function initHeroAnimation() {
    const tl = gsap.timeline();

    // Animate title
    tl.from('.article-header h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Animate meta info
    tl.from('.article-meta span', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
    }, '-=0.5');

    // Animate keywords
    tl.from('.keyword', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)'
    }, '-=0.3');

    // Animate abstract box
    tl.from('.article-abstract', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.3');
}

/* ============================================
   2. Section Animations (Scroll-triggered)
   ============================================ */
function initSectionAnimations() {
    // Animate each section heading
    gsap.utils.toArray('.article-section').forEach((section, index) => {
        // Section title animation
        gsap.from(section.querySelector('h2'), {
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

        // Section content fade in
        gsap.from(section.querySelectorAll('h3, h4, p, ul, ol'), {
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
   3. Stat Card Animations
   ============================================ */
function initStatCardAnimations() {
    gsap.utils.toArray('.stat-card').forEach((card, index) => {
        // Card entrance animation
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
            const endValue = parseFloat(valueEl.textContent.replace(/[^0-9.]/g, ''));
            const suffix = valueEl.textContent.replace(/[0-9.,]/g, '');

            if (!isNaN(endValue)) {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        onEnter: () => {
                            gsap.from(valueEl, {
                                textContent: 0,
                                duration: 1.5,
                                ease: 'power1.out',
                                snap: { textContent: endValue % 1 === 0 ? 1 : 0.01 },
                                onUpdate: function() {
                                    const current = parseFloat(valueEl.textContent);
                                    if (endValue % 1 === 0) {
                                        valueEl.textContent = Math.round(current).toLocaleString() + suffix;
                                    } else {
                                        valueEl.textContent = current.toFixed(2) + suffix;
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

/* ============================================
   4. Chart Container Animations
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

        // Caption fade in
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
   5. Table Animations
   ============================================ */
function initTableAnimations() {
    gsap.utils.toArray('.table-wrapper').forEach(table => {
        // Table container
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

        // Row stagger animation
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
   6. Finding Item Animations
   ============================================ */
function initFindingAnimations() {
    gsap.utils.toArray('.finding-item').forEach((item, index) => {
        const number = item.querySelector('.finding-number');
        const content = item.querySelector('.finding-content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // Number pop in
        tl.from(number, {
            scale: 0,
            rotation: -180,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });

        // Content slide in
        tl.from(content, {
            x: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3');
    });

    // Recommendation cards
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
   7. Customer Type Card Animations
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

        // CLV value counter
        if (clvValue) {
            const value = parseFloat(clvValue.textContent.replace(/[^0-9.]/g, ''));
            if (!isNaN(value)) {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 85%',
                    onEnter: () => {
                        gsap.from(clvValue, {
                            textContent: 0,
                            duration: 1.2,
                            ease: 'power1.out',
                            snap: { textContent: 0.01 },
                            onUpdate: function() {
                                const current = parseFloat(clvValue.textContent);
                                clvValue.textContent = '$' + current.toFixed(2);
                            }
                        });
                    }
                });
            }
        }
    });
}

/* ============================================
   8. Sidebar Animation
   ============================================ */
function initSidebarAnimation() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    // Initial animation
    gsap.from(sidebar, {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
    });

    // Nav link hover animations
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
   9. Smooth Scroll Enhancement
   ============================================ */
// Enhance smooth scrolling with GSAP
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

/* ============================================
   10. Progress Bar Enhancement
   ============================================ */
gsap.to('.progress-bar', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
    }
});
