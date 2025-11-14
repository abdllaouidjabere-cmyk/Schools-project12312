// عناصر DOM
const loginForm = document.getElementById('loginForm');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const forgotPassword = document.getElementById('forgotPassword');
const contactSupport = document.getElementById('contactSupport');
const messageDiv = document.getElementById('message');

// إظهار/إخفاء كلمة السر
togglePassword.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.classList.remove('fa-eye-slash');
        togglePassword.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        togglePassword.classList.remove('fa-eye');
        togglePassword.classList.add('fa-eye-slash');
    }
});

// التحقق من صحة رقم الجوال
function validatePhone(phone) {
    const phoneRegex = /^05\d{8}$/;
    return phoneRegex.test(phone);
}

// عرض الرسالة
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// معالجة تسجيل الدخول
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!phone || !password) {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showMessage('يرجى إدخال رقم جوال صحيح (مثال: 0512345678)', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('كلمة السر يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    showMessage('جاري تسجيل الدخول...', 'success');
    
    setTimeout(() => {
        showMessage('مرحباً بك! تم تسجيل الدخول بنجاح', 'success');
    }, 1500);
});

// معالجة نسيان كلمة السر
forgotPassword.addEventListener('click', function(e) {
    e.preventDefault();
    showMessage('سيتم إرسال رابط إعادة تعيين كلمة السر إلى بريدك الإلكتروني', 'success');
});

// معالجة التواصل مع الدعم
contactSupport.addEventListener('click', function(e) {
    e.preventDefault();
    showMessage('يرجى التواصل مع الدعم الفني على الرقم: 8001234567', 'success');
});