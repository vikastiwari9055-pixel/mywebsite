// Main JavaScript for FreeToolsHub
// Handles theme toggle, animations, shared utilities

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initSmoothScroll();
    initMobileMenu(); // Future enhancement
    initLoadingSpinners();
});

// Theme Management (Dark/Light Mode)
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (!toggleBtn) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.className = savedTheme;
    
    // Toggle icons
    const sunIcon = toggleBtn.querySelector('.fa-sun');
    const moonIcon = toggleBtn.querySelector('.fa-moon');
    
    if (savedTheme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
    
    // Toggle handler
    toggleBtn.addEventListener('click', function() {
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.className = newTheme;
        localStorage.setItem('theme', newTheme);
        
        // Update icons
        if (newTheme === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
        
        // Trigger animation
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu (placeholder for future hamburger)
function initMobileMenu() {
    // Implement if needed
}

// Loading spinners
function initLoadingSpinners() {
    // Show/hide spinners for async operations
    window.showSpinner = function(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = '<div class="flex items-center justify-center p-8"><i class="fas fa-spinner animate-spin text-2xl text-blue-500"></i></div>';
        }
    };
    
    window.hideSpinner = function(elementId, content = '') {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = content;
    };
}

// Copy to clipboard utility
window.copyToClipboard = async function(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!', 'success');
    }
};

// Toast notifications
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl text-white toast transition-all transform translate-x-full ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Download file utility
window.downloadFile = function(content, filename, mime = 'text/plain') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
};

// Form validation utility
window.validateEmail = function(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Export utilities for tool pages
window.FreeToolsHub = {
    copyToClipboard,
    downloadFile,
    showToast,
    showSpinner,
    hideSpinner,
    validateEmail
};

// Service Worker Registration (PWA ready)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

