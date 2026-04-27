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
   1. Hero Section Animation Sequence
   ============================================ */
function initHeroAnimation() {
    const heroCharacter = document.getElementById('heroCharacter');
    const heroTypewriter = document.getElementById('heroTypewriter');
    const heroTitleContainer = document.getElementById('heroTitleContainer');
    const articleMeta = document.getElementById('articleMeta');
    const articleKeywords = document.getElementById('articleKeywords');
    const dustContainer = document.getElementById('dustContainer');

    // Create main timeline
    const heroTL = gsap.timeline();

    // Step 1: Show character with pop animation
    heroTL.from(heroCharacter, {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });

    // Step 2: Typewriter effect
    heroTL.add(() => {
        gsap.to(heroTypewriter, {
            opacity: 1,
            duration: 0.3
        });
        typeWriterEffect();
    }, '+=0.2');

    // Wait for typewriter to complete
    heroTL.to({}, { duration: 3.5 });

    // Step 3: Character runs away with dust effect
    heroTL.to(heroCharacter, {
        x: window.innerWidth + 200,
        y: -80,
        rotation: 20,
        scale: 0.6,
        duration: 0.6,
        ease: 'power2.in',
        onStart: () => {
            createDustParticles(dustContainer);
        }
    });

    // Step 4: Show title container
    heroTL.to(heroTitleContainer, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.1
    }, '-=0.2');

    heroTL.from('.hero-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    heroTL.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4');

    // Step 5: Floating icons appear
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

    // Step 6: Show meta and keywords
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

// Typewriter effect function
function typeWriterEffect() {
    const text = '我们想分析客户流失的原因和时间点，并且优化获客策略';
    const typewriterEl = document.querySelector('.typewriter-text');
    if (!typewriterEl) return;

    let index = 0;

    function type() {
        if (index < text.length) {
            typewriterEl.textContent = text.substring(0, index + 1);
            index++;
            setTimeout(type, 70);
        } else {
            typewriterEl.classList.add('typewriter-cursor');
        }
    }

    type();
}

// Create dust particles
function createDustParticles(container) {
    if (!container) return;

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'dust-particle';
        particle.style.left = (40 + Math.random() * 20) + '%';
        particle.style.bottom = Math.random() * 15 + 'px';
        container.appendChild(particle);

        gsap.to(particle, {
            x: (Math.random() - 0.5) * 80,
            y: -Math.random() * 40,
            opacity: 0.7,
            scale: Math.random() * 1.2 + 0.5,
            duration: 0.6,
            ease: 'power1.out',
            onComplete: () => particle.remove()
        });
    }
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
            const endValue = parseFloat(valueEl.textContent.replace(/[^0-9.]/g, ''));
            const suffix = valueEl.textContent.replace(/[0-9.,]/g, '');

            if (!isNaN(endValue)) {
                ScrollTrigger.create({
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
