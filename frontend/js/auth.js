// ============================================
// MODULE 2 & 3: AUTH LOGIC (Login & Registration)
// ============================================

// ===== ROLE TAB SWITCHING =====
document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// ===== PASSWORD TOGGLE =====
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bx-hide', 'bx-show');
    } else {
        input.type = 'password';
        icon.classList.replace('bx-show', 'bx-hide');
    }
}

// ===== LOGIN HANDLER =====
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const activeRole = document.querySelector('.role-tab.active');
    const role = activeRole ? activeRole.dataset.role : 'alumni';

    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Simulate login (static mode)
    const btn = e.target.querySelector('.btn-submit');
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Signing in...';
    btn.disabled = true;

    setTimeout(() => {
        // Store mock session
        localStorage.setItem('alumni_portal_user', JSON.stringify({
            email: email,
            role: role,
            name: role === 'admin' ? 'Admin User' : 'Alumni User',
            loggedIn: true
        }));

        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}

// ===== MULTI-STEP REGISTRATION =====
let currentStep = 1;

function nextStep(step) {
    document.getElementById(`step${currentStep}`).style.display = 'none';
    document.getElementById(`step${step}`).style.display = 'block';
    updateProgress(step);
    currentStep = step;
    // Scroll to top of form
    document.querySelector('.auth-form-panel').scrollTop = 0;
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).style.display = 'none';
    document.getElementById(`step${step}`).style.display = 'block';
    updateProgress(step);
    currentStep = step;
    document.querySelector('.auth-form-panel').scrollTop = 0;
}

function updateProgress(activeStep) {
    const steps = document.querySelectorAll('.reg-step');
    const lines = document.querySelectorAll('.step-line');

    steps.forEach((s, i) => {
        const stepNum = i + 1;
        s.classList.remove('active', 'completed');
        if (stepNum < activeStep) {
            s.classList.add('completed');
        } else if (stepNum === activeStep) {
            s.classList.add('active');
        }
    });

    lines.forEach((line, i) => {
        line.classList.remove('active', 'completed');
        if (i + 1 < activeStep - 1) {
            line.classList.add('completed');
        } else if (i + 1 === activeStep - 1) {
            line.classList.add('active');
        }
    });
}

// ===== REGISTRATION HANDLER =====
function handleRegistration(e) {
    e.preventDefault();

    const password = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('regConfirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Creating Account...';
    btn.disabled = true;

    setTimeout(() => {
        showToast('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 2000);
}

// ===== PHOTO PREVIEW =====
function previewPhoto(input) {
    const preview = document.getElementById('photoPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class='bx ${type === 'success' ? 'bx-check-circle' : type === 'error' ? 'bx-error-circle' : 'bx-info-circle'}'></i>
        <span>${message}</span>
    `;

    // Toast styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '14px 24px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: "'Outfit', sans-serif",
        zIndex: '9999',
        animation: 'slideInRight 0.4s ease forwards',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: '#fff'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
