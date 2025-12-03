// ==========================================
//   CITECH INDEX - INTERACTIVE FEATURES
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // SCROLL ANIMATIONS (AOS)
    // ==========================================

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // STATS COUNTER ANIMATION
    // ==========================================

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (target === 24 ? '/7' : target === 98 ? '%' : '+');
                }
            };

            // Start animation when counter is visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================

    function initHeaderScroll() {
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================
    // PARALLAX EFFECT ON HERO
    // ==========================================

    function initParallax() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight);
                const translateY = scrolled * 0.5;

                if (heroContent) {
                    heroContent.style.transform = `translateY(${translateY}px)`;
                    heroContent.style.opacity = opacity;
                }
            }
        });
    }

    // ==========================================
    // CARD TILT EFFECT (OPTIONAL ENHANCEMENT)
    // ==========================================

    function initCardTilt() {
        const cards = document.querySelectorAll('.feature-card, .servicio-card, .valor-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ==========================================
    // INITIALIZE ALL FEATURES
    // ==========================================

    initScrollAnimations();
    animateCounters();
    initHeaderScroll();
    initSmoothScroll();
    initParallax();
    initCardTilt();

    // Log success
    console.log('🚀 CITECH Index - All features initialized');
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Defer non-critical animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
