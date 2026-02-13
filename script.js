/* ============================================================
   PREMIUM BIRTHDAY WEBSITE — ANIMATION ENGINE
   ============================================================ */

// ---- 0. ENTRY SPLASH — Start Music on Tap ----
const entrySplash = document.getElementById('entry-splash');
const enterBtn = document.getElementById('enter-btn');
const bgMusic = document.getElementById('bg-music');

function enterSite() {
    // Start music (direct tap = mobile browsers allow it)
    if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(() => { });
    }

    // Mark audio as playing
    const ab = document.getElementById('audio-btn');
    if (ab) ab.classList.add('playing');

    // Fade out splash
    if (entrySplash) entrySplash.classList.add('hidden');

    // Show preloader, then hide it after delay
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'flex';
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }, 1500);
    }
}

if (enterBtn) enterBtn.addEventListener('click', enterSite);
// Also allow tapping anywhere on the splash
if (entrySplash) entrySplash.addEventListener('click', enterSite);

// ---- 1. SMOOTH SCROLL (Lenis) ----
const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ---- 2. GSAP SETUP ----
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ---- 3. CUSTOM CURSOR ----
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        gsap.to(cursorDot, { x: cursorX, y: cursorY, duration: 0.1 });
    });

    // Smooth ring follow
    gsap.ticker.add(() => {
        ringX += (cursorX - ringX) * 0.12;
        ringY += (cursorY - ringY) * 0.12;
        gsap.set(cursorRing, { x: ringX, y: ringY });
    });

    // Hover effects for interactive elements
    document.querySelectorAll('a, button, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorDot, { scale: 0.5, duration: 0.3 });
            gsap.to(cursorRing, { width: 60, height: 60, borderColor: 'rgba(212,175,55,0.8)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorDot, { scale: 1, duration: 0.3 });
            gsap.to(cursorRing, { width: 40, height: 40, borderColor: 'rgba(212,175,55,0.4)', duration: 0.3 });
        });
    });
}

// ---- 4. FLOATING PARTICLES ----
const particlesContainer = document.getElementById('particles-container');
const PARTICLE_COUNT = 40;

