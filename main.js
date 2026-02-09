// main.js - الملف الرئيسي للجافاسكريبت

document.addEventListener('DOMContentLoaded', function() {
    
    // ====================
    // 1. Mobile Navigation
    // ====================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // ====================
    // 2. Back to Top Button
    // ====================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ====================
    // 3. Newsletter Form
    // ====================
    const subscribeForm = document.getElementById('subscribeForm');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const messageDiv = document.getElementById('formMessage');
            const email = emailInput.value.trim();
            
            // التحقق من صحة البريد الإلكتروني
            if (!email || !isValidEmail(email)) {
                showMessage(messageDiv, 'الرجاء إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            // محاكاة إرسال البيانات
            showMessage(messageDiv, 'جاري الإشتراك...', 'loading');
            
            setTimeout(() => {
                showMessage(messageDiv, 'شكراً لك! تم اشتراكك بنجاح.', 'success');
                emailInput.value = '';
                
                // إعادة تعيين الرسالة بعد 5 ثواني
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
    
    // ====================
    // 4. Smooth Scrolling
    // ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ====================
    // 5. Active Navigation Link
    // ====================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            
            if (currentPath.endsWith(linkPath) || 
                (linkPath === 'index.html' && currentPath.endsWith('/'))) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ====================
    // 6. Image Lazy Loading
    // ====================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ====================
    // 7. Counter Animation
    // ====================
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    
                    let current = 0;
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 16);
                    
                    observer.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    // ====================
    // Helper Functions
    // ====================
    
    // التحقق من صحة البريد الإلكتروني
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // عرض الرسائل
    function showMessage(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = 'form-message';
        element.classList.add(type);
        element.style.display = 'block';
    }
    
    // إضافة فئة loaded للجسم بعد تحميل الصفحة
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
});

// دالة ثانوية للتحقق من النماذج
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// دالة لعرض التنبيهات
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// إضافة أنماط CSS للتنبيهات
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(alertStyles);