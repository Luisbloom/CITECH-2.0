// Navigation enhancements - Add to all pages
document.addEventListener('DOMContentLoaded', () => {
    // Add active class to current page link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav ul li a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath && currentPath.includes(linkPath.split('?')[0].split('#')[0])) {
            link.classList.add('active');
        }
    });

    // Scroll header effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const createMobileToggle = () => {
        const header = document.querySelector('header');
        const nav = header.querySelector('nav');

        // Check if toggle already exists
        if (header.querySelector('.menu-toggle')) return;

        const toggle = document.createElement('div');
        toggle.className = 'menu-toggle';
        toggle.innerHTML = '<span></span><span></span><span></span>';

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.querySelector('ul').classList.toggle('active');
        });

        // Insert before nav
        header.insertBefore(toggle, nav);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                toggle.classList.remove('active');
                nav.querySelector('ul').classList.remove('active');
            }
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.querySelector('ul').classList.remove('active');
            });
        });
    };

    createMobileToggle();
});
