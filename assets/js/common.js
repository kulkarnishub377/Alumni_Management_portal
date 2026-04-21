// ============================================
// COMMON UTILITIES (Shared across all pages)
// ============================================

// ===== TOAST NOTIFICATION =====
window.showToast = function(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    const icons = { success: 'bx-check-circle', error: 'bx-error-circle', info: 'bx-info-circle', warning: 'bx-error' };
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
    toast.innerHTML = `<i class='bx ${icons[type] || icons.info}'></i><span>${message}</span>`;
    Object.assign(toast.style, {
        position: 'fixed', bottom: '24px', right: '24px', padding: '14px 24px',
        borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
        fontSize: '14px', fontWeight: '600', fontFamily: "'Outfit', sans-serif",
        zIndex: '9999', animation: 'slideInRight 0.4s ease forwards',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        background: colors[type] || colors.info, color: '#fff'
    });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ===== MODAL =====
window.openModal = function(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('active'); m.style.display = 'flex'; }
}
window.closeModal = function(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('active'); setTimeout(() => m.style.display = 'none', 300); }
}

// ===== FORMAT DATE =====
window.formatDate = function(dateStr) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date(dateStr);
    return { day: String(d.getDate()).padStart(2,'0'), month: months[d.getMonth()], year: d.getFullYear(), full: d };
}

// ===== ANIMATE COUNTER =====
window.animateCounter = function(el, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 25);
}

// ===== LOCAL STORAGE HELPERS =====
window.getUser = function() {
    try { 
        let user = JSON.parse(localStorage.getItem('user_info'));
        if (user) return { ...user, loggedIn: true };
        return JSON.parse(localStorage.getItem('alumni_portal_user')) || null;
    }
    catch { return null; }
}
window.setUser = function(data) { localStorage.setItem('alumni_portal_user', JSON.stringify(data)); }
window.clearUser = function() { 
    localStorage.removeItem('alumni_portal_user'); 
    localStorage.removeItem('user_info');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

// ===== SCROLL TO TOP =====
function initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 600));
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

// ===== PRELOADER =====
function initPreloader() {
    const p = document.getElementById('preloader');
    if (p) {
        window.addEventListener('load', () => setTimeout(() => p.classList.add('hidden'), 600));
        setTimeout(() => p.classList.add('hidden'), 2500);
    }
}
