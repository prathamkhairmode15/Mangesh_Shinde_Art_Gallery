gsap.registerPlugin(ScrollTrigger);

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Custom Cursor Lag Effect
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    gsap.to(follower, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.3
    });
});

// Hamburger Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle && navLinks) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Cursor Hover State
document.querySelectorAll('a, button, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// Initialize animations
window.addEventListener('load', () => {
    // Hero Reveal
    const heroTl = gsap.timeline();
    
    heroTl.to('.reveal-text', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out'
    });

    heroTl.from('.hero-image-container', {
        opacity: 0,
        x: 50,
        duration: 2,
        ease: 'power4.out'
    }, "-=1");

    // Parallax effect for Hero Image
    gsap.to('.hero-image', {
        y: -100,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Gallery Reveal
    gsap.from('.gallery-item', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 80%',
        }
    });

    // About Reveal
    gsap.from('.about-text', {
        opacity: 0,
        x: -50,
        duration: 1.5,
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
        }
    });

    gsap.from('blockquote', {
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 50%',
        }
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: target.offsetTop,
                    ease: 'power4.inOut'
                });
            }
        });
    });
});
