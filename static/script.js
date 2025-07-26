// main.js – JobGenie Main Script

// Global user state
let currentUser = null;
let userType = null;

// Initialize App on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    checkAuthState();

    const path = window.location.pathname;

    if (path.includes('login.html')) {
        initializeLogin();
    } else if (path.includes('register.html')) {
        initializeRegister();
    } else {
        initializeHomepage();
    }
});

// =================== APP INIT =================== //
function initializeApp() {
    initMobileMenu();
    initSmoothScroll();
    initNavbarScrollEffect();
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 100);
        });
    }
}

// =================== AUTH STATE =================== //
function checkAuthState() {
    const user = localStorage.getItem('jobgenie_user');
    const type = localStorage.getItem('jobgenie_user_type');

    if (user && type) {
        currentUser = JSON.parse(user);
        userType = type;

        const path = window.location.pathname;
        if (path.includes('login.html') || path.includes('register.html')) {
            redirectToDashboard();
        }
    }
}

function redirectToDashboard() {
    const dash = userType === 'company' ? 'admin-dashboard.html' : 'jobseeker-dashboard.html';
    window.location.href = dash;
}

// =================== HOMEPAGE =================== //
function initializeHomepage() {
    animateHeroElements();
    animateStatsCounters();
    initializeFeatureCards();
}

function animateHeroElements() {
    const heroElements = [
        { selector: '.hero-text', delay: 200 },
        { selector: '.hero-image', delay: 400 },
        { selector: '.search-widget', delay: 600 }
    ];

    heroElements.forEach(({ selector, delay }) => {
        const el = document.querySelector(selector);
        if (el) {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, delay);
        }
    });
}

function animateStatsCounters() {
    const statItems = document.querySelectorAll('.stat-item h3');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const num = parseInt(target.textContent.replace(/\D/g, ''));
                const suffix = target.textContent.replace(/\d/g, '');
                animateNumber(target, 0, num, 2000, suffix);
                observer.unobserve(target);
            }
        });
    });

    statItems.forEach(item => observer.observe(item));
}

function animateNumber(el, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

function initializeFeatureCards() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px) scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
    });
}

// =================== SEARCH =================== //
function searchJobs() {
    const job = document.getElementById('job-search')?.value || '';
    const location = document.getElementById('location-search')?.value || '';
    const category = document.getElementById('category-search')?.value || '';

    const btn = document.querySelector('.search-widget button');
    if (!btn) return;

    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        showNotification(`Search completed! Found 47 matching jobs.`, 'success');
    }, 1500);
}

// =================== LOGIN =================== //
function initializeLogin() {
    const form = document.getElementById('loginForm');
    form?.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    const btn = loginForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    btn.disabled = true;

    setTimeout(() => {
        if (email && password) {
            const isCompany = email.includes('@company.com') || email.includes('@corp.com');
            const user = {
                id: generateId(),
                email,
                name: isCompany ? 'TechCorp Solutions' : 'Sarah Johnson',
                type: isCompany ? 'company' : 'jobseeker'
            };

            localStorage.setItem('jobgenie_user', JSON.stringify(user));
            localStorage.setItem('jobgenie_user_type', user.type);
            redirectToDashboard();
        } else {
            btn.innerHTML = original;
            btn.disabled = false;
            showNotification('Please check your credentials and try again.', 'error');
        }
    }, 1500);
}

// =================== REGISTER =================== //
function initializeRegister() {
    initializeUserTypeSelection();
    initializeRegistrationForm();
    setupPasswordStrength();
}

function initializeUserTypeSelection() {
    const options = document.querySelectorAll('.user-type-option');
    const typeParam = new URLSearchParams(window.location.search).get('type');
    if (typeParam) selectUserType(typeParam);

    options.forEach(option => {
        option.addEventListener('click', () => selectUserType(option.dataset.type));
    });
}

function selectUserType(type) {
    document.querySelectorAll('.user-type-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`[data-type="${type}"]`)?.classList.add('selected');

    document.getElementById('userTypeSelection').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('authDivider').style.display = 'block';
    document.getElementById('socialLogin').style.display = 'flex';

    const isCompany = type === 'company';
    document.getElementById('companyFields').style.display = isCompany ? 'block' : 'none';
    document.getElementById('companyName').required = isCompany;
    document.getElementById('selectedType').innerHTML = isCompany ?
        '<i class="fas fa-building"></i> Registering as Company' :
        '<i class="fas fa-user"></i> Registering as Job Seeker';
    document.getElementById('selectedType').style.display = 'block';

    userType = type;
}

function initializeRegistrationForm() {
    document.getElementById('registerForm')?.addEventListener('submit', handleRegistration);
}

function handleRegistration(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    btn.disabled = true;

    setTimeout(() => {
        const user = {
            id: generateId(),
            email: data.email,
            name: userType === 'company' ? data.companyName : `${data.firstName} ${data.lastName}`,
            type: userType,
            ...data
        };

        localStorage.setItem('jobgenie_user', JSON.stringify(user));
        localStorage.setItem('jobgenie_user_type', user.type);
        showNotification('Account created successfully! Redirecting...', 'success');

        setTimeout(redirectToDashboard, 1500);
    }, 2000);
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const indicator = document.getElementById('passwordStrength');

    passwordInput?.addEventListener('input', e => {
        const strength = calculatePasswordStrength(e.target.value);
        updatePasswordStrengthDisplay(indicator, strength);
    });
}

function calculatePasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        digit: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    if (score < 2) return { level: 'weak', text: 'Weak', color: '#E74C3C' };
    if (score < 4) return { level: 'medium', text: 'Medium', color: '#F39C12' };
    return { level: 'strong', text: 'Strong', color: '#27AE60' };
}

function updatePasswordStrengthDisplay(el, { level, text, color }) {
    if (!el) return;
    const width = level === 'weak' ? '33%' : level === 'medium' ? '66%' : '100%';

    el.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 4px; background: #E5E7EB; border-radius: 2px;">
                <div style="height: 100%; width: ${width}; background: ${color}; border-radius: 2px; transition: width 0.3s ease;"></div>
            </div>
            <span style="font-size: 0.75rem; color: ${color}; font-weight: 500;">${text}</span>
        </div>
    `;
}

// =================== UTILITIES =================== //
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field?.nextElementSibling?.querySelector('i');
    if (!field || !icon) return;

    const isHidden = field.type === 'password';
    field.type = isHidden ? 'text' : 'password';
    icon.classList.toggle('fa-eye', !isHidden);
    icon.classList.toggle('fa-eye-slash', isHidden);
}

function goBack() {
    ['userTypeSelection', 'selectedType', 'registerForm', 'authDivider', 'socialLogin']
        .map(id => document.getElementById(id))
        .forEach(el => el && (el.style.display = id === 'userTypeSelection' ? 'block' : 'none'));

    document.querySelectorAll('.user-type-option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById('registerForm')?.reset();
}

function generateId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function showNotification(message, type = 'info') {
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    const colorMap = {
        success: '#27AE60',
        error: '#E74C3C',
        warning: '#F39C12',
        info: '#3498DB'
    };

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconMap[type] || 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: colorMap[type],
        color: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        zIndex: 10000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideIn 0.3s ease'
    });

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Inject styles once
(function injectNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        .notification-close { background: none; border: none; color: inherit; cursor: pointer; opacity: 0.8; transition: 0.2s ease; }
        .notification-close:hover { opacity: 1; background: rgba(255,255,255,0.1); }
    `;
    document.head.appendChild(style);
})();

// Expose selected functions globally
window.JobGenie = {
    togglePassword,
    searchJobs,
    showNotification,
    goBack
};
