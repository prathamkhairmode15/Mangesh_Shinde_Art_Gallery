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
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const loaderBar = document.querySelector('.loader-bar');
    
    // Speed up initial load reveal
    gsap.to(loaderBar, {
        width: '100%',
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.inOut',
                onComplete: () => {
                    preloader.style.visibility = 'hidden';
                    // initAnimations already called via reveal timing or after load
                }
            });
        }
    });

    // High priority animations
    initAnimations();
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
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.getElementById('prev-img');
const nextBtn = document.getElementById('next-img');

let currentImgIndex = 0;
let triggers = [];

function openLightbox(index) {
    if (!lightbox) return;
    currentImgIndex = index;
    updateLightboxContent();
    
    lightbox.style.display = 'flex';
    gsap.to(lightbox, { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'power2.out',
        onStart: () => lenis.stop()
    });
}

function updateLightboxContent() {
    const trigger = triggers[currentImgIndex];
    if (!trigger) return;

    const data = {
        src: trigger.dataset.src,
        title: trigger.dataset.title,
        desc: trigger.dataset.desc
    };

    gsap.to(lightboxImg, { opacity: 0, duration: 0.2, onComplete: () => {
        lightboxImg.src = data.src;
        lightboxCaption.innerHTML = `<strong>${data.title}</strong><br>${data.desc}`;
        gsap.to(lightboxImg, { opacity: 1, duration: 0.4 });
    }});
}

function initLightboxTriggers() {
    triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
    triggers.forEach((trigger, index) => {
        trigger.addEventListener('click', () => openLightbox(index));
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        gsap.to(lightbox, { 
            opacity: 0, 
            duration: 0.5, 
            ease: 'power2.in', 
            onComplete: () => {
                lightbox.style.display = 'none';
                lenis.start();
            }
        });
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex - 1 + triggers.length) % triggers.length;
        updateLightboxContent();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex + 1) % triggers.length;
        updateLightboxContent();
    });
}

// Hamburger Menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function initMobileNav() {
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
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
            lenis.start();
        });
    });
}
initMobileNav();

// Artworks Data & Rendering
const ARTWORKS_DATA = [
    {
        "id": 1,
        "image": "assets/landscape_1.png",
        "title": "Misty Peaks",
        "date": "2024",
        "category": "Landscapes",
        "medium": "Oil on Canvas",
        "status": "Available"
    },
    {
        "id": 2,
        "image": "assets/conceptual_1.png",
        "title": "Soul's Echo",
        "date": "2023",
        "category": "Conceptual",
        "medium": "Mixed Media",
        "status": "Sold"
    },
    {
        "id": 3,
        "image": "assets/abstract_1.png",
        "title": "Golden Echo",
        "date": "2024",
        "category": "Abstract",
        "medium": "Abstract Oil",
        "status": "Available"
    },
    {
        "id": 4,
        "image": "assets/still_life_1.png",
        "title": "The Wilting Rose",
        "date": "2025",
        "category": "Still Life",
        "medium": "Classical Study",
        "status": "Available"
    }
];

let allArtworks = [];
function loadArtworks() {
    allArtworks = ARTWORKS_DATA;
    
    const isHomePage = !!document.getElementById('home-gallery-grid');
    const isPortfolioPage = !!document.getElementById('portfolio-gallery-grid');
    
    if (isHomePage) {
        renderArtworks('home-gallery-grid', 3); 
        initHeroSlideshow();
    } else if (isPortfolioPage) {
        renderArtworks('portfolio-gallery-grid');
        initFilters();
    }
}

function renderArtworks(containerId, limit = null, categoryFilter = 'All') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filtered = allArtworks;
    if (categoryFilter !== 'All') {
        filtered = allArtworks.filter(art => art.category === categoryFilter);
    }

    if (limit) {
        filtered = filtered.slice(0, limit);
    }

    container.innerHTML = filtered.map(art => `
        <div class="gallery-item lightbox-trigger" 
             data-src="${art.image}" 
             data-title="${art.title}" 
             data-desc="${art.medium} (${art.date})">
            <div class="gallery-img-wrapper">
                <img src="${art.image}" alt="${art.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${art.title}</h3>
                    ${art.status === 'Sold' ? '<span class="status-badge sold">Sold</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');

    initLightboxTriggers();
    initGalleryAnimations();
    ScrollTrigger.refresh();
    refreshCursorHovers();
}

function initFilters() {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;

    const categories = ['All', ...new Set(allArtworks.map(art => art.category))];
    filterContainer.innerHTML = categories.map(cat => `
        <button class="filter-btn ${cat === 'All' ? 'active' : ''} magnetic" data-category="${cat}">${cat}</button>
    `).join('');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderArtworks('portfolio-gallery-grid', null, btn.dataset.category);
        });
    });
}

// Hero Slideshow
function initHeroSlideshow() {
    const container = document.getElementById('hero-slideshow');
    if (!container || allArtworks.length === 0) return;

    // Use up to 10 artworks
    const slides = allArtworks.slice(0, 10);
    
    // Create slides and clone them for infinite loop
    const slideHTML = slides.map(art => `
        <div class="slideshow-item">
            <img src="${art.image}" alt="${art.title}">
        </div>
    `).join('');
    
    container.innerHTML = slideHTML + slideHTML; // Double the items for infinite effect

    let currentIndex = 0;
    const totalItems = slides.length;
    let isAnimating = false;

    function getStepWidth() {
        const firstItem = container.querySelector('.slideshow-item');
        return firstItem ? firstItem.offsetWidth : 0;
    }

    function slideNext() {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex++;
        const stepWidth = getStepWidth();
        
        gsap.to(container, {
            x: -currentIndex * stepWidth,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                if (currentIndex >= totalItems) {
                    currentIndex = 0;
                    gsap.set(container, { x: 0 });
                }
                isAnimating = false;
                // Delay of 0.5s before next slide as requested
                gsap.delayedCall(0.5, slideNext);
            }
        });
    }

    // Start the slideshow after a short delay to ensure layout is ready
    window.addEventListener('load', () => {
        gsap.delayedCall(1, slideNext);
    });
    
    // If already loaded
    if (document.readyState === 'complete') {
        gsap.delayedCall(1, slideNext);
    }

    // Handle resize: reset to avoid offset issues
    window.addEventListener('resize', () => {
        gsap.killTweensOf(container);
        currentIndex = 0;
        gsap.set(container, { x: 0 });
        isAnimating = false;
    });
}

// Initial load
loadArtworks();

// Animations Initialization
let animationsInitialized = false;
function initAnimations() {
    if (animationsInitialized) {
        ScrollTrigger.refresh();
        return;
    }
    animationsInitialized = true;

    // Hero Reveal
    const heroTl = gsap.timeline();
    heroTl.to('.reveal-text', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
    });

    heroTl.to('.hero-image-container', {
        opacity: 1,
        scale: 1,
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

    // About Section
    gsap.from('.about-text', {
        opacity: 0,
        x: -30,
        duration: 1.2,
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 85%',
        }
    });

    gsap.from('blockquote', {
        opacity: 0,
        y: 40,
        duration: 1.5,
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
        }
    });
}

function initGalleryAnimations() {
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
}

// Cursor Interactions
function refreshCursorHovers() {
    const follower = document.querySelector('.cursor-follower');
    document.querySelectorAll('a, button, .gallery-item, .theme-toggle, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
            gsap.to(follower, { scale: 2, backgroundColor: 'rgba(197, 160, 89, 0.1)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
            gsap.to(follower, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
        });
    });
}
refreshCursorHovers();
