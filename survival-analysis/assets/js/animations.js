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
   1. Hero Section - Split-Text Typewriter
      Asymmetric staggered layout, key-word glow
   ============================================ */
function initHeroAnimation() {
    const heroTitleBlock = document.getElementById('heroTitleBlock');
    const heroSubtitleBlock = document.getElementById('heroSubtitleBlock');
    const heroMetaBadges = document.getElementById('heroMetaBadges');
    const articleKeywords = document.getElementById('articleKeywords');
    const cursorEl = document.getElementById('heroCursor');
    const accentLine = document.getElementById('titleAccentLine');
    const typewriterChars = document.getElementById('typewriterChars');

    if (!typewriterChars) return;

    // ---- Prepare subtitle with highlighted key term ----
    const subtitleEl = document.getElementById('heroSubtitle');
    if (subtitleEl) {
        subtitleEl.innerHTML = '基于 Kaplan-Meier 与 Cox 模型的<br><span class="subtitle-highlight">客户流失</span>预测';
    }

    // ---- Split title into character spans ----
    const titleText = '时间与概率的博弈';
    // Key word ranges: "时间" = [0,1], "概率" = [3,4]
    const keyWordRanges = [[0, 1], [3, 4]];
    const charSpans = [];

    typewriterChars.innerHTML = '';
    for (let i = 0; i < titleText.length; i++) {
        const span = document.createElement('span');
        span.className = 'typewriter-char';
        span.textContent = titleText[i];
        for (const [s, e] of keyWordRanges) {
            if (i >= s && i <= e) { span.classList.add('key-word'); break; }
        }
        typewriterChars.appendChild(span);
        charSpans.push(span);
    }

    // ---- Cursor blinking animation ----
    const cursorBlink = gsap.to(cursorEl, {
        opacity: 0,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
        paused: true
    });
    cursorBlink.play();

    // ---- Main timeline ----
    const heroTL = gsap.timeline({ delay: 0.4 });

    // 1. Title block fades in
    heroTL.to(heroTitleBlock, {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out'
    });

    // 2. Split-text typewriter: stagger each character
    //    Characters fly up from below with a bounce
    heroTL.to(charSpans, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: {
            each: 0.1,
            from: 'start'
        },
        ease: 'back.out(2.2)',
        onStart: () => {
            // Fade cursor slightly before typing begins
            gsap.to(cursorEl, { opacity: 1, duration: 0.1 });
        }
    });

    // 3. Key words glow after being typed
    //    "时间" finishes ~0.55s into stagger, "概率" ~0.85s
    heroTL.add(() => {
        charSpans.forEach(s => {
            if (s.classList.contains('key-word')) s.classList.add('revealed');
        });
    });

    // 4. Title brightness pulse
    heroTL.to('.hero-title', {
        filter: 'brightness(1.35) saturate(1.2)',
        duration: 0.55,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
    });

    // 5. Draw accent line under title
    heroTL.to(accentLine, {
        width: '80px',
        duration: 0.7,
        ease: 'power3.out'
    }, '-=0.4');

    // 6. Hide cursor after typing is done
    heroTL.to(cursorEl, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => cursorBlink.pause()
    }, '-=0.5');

    // 7. Subtitle block fades in and slides up
    heroTL.to(heroSubtitleBlock, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out'
    }, '-=0.1');

    // 8. Floating icons pop in with staggered bounce
    heroTL.from('.floating-icon', {
        scale: 0,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: 'back.out(2)'
    }, '-=0.35');

    // Start continuous floating
    heroTL.add(startFloatingAnimation);

    // 9. Meta badges fade-in-up
    heroTL.to(heroMetaBadges, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.2');

    // 10. Keywords stagger in
    heroTL.to(articleKeywords, {
        opacity: 1,
        duration: 0.4
    }, '-=0.15');

    heroTL.from('.article-keywords-hero .keyword', {
        scale: 0,
        opacity: 0,
        duration: 0.35,
        stagger: 0.07,
        ease: 'back.out(1.5)'
    }, '-=0.25');
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
        const arrowGroup = targetHighlight.querySelector('#targetArrowGroup');
        const targetRings = targetHighlight.querySelectorAll('.target-ring');
        const impactWave = targetHighlight.querySelector('.impact-wave');
        const crosshairs = targetHighlight.querySelectorAll('.crosshair');

        const targetTL = gsap.timeline({
            scrollTrigger: {
                trigger: targetHighlight,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Step 1: Draw target rings one by one
        targetTL.to('.target-ring-outer', {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: 'power2.inOut'
        });

        targetTL.to('.target-ring-mid', {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        }, '-=0.3');

        targetTL.to('.target-ring-inner', {
            strokeDashoffset: 0,
            duration: 0.4,
            ease: 'power2.inOut'
        }, '-=0.3');

        targetTL.to('.target-ring-bullseye', {
            scale: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        }, '-=0.2');

        // Step 2: Show crosshairs
        targetTL.to(crosshairs, {
            opacity: 0.6,
            duration: 0.3
        }, '-=0.1');

        // Step 3: Arrow flies in from left with swoosh
        targetTL.to('#targetArrowGroup', {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: 'power3.in',
            onStart: () => {
                // Quiver/shake effect before release
                gsap.to('#targetArrowGroup', {
                    y: -5,
                    duration: 0.08,
                    yoyo: true,
                    repeat: 3,
                    ease: 'power1.inOut'
                });
            }
        }, '-=0.5');

        // Step 4: Arrow hits bullseye - rings expand briefly
        targetTL.to(targetRings, {
            scale: 1.05,
            duration: 0.12,
            stagger: 0.04,
            yoyo: true,
            repeat: 1,
            transformOrigin: '100px 100px',
            ease: 'power1.inOut'
        }, '-=0.1');

        // Step 5: Impact wave radiates out
        targetTL.fromTo(impactWave, {
            r: 8,
            opacity: 1
        }, {
            r: 60,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out'
        }, '-=0.3');

        // Step 6: Bullseye glow pulse
        targetTL.to('.target-ring-bullseye', {
            fill: '#EC4899',
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        });
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
            // Use data-target attribute for reliable value extraction
            let targetValue = parseFloat(clvValue.getAttribute('data-target'));

            // Fallback: parse from text content if data-target not set
            if (!targetValue || isNaN(targetValue)) {
                const originalText = clvValue.textContent;
                targetValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
            }

            if (!isNaN(targetValue) && targetValue > 0) {
                // Use a proxy object for GSAP to animate
                const counterObj = { value: 0 };

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        clvValue.textContent = '$0.00';

                        gsap.to(counterObj, {
                            value: targetValue,
                            duration: 1.5,
                            ease: 'power2.out',
                            onUpdate: () => {
                                clvValue.textContent = '$' + counterObj.value.toFixed(2);
                            },
                            onComplete: () => {
                                clvValue.textContent = '$' + targetValue.toFixed(2);
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