function createParticles() {
    if (!particlesContainer) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 1;
        const colors = ['rgba(212,175,55,0.4)', 'rgba(110,142,251,0.3)', 'rgba(167,119,227,0.3)', 'rgba(255,255,255,0.2)'];

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
        `;

        particlesContainer.appendChild(particle);

        // Animate each particle
        gsap.to(particle, {
            opacity: Math.random() * 0.6 + 0.1,
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 3,
            repeat: -1,
            yoyo: true,
        });

        gsap.to(particle, {
            x: `random(-100, 100)`,
            y: `random(-100, 100)`,
            duration: Math.random() * 20 + 15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    }
}
createParticles();

// ---- 5. PRELOADER ----
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.preloader-text', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        delay: 0.8
    })
        .to('.preloader-ring', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
        }, '-=0.3')
        .to(preloader, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut',
        })
        .set(preloader, { display: 'none' })
        .add(() => animateHero()); // Trigger hero after preloader exits
});

// ---- 6. HERO ANIMATIONS ----
function animateHero() {
    const tl = gsap.timeline();

    tl.to('.intro-text', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
    })
        .to('.word', {
            y: '0%',
            duration: 1.2,
            stagger: 0.2,
            ease: 'power4.out',
        }, '-=0.6')
        .to('.date-badge', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
        }, '-=0.6')
        .from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 0.6,
        }, '-=0.3')
        .from('.sparkle', {
            opacity: 0,
            scale: 0,
            stagger: 0.15,
            duration: 0.5,
        }, '-=0.8');
}

// ---- 7. SCROLL ANIMATIONS ----

// Wish Section
gsap.from('.section-badge', {
    scrollTrigger: {
        trigger: '.wish-section',
        start: 'top 75%',
    },
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
});

gsap.from('.section-title', {
    scrollTrigger: {
        trigger: '.wish-section',
        start: 'top 70%',
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
});

gsap.from('.divider', {
    scrollTrigger: {
        trigger: '.wish-section',
        start: 'top 60%',
    },
    scaleX: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
});

gsap.from('.flow-text', {
    scrollTrigger: {
        trigger: '.wish-section',
        start: 'top 55%',
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
});

// Gallery Carousel — Reveal on scroll
gsap.from('.carousel-wrapper', {
    scrollTrigger: {
        trigger: '.gallery-section',
        start: 'top 70%',
    },
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
});

// ---- CAROUSEL ENGINE ----
const carouselSlides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const progressBar = document.getElementById('carousel-progress-bar');
const currentCounter = document.getElementById('carousel-current');
const totalSlides = carouselSlides.length;
let currentSlide = 0;
let autoPlayTimer = null;
const AUTO_PLAY_INTERVAL = 4000; // 4 seconds

function goToSlide(index, direction = 'next') {
    if (index === currentSlide) return;

    const outgoing = carouselSlides[currentSlide];
    const incoming = carouselSlides[index];

    // Remove active from all
    carouselSlides.forEach(s => { s.classList.remove('active', 'exiting'); });
    indicators.forEach(d => d.classList.remove('active'));

    // Animate outgoing
    outgoing.classList.add('exiting');

    // Animate incoming 
    incoming.classList.add('active');

    // GSAP for extra polish on the image
    gsap.fromTo(incoming.querySelector('.slide-img'),
        { scale: 1.15 },
        { scale: 1, duration: 1.2, ease: 'power2.out' }
    );

    // Update indicator
    indicators[index].classList.add('active');

    // Update progress bar
    const progress = ((index + 1) / totalSlides) * 100;
    if (progressBar) progressBar.style.width = progress + '%';

    // Update counter
    if (currentCounter) currentCounter.textContent = String(index + 1).padStart(2, '0');

    currentSlide = index;
    resetAutoPlay();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides, 'next');
}

function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides, 'prev');
}

// Arrow click
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Indicator click
indicators.forEach(ind => {
    ind.addEventListener('click', () => {
        const idx = parseInt(ind.dataset.index);
        goToSlide(idx);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Touch swipe support
let touchStartX = 0;
const track = document.getElementById('carousel-track');
if (track) {
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    }, { passive: true });
}

// Auto-play
function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
}
resetAutoPlay();

// ---- DEDICATION SECTION ANIMATIONS ----
// ECG line draw on scroll
gsap.to('.ecg-trace-section', {
    scrollTrigger: {
        trigger: '.dedication-section',
        start: 'top 80%',
    },
    strokeDashoffset: 0,
    duration: 2.5,
    ease: 'power2.inOut',
});

// Staggered reveals
const dedicationTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.dedication-section',
        start: 'top 65%',
    }
});

dedicationTl
    .from('.dedication-badge', {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
    })
    .from('.dedication-title', {
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    }, '-=0.5')
    .from('.dedication-divider', {
        scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)',
    }, '-=0.5')
    .from('.dedication-text', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
    }, '-=0.3')
    .from('.stat-item', {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
    }, '-=0.4')
    .from('.dedication-closing', {
        opacity: 0, duration: 0.8, ease: 'power3.out',
    }, '-=0.2');

// Message Card
gsap.to('.glass-card', {
    scrollTrigger: {
        trigger: '.message-section',
        start: 'top 70%',
    },
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: 'power3.out',
});

// Celebration Section
const celebTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.celebration-section',
        start: 'top 60%',
    }
});

celebTl.to('.final-line', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power4.out',
})
    .to('.final-subtext', {
        opacity: 1,
        duration: 0.6,
    }, '-=0.5')
    .from('.celebrate-btn', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
    }, '-=0.3');

// ---- 8. NAVIGATION DOTS ----
const sections = document.querySelectorAll('section');
const dots = document.querySelectorAll('.dot');

sections.forEach((section, index) => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateDots(index),
        onEnterBack: () => updateDots(index),
    });
});

function updateDots(activeIndex) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
    });
}

// Smooth scroll on dot click
dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(dot.getAttribute('href'));
        if (target) lenis.scrollTo(target);
    });
});

// ---- 9. CONFETTI CELEBRATION ----
const confettiBtn = document.getElementById('confetti-btn');
if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
        // Button pulse
        gsap.to(confettiBtn, { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 });

        const duration = 6000;
        const animationEnd = Date.now() + duration;
        const colors = ['#d4af37', '#f0d27a', '#ffffff', '#6e8efb', '#a777e3'];

        // Big initial pop
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: colors,
            zIndex: 999,
        });

        // Continuous bursts
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 40 * (timeLeft / duration);

            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() * 0.3 },
                colors: colors,
                zIndex: 999,
            });
            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() * 0.3 },
                colors: colors,
                zIndex: 999,
            });
        }, 300);

        // Trigger emoji rain
        startEmojiRain();
    });
}

// ---- 10. EMOJI RAIN ----
function startEmojiRain() {
    const container = document.getElementById('emoji-rain');
    if (!container) return;

    const emojis = ['🎂', '🎉', '🎊', '⭐', '🎈', '🎁', '🥳', '✨', '🎶', '🌟'];
    let count = 0;
    const maxEmojis = 40;

    const interval = setInterval(() => {
        if (count >= maxEmojis) return clearInterval(interval);

        const emoji = document.createElement('span');
        emoji.classList.add('emoji-drop');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.animationDuration = (Math.random() * 2 + 3) + 's';
        emoji.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        container.appendChild(emoji);
        count++;

        // Cleanup after animation
        setTimeout(() => emoji.remove(), 5000);
    }, 150);
}

// ---- 11. AUDIO — AUTO-PLAY ON FIRST INTERACTION ----
const audioBtn = document.getElementById('audio-btn');
const audio = document.getElementById('bg-music');
let isPlaying = false;

function startMusic() {
    if (!isPlaying && audio) {
        audio.volume = 0.5;
        audio.play().then(() => {
            isPlaying = true;
            if (audioBtn) audioBtn.classList.add('playing');
        }).catch(() => { });
    }
}

// Auto-play on first user interaction (browsers require a gesture)
function autoPlayOnce() {
    startMusic();
    document.removeEventListener('click', autoPlayOnce);
    document.removeEventListener('touchstart', autoPlayOnce);
    document.removeEventListener('scroll', autoPlayOnce);
    document.removeEventListener('keydown', autoPlayOnce);
}

document.addEventListener('click', autoPlayOnce);
document.addEventListener('touchstart', autoPlayOnce);
document.addEventListener('scroll', autoPlayOnce);
document.addEventListener('keydown', autoPlayOnce);

// Toggle button
if (audioBtn && audio) {
    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audio.pause();
            audioBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            audio.play().catch(() => { });
            audioBtn.classList.add('playing');
            isPlaying = true;
        }
    });
}

// ---- 12. WISH BOX — SEND TO WHATSAPP ----
const sendWishBtn = document.getElementById('send-wish-btn');
const wishTextarea = document.getElementById('wish-textarea');

if (sendWishBtn && wishTextarea) {
    sendWishBtn.addEventListener('click', () => {
        const message = wishTextarea.value.trim();
        if (!message) {
            // Shake the textarea if empty
            gsap.to(wishTextarea, {
                x: [-8, 8, -6, 6, -3, 3, 0],
                duration: 0.5,
                ease: 'power2.out',
            });
            wishTextarea.focus();
            return;
        }

        // Open WhatsApp with the message
        const phone = '919551733526';
        const encodedMsg = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phone}?text=${encodedMsg}`;
        window.open(whatsappURL, '_blank');

        // Button success feedback
        gsap.to(sendWishBtn, { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 });
    });
}

// Wish Box scroll animation
gsap.from('.wish-box-container', {
    scrollTrigger: {
        trigger: '.wish-box-section',
        start: 'top 75%',
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
});
