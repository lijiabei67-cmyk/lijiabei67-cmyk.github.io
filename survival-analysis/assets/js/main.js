/* ============================================
   Main JavaScript - Survival Analysis Blog
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initDarkMode();
    initProgressBar();
    initBackToTop();
    initCollapsibleCode();
    initCopyCode();
    initSidebarNavigation();
});

/* ============================================
   Dark Mode Toggle
   ============================================ */
function initDarkMode() {
    const toggleBtn = document.getElementById('darkModeToggle');

    // Only apply dark mode if user explicitly saved it
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Toggle button click handler
    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        // Save preference to localStorage
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    });

}

/* ============================================
   Progress Bar
   ============================================ */
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        progressBar.style.width = scrollPercent + '%';

        // Update gradient position based on scroll progress
        progressBar.classList.remove('scrolled-25', 'scrolled-50', 'scrolled-75', 'scrolled-100');
        if (scrollPercent >= 100) {
            progressBar.classList.add('scrolled-100');
        } else if (scrollPercent >= 75) {
            progressBar.classList.add('scrolled-75');
        } else if (scrollPercent >= 50) {
            progressBar.classList.add('scrolled-50');
        } else if (scrollPercent >= 25) {
            progressBar.classList.add('scrolled-25');
        }
    });
}

/* ============================================
   Back to Top Button
   ============================================ */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   Collapsible Code Blocks
   ============================================ */
function initCollapsibleCode() {
    const triggers = document.querySelectorAll('.collapsible-trigger');

    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded
            this.setAttribute('aria-expanded', !isExpanded);

            // Toggle content visibility
            if (isExpanded) {
                content.style.display = 'none';
                content.setAttribute('aria-hidden', 'true');
            } else {
                content.style.display = 'block';
                content.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

/* ============================================
   Copy Code Button
   ============================================ */
function initCopyCode() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const codeBlock = this.parentElement.querySelector('code');
            const codeText = codeBlock.textContent;

            // Copy to clipboard
            navigator.clipboard.writeText(codeText).then(function() {
                // Show success feedback
                btn.textContent = '已复制!';
                btn.style.backgroundColor = 'rgba(39, 174, 96, 0.3)';

                // Reset after 2 seconds
                setTimeout(function() {
                    btn.textContent = '复制代码';
                    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy: ', err);
                btn.textContent = '复制失败';
            });
        });
    });
}

/* ============================================
   Sidebar Navigation
   ============================================ */
function initSidebarNavigation() {
    const sidebarNav = document.getElementById('sidebarNav');
    const sections = document.querySelectorAll('.article-section');
    const navLinks = sidebarNav.querySelectorAll('a');

    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        let currentSection = '';

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll to section on click
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        return;
    }

    // Fallback for browsers without native lazy loading
    images.forEach(function(img) {
        if (isInViewport(img)) {
            img.src = img.dataset.src;
        }
    });
}

window.addEventListener('scroll', debounce(lazyLoadImages, 100));