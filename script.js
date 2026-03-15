gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.querySelector('.loader-bar');
    
    // Simulate loading progress
    gsap.to(loaderBar, {
        width: '100%',
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    preloader.style.visibility = 'hidden';
                    initAnimations();
                }
            });
        }
    });
});

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Visual feedback for theme change
        gsap.fromTo('body', { opacity: 0.8 }, { opacity: 1, duration: 0.5 });
    });
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
    });
    gsap.to(follower, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.3,
        ease: 'power2.out'
    });
});

// Magnetic Buttons
const magneticItems = document.querySelectorAll('.magnetic');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(item, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightbox = document.querySelector('.lightbox-close');
const triggers = document.querySelectorAll('.lightbox-trigger');
const prevBtn = document.getElementById('prev-img');
const nextBtn = document.getElementById('next-img');

let currentImgIndex = 0;
const images = Array.from(triggers).map(trigger => ({
    src: trigger.dataset.src,
    title: trigger.dataset.title,
    desc: trigger.dataset.desc
}));

function openLightbox(index) {
    currentImgIndex = index;
    updateLightboxContent();
    lightbox.style.display = 'flex';
    gsap.to(lightbox, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    lenis.stop(); // Stop scrolling when lightbox is open
}

function updateLightboxContent() {
    const data = images[currentImgIndex];
    gsap.to(lightboxImg, { opacity: 0, duration: 0.2, onComplete: () => {
        lightboxImg.src = data.src;
        lightboxCaption.innerHTML = `<strong>${data.title}</strong><br>${data.desc}`;
        gsap.to(lightboxImg, { opacity: 1, duration: 0.4 });
    }});
}

triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => openLightbox(index));
});

if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
        gsap.to(lightbox, { opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: () => {
            lightbox.style.display = 'none';
            lenis.start();
        }});
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
        updateLightboxContent();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex + 1) % images.length;
        updateLightboxContent();
    });
}

// Hamburger Menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        lenis.start();
    });
});

// Animations Initialization
function initAnimations() {
    // Hero Reveal
    const heroTl = gsap.timeline();
    heroTl.to('.reveal-text', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
    });

    heroTl.from('.hero-image-container', {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: 'power2.out'
    }, "-=1");

    // Parallax Hero
    gsap.to('.hero-image', {
        yPercent: 20,
        ease: 'none',
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
        y: 60,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 85%',
        }
    });

    // About Section
    gsap.from('.about-text', {
        opacity: 0,
        x: -30,
        duration: 1.2,
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 75%',
        }
    });

    gsap.from('blockquote', {
        opacity: 0,
        y: 40,
        duration: 1.5,
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 60%',
        }
    });
}

// Cursor states
document.querySelectorAll('a, button, .gallery-item, .theme-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        gsap.to(follower, { scale: 2, backgroundColor: 'rgba(197, 160, 89, 0.1)', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        gsap.to(follower, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
    });
});
