// animations.js - ملف للرسوم المتحركة المتقدمة

// AOS (Animate On Scroll) البديل
class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.observeElements();
    }
    
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        this.elements.forEach(el => observer.observe(el));
    }
    
    animateElement(element) {
        const animation = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
            element.classList.add('animate__animated', `animate__${animation}`);
            
            // إزالة الفئة بعد انتهاء الحركة لإعادة استخدامها
            element.addEventListener('animationend', () => {
                element.classList.remove('animate__animated', `animate__${animation}`);
            });
        }, parseInt(delay));
    }
}

// Parallax Effect
class Parallax {
    constructor() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        if (this.parallaxElements.length > 0) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(window.pageYOffset * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Typing Animation
class TypeWriter {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.delay = options.delay || 2000;
        this.loop = options.loop !== false;
        this.currentText = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.init();
    }
    
    init() {
        this.type();
    }
    
    type() {
        const current = this.currentText % this.texts.length;
        const fullText = this.texts[current];
        
        if (this.isDeleting) {
            this.element.textContent = fullText.substring(0, this.currentChar - 1);
            this.currentChar--;
        } else {
            this.element.textContent = fullText.substring(0, this.currentChar + 1);
            this.currentChar++;
        }
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.currentChar === fullText.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentText++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Scroll Animator
    if (document.querySelectorAll('[data-animate]').length > 0) {
        new ScrollAnimator();
    }
    
    // Initialize Parallax
    new Parallax();
    
    // Initialize TypeWriter if element exists
    const typeElement = document.getElementById('typewriter');
    if (typeElement) {
        const texts = JSON.parse(typeElement.getAttribute('data-texts') || '["مرحباً بكم في ليبيا", "اكتشفوا جمال التاريخ", "استمتعوا بالطبيعة الخلابة"]');
        new TypeWriter(typeElement, texts, {
            speed: 100,
            delay: 2000,
            loop: true
        });
    }
    
    // Particle Background (إذا كان هناك عنصر للجسيمات)
    const particlesEl = document.getElementById('particles');
    if (particlesEl) {
        createParticles(particlesEl);
    }
});

// Particle System
function createParticles(container) {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // إعداد عشوائي
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    /* Animation Classes */
    .animate__animated {
        animation-duration: 1s;
        animation-fill-mode: both;
    }
    
    .animate__fadeIn {
        animation-name: fadeIn;
    }
    
    .animate__fadeInUp {
        animation-name: fadeInUp;
    }
    
    .animate__fadeInDown {
        animation-name: fadeInDown;
    }
    
    .animate__fadeInLeft {
        animation-name: fadeInLeft;
    }
    
    .animate__fadeInRight {
        animation-name: fadeInRight;
    }
    
    .animate__zoomIn {
        animation-name: zoomIn;
    }
    
    .animate__bounceIn {
        animation-name: bounceIn;
    }
    
    /* Keyframes */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes bounceIn {
        from, 20%, 40%, 60%, 80%, to {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }
        0% {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
        }
        20% {
            transform: scale3d(1.1, 1.1, 1.1);
        }
        40% {
            transform: scale3d(.9, .9, .9);
        }
        60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
        }
        80% {
            transform: scale3d(.97, .97, .97);
        }
        to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
        }
    }
    
    /* Particles */
    .particle {
        position: absolute;
        background: rgba(201, 162, 77, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: float linear infinite;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.5;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
        }
    }
    
    /* Page Loader */
    .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-blue);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
    }
    
    .loader-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: var(--gold);
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);