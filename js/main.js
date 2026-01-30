/**
 * Premium Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavScroll();
    initSmoothScroll();
    initParallax();
    initTextAnimations();
    initHoverEffects();
});

// Scroll Reveal Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.project, .service, .stat, .about-content, .section-head');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '-40px' });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
}

// Nav Background on Scroll
function initNavScroll() {
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// Parallax for Ambient Glows & Shapes
function initParallax() {
    const glows = document.querySelectorAll('.glow');
    const shapes = document.querySelectorAll('.shape');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                glows.forEach((glow, i) => {
                    const speed = 0.04 + i * 0.015;
                    const rotate = scrollY * 0.01 * (i + 1);
                    glow.style.transform = `translateY(${scrollY * speed}px) rotate(${rotate}deg)`;
                });

                shapes.forEach((shape, i) => {
                    const speed = 0.06 + i * 0.025;
                    const direction = i % 2 === 0 ? 1 : -1;
                    const scale = 1 + (scrollY * 0.0001);
                    shape.style.transform = `translateY(${scrollY * speed * direction}px) scale(${scale})`;
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mouse parallax for glows
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        glows.forEach((glow, i) => {
            const factor = 0.5 + i * 0.3;
            glow.style.marginLeft = `${x * factor}px`;
            glow.style.marginTop = `${y * factor}px`;
        });
    });
}

// Text animations for hero
function initTextAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroDesc = document.querySelector('.hero-desc');

    // Add shimmer to name
    if (heroTitle) {
        heroTitle.addEventListener('mouseenter', () => {
            heroTitle.style.filter = 'brightness(1.2)';
        });
        heroTitle.addEventListener('mouseleave', () => {
            heroTitle.style.filter = '';
        });
    }
}

// Premium hover effects
function initHoverEffects() {
    // Buttons with ripple
    const buttons = document.querySelectorAll('.btn-primary, .nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            btn.style.setProperty('--mouse-x', `${x}px`);
            btn.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Project cards tilt
    const cards = document.querySelectorAll('.project');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Links underline animation
    const links = document.querySelectorAll('.nav-center a, .contact-link');
    links.forEach(link => {
        link.style.position = 'relative';
        link.addEventListener('mouseenter', () => {
            link.style.transition = 'color 0.3s';
        });
    });

    // Social icons pulse
    const socials = document.querySelectorAll('.socials a');
    socials.forEach(social => {
        social.addEventListener('mouseenter', () => {
            social.style.animation = 'socialPulse 0.5s ease';
        });
        social.addEventListener('animationend', () => {
            social.style.animation = '';
        });
    });
}

// Add dynamic styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes socialPulse {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-3px) scale(1.1); }
    }
`;
document.head.appendChild(style);
