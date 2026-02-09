// form-validator.js - التحقق من صحة النماذج

class FormValidator {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.options = {
            showErrors: true,
            liveValidation: true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.fields = this.form.querySelectorAll('[data-validate]');
        this.setupValidation();
    }
    
    setupValidation() {
        // التحقق المباشر أثناء الكتابة
        if (this.options.liveValidation) {
            this.fields.forEach(field => {
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('blur', () => this.validateField(field));
            });
        }
        
        // التحقق عند الإرسال
        this.form.addEventListener('submit', (e) => {
            if (!this.validateAll()) {
                e.preventDefault();
            }
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const rules = field.getAttribute('data-validate').split('|');
        let isValid = true;
        let errorMessage = '';
        
        for (const rule of rules) {
            const [ruleName, ruleValue] = rule.split(':');
            
            switch(ruleName) {
                case 'required':
                    if (!value) {
                        isValid = false;
                        errorMessage = 'هذا الحقل مطلوب';
                    }
                    break;
                    
                case 'email':
                    if (value && !this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'بريد إلكتروني غير صحيح';
                    }
                    break;
                    
                case 'min':
                    if (value.length < parseInt(ruleValue)) {
                        isValid = false;
                        errorMessage = `يجب أن يكون ${ruleValue} أحرف على الأقل`;
                    }
                    break;
                    
                case 'max':
                    if (value.length > parseInt(ruleValue)) {
                        isValid = false;
                        errorMessage = `يجب أن يكون ${ruleValue} أحرف كحد أقصى`;
                    }
                    break;
                    
                case 'numeric':
                    if (value && isNaN(value)) {
                        isValid = false;
                        errorMessage = 'يجب أن يكون رقماً';
                    }
                    break;
                    
                case 'match':
                    const matchField = document.getElementById(ruleValue);
                    if (matchField && value !== matchField.value) {
                        isValid = false;
                        errorMessage = 'القيم غير متطابقة';
                    }
                    break;
            }
            
            if (!isValid) break;
        }
        
        this.setFieldStatus(field, isValid, errorMessage);
        return isValid;
    }
    
    validateAll() {
        let isValid = true;
        
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    setFieldStatus(field, isValid, message = '') {
        if (!this.options.showErrors) return;
        
        // إزالة حالات الخطأ السابقة
        field.classList.remove('error', 'success');
        
        const errorElement = field.nextElementSibling?.classList.contains('error-message') 
            ? field.nextElementSibling 
            : this.createErrorElement(field);
        
        if (isValid) {
            field.classList.add('success');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    createErrorElement(field) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        return errorElement;
    }
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // إعادة تعيين النموذج
    reset() {
        this.form.reset();
        this.fields.forEach(field => {
            field.classList.remove('error', 'success');
            const errorElement = field.nextElementSibling;
            if (errorElement?.classList.contains('error-message')) {
                errorElement.style.display = 'none';
            }
        });
    }
}

// CSS للتحقق من النماذج
const formStyles = document.createElement('style');
formStyles.textContent = `
    .error {
        border-color: #dc3545 !important;
    }
    
    .success {
        border-color: #28a745 !important;
    }
    
    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: none;
    }
    
    input:focus.error,
    textarea:focus.error {
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    input:focus.success,
    textarea:focus.success {
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
`;
document.head.appendChild(formStyles);

// التهيئة التلقائية للنماذج
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
        const formId = form.id || `form-${Math.random().toString(36).substr(2, 9)}`;
        if (!form.id) form.id = formId;
        new FormValidator(formId);
    });
});