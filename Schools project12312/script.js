// بيانات التطبيق
const appData = {
    students: [],
    guardians: [],
    cashiers: [],
    users: [],
    maxStudents: 5000,
    maxGuardians: 2000,
    maxCashiers: 30,
    maxUsers: 100,
    resetCode: null,
    resetPhone: null
};

// التحقق من حالة تسجيل الدخول
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
}

// إظهار صفحة تسجيل الدخول
function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// إظهار لوحة التحكم
function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    updateStats();
    updateStudentsTable();
    updateStudentsManagementTable();
    updateGuardiansTable();
    updateCashiersTable();
    updateUsersTable();
}

// تحديث الإحصائيات
function updateStats() {
    document.getElementById('studentCount').textContent = appData.students.length;
    document.getElementById('guardianCount').textContent = appData.guardians.length;
    document.getElementById('cashierCount').textContent = appData.cashiers.length;
}

// تحديث جدول الطلاب في الرئيسية
function updateStudentsTable() {
    const studentsTable = document.getElementById('studentsTable');
    if (appData.students.length === 0) {
        studentsTable.innerHTML = '<tr class="empty-table"><td colspan="6">لا توجد بيانات للعرض</td></tr>';
        return;
    }
    
    let tableHTML = '';
    appData.students.forEach((student) => {
        tableHTML += `
            <tr>
                <td>${student.firstName} ${student.secondName} ${student.thirdName} ${student.lastName}</td>
                <td>${student.educationLevel}</td>
                <td>${student.guardian.firstName} ${student.guardian.secondName} ${student.guardian.lastName}</td>
                <td>${student.class}</td>
                <td>${student.balance} ريال</td>
                <td>${student.guardian.phone}</td>
            </tr>
        `;
    });
    
    studentsTable.innerHTML = tableHTML;
}

// تحديث جدول إدارة الطلاب
function updateStudentsManagementTable() {
    const studentsTable = document.getElementById('studentsManagementTable');
    if (appData.students.length === 0) {
        studentsTable.innerHTML = '<tr class="empty-table"><td colspan="7">لا توجد بيانات للعرض</td></tr>';
        return;
    }
    
    let tableHTML = '';
    appData.students.forEach((student, index) => {
        tableHTML += `
            <tr>
                <td>${student.firstName} ${student.secondName} ${student.thirdName} ${student.lastName}</td>
                <td>${student.educationLevel}</td>
                <td>${student.class}</td>
                <td>${student.guardian.firstName} ${student.guardian.secondName} ${student.guardian.lastName}</td>
                <td>${student.guardian.phone}</td>
                <td>${student.balance} ريال</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn delete-btn" data-index="${index}">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    studentsTable.innerHTML = tableHTML;
    
    // إضافة أحداث الحذف
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteStudent(index);
        });
    });
    
    // إضافة أحداث البحث
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterStudents(this.value);
        });
    }
}

// تحديث جدول أولياء الأمور
function updateGuardiansTable() {
    const guardiansTable = document.getElementById('guardiansTable');
    if (appData.guardians.length === 0) {
        guardiansTable.innerHTML = '<tr class="empty-table"><td colspan="4">لا توجد بيانات للعرض</td></tr>';
        return;
    }
    
    let tableHTML = '';
    appData.guardians.forEach((guardian, index) => {
        // حساب إجمالي الرصيد للطلاب المرتبطين بهذا ولي الأمر
        const totalBalance = appData.students
            .filter(student => student.guardian.id === guardian.id)
            .reduce((total, student) => total + student.balance, 0);
        
        tableHTML += `
            <tr>
                <td>${guardian.firstName} ${guardian.secondName} ${guardian.lastName}</td>
                <td>${totalBalance} ريال</td>
                <td>${guardian.phone}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn delete-btn" data-index="${index}">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    guardiansTable.innerHTML = tableHTML;
    
    // إضافة أحداث الحذف لأولياء الأمور
    document.querySelectorAll('#guardiansTable .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteGuardian(index);
        });
    });
    
    // إضافة أحداث البحث لأولياء الأمور
    const searchInput = document.getElementById('guardianSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterGuardians(this.value);
        });
    }
}

// تحديث جدول الكاشير
function updateCashiersTable() {
    const cashiersTable = document.getElementById('cashiersTable');
    if (appData.cashiers.length === 0) {
        cashiersTable.innerHTML = '<tr class="empty-table"><td colspan="5">لا توجد بيانات للعرض</td></tr>';
        return;
    }
    
    let tableHTML = '';
    appData.cashiers.forEach((cashier, index) => {
        // تحديد نص الجنس بناءً على القيمة
        const genderText = cashier.gender === 'ذكر' ? 'بني' : 'بنات';
        
        tableHTML += `
            <tr>
                <td>${cashier.firstName} ${cashier.secondName} ${cashier.lastName}</td>
                <td>${cashier.phone}</td>
                <td>${cashier.educationLevel}</td>
                <td>${genderText}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn delete-btn" data-index="${index}">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    cashiersTable.innerHTML = tableHTML;
    
    // إضافة أحداث الحذف للكاشير
    document.querySelectorAll('#cashiersTable .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteCashier(index);
        });
    });
    
    // إضافة أحداث البحث للكاشير
    const searchInput = document.getElementById('cashierSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCashiers(this.value);
        });
    }
}

// تحديث جدول المستخدمين
function updateUsersTable() {
    const usersTable = document.getElementById('usersTable');
    if (appData.users.length === 0) {
        usersTable.innerHTML = '<tr class="empty-table"><td colspan="4">لا توجد بيانات للعرض</td></tr>';
        return;
    }
    
    let tableHTML = '';
    appData.users.forEach((user, index) => {
        tableHTML += `
            <tr>
                <td>${user.firstName} ${user.secondName} ${user.lastName}</td>
                <td>${user.position}</td>
                <td>${user.phone}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn delete-btn" data-index="${index}">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    usersTable.innerHTML = tableHTML;
    
    // إضافة أحداث الحذف للمستخدمين
    document.querySelectorAll('#usersTable .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteUser(index);
        });
    });
    
    // إضافة أحداث البحث للمستخدمين
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
}

// تصفية الطلاب حسب البحث
function filterStudents(searchTerm) {
    const rows = document.querySelectorAll('#studentsManagementTable tr');
    rows.forEach(row => {
        if (row.classList.contains('empty-table')) return;
        
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// تصفية أولياء الأمور حسب البحث
function filterGuardians(searchTerm) {
    const rows = document.querySelectorAll('#guardiansTable tr');
    rows.forEach(row => {
        if (row.classList.contains('empty-table')) return;
        
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// تصفية الكاشير حسب البحث
function filterCashiers(searchTerm) {
    const rows = document.querySelectorAll('#cashiersTable tr');
    rows.forEach(row => {
        if (row.classList.contains('empty-table')) return;
        
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// تصفية المستخدمين حسب البحث
function filterUsers(searchTerm) {
    const rows = document.querySelectorAll('#usersTable tr');
    rows.forEach(row => {
        if (row.classList.contains('empty-table')) return;
        
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// حذف طالب
function deleteStudent(index) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        appData.students.splice(index, 1);
        updateStats();
        updateStudentsTable();
        updateStudentsManagementTable();
        updateGuardiansTable();
        showNotification('تم حذف الطالب بنجاح', 'success');
    }
}

// حذف ولي أمر
function deleteGuardian(index) {
    // التحقق مما إذا كان ولي الأمر مرتبطاً بأي طالب
    const guardian = appData.guardians[index];
    const hasStudents = appData.students.some(student => student.guardian.id === guardian.id);
    
    if (hasStudents) {
        showNotification('لا يمكن حذف ولي الأمر لأنه مرتبط بطلاب في النظام', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف ولي الأمر هذا؟')) {
        appData.guardians.splice(index, 1);
        updateStats();
        updateGuardiansTable();
        showNotification('تم حذف ولي الأمر بنجاح', 'success');
    }
}

// حذف كاشير
function deleteCashier(index) {
    if (confirm('هل أنت متأكد من حذف هذا الكاشير؟')) {
        appData.cashiers.splice(index, 1);
        updateStats();
        updateCashiersTable();
        showNotification('تم حذف الكاشير بنجاح', 'success');
    }
}

// حذف مستخدم
function deleteUser(index) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        appData.users.splice(index, 1);
        updateUsersTable();
        showNotification('تم حذف المستخدم بنجاح', 'success');
    }
}

// إضافة طالب جديد
function addStudent(studentData) {
    if (appData.students.length >= appData.maxStudents) {
        showNotification('لا يمكن إضافة المزيد من الطلاب. الحد الأقصى هو ' + appData.maxStudents + ' طالب', 'error');
        return false;
    }
    
    if (appData.guardians.length >= appData.maxGuardians) {
        showNotification('لا يمكن إضافة المزيد من أولياء الأمور. الحد الأقصى هو ' + appData.maxGuardians + ' ولي أمر', 'error');
        return false;
    }
    
    const guardian = {
        id: Date.now(),
        firstName: studentData.guardianFirstName,
        secondName: studentData.guardianSecondName,
        lastName: studentData.guardianLastName,
        phone: studentData.guardianPhone,
        password: studentData.guardianPassword
    };
    
    appData.guardians.push(guardian);
    
    const student = {
        id: Date.now() + 1,
        firstName: studentData.firstName,
        secondName: studentData.secondName,
        thirdName: studentData.thirdName,
        lastName: studentData.lastName,
        educationLevel: studentData.educationLevel,
        class: studentData.class,
        balance: 0,
        guardian: guardian
    };
    
    appData.students.push(student);
    
    updateStats();
    updateStudentsTable();
    updateStudentsManagementTable();
    updateGuardiansTable();
    return true;
}

// إضافة كاشير جديد
function addCashier(cashierData) {
    if (appData.cashiers.length >= appData.maxCashiers) {
        showNotification('لا يمكن إضافة المزيد من الكاشير. الحد الأقصى هو ' + appData.maxCashiers + ' كاشير', 'error');
        return false;
    }
    
    const cashier = {
        id: Date.now(),
        firstName: cashierData.firstName,
        secondName: cashierData.secondName,
        lastName: cashierData.lastName,
        phone: cashierData.phone,
        password: cashierData.password,
        educationLevel: cashierData.educationLevel,
        gender: cashierData.gender
    };
    
    appData.cashiers.push(cashier);
    
    updateStats();
    updateCashiersTable();
    return true;
}

// إضافة مستخدم جديد
function addUser(userData) {
    if (appData.users.length >= appData.maxUsers) {
        showNotification('لا يمكن إضافة المزيد من المستخدمين. الحد الأقصى هو ' + appData.maxUsers + ' مستخدم', 'error');
        return false;
    }
    
    const user = {
        id: Date.now(),
        firstName: userData.firstName,
        secondName: userData.secondName,
        lastName: userData.lastName,
        position: userData.position,
        phone: userData.phone,
        password: userData.password
    };
    
    appData.users.push(user);
    
    updateUsersTable();
    return true;
}

// تغيير الخطوة في نموذج تغيير كلمة المرور
function changeStep(currentStep, nextStep) {
    // إخفاء جميع الخطوات
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // إظهار الخطوة المطلوبة
    document.getElementById(`step${nextStep}`).classList.add('active');
    
    // تحديث مؤشر الخطوات
    document.querySelectorAll('.step-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.step) <= nextStep) {
            item.classList.add('active');
        }
    });
}

// تبديل الأقسام
function switchSection(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار القسم المطلوب
    document.getElementById(sectionId).classList.add('active');
    
    // تحديث القائمة الجانبية
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`.menu-link[data-section="${sectionId.split('-')[0]}"]`).classList.add('active');
}

// إظهار إشعار
function showNotification(message, type = 'success') {
    const notificationArea = document.getElementById('notificationArea');
    const notificationId = 'notification-' + Date.now();
    
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    notificationArea.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // إغلاق الإشعار عند النقر على الزر
    notification.querySelector('.close-notification').addEventListener('click', () => {
        closeNotification(notificationId);
    });
    
    // إغلاق الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        closeNotification(notificationId);
    }, 5000);
}

// إغلاق الإشعار
function closeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// إعداد التطبيق
function init() {
    checkLoginStatus();
    
    // إعداد أحداث تسجيل الدخول
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        
        const phoneRegex = /^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        if (!phoneRegex.test(phone)) {
            showNotification('يرجى إدخال رقم جوال صحيح (مثال: 0512345678)', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('كلمة السر يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        const loginButton = document.querySelector('.login-button');
        const originalText = loginButton.textContent;
        loginButton.innerHTML = 'جاري التسجيل... <span class="loading"></span>';
        loginButton.disabled = true;
        
        setTimeout(function() {
            localStorage.setItem('isLoggedIn', 'true');
            showDashboard();
            loginButton.innerHTML = originalText;
            loginButton.disabled = false;
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
        }, 1500);
    });
    
    // نسيت كلمة السر - فتح النموذج
    document.getElementById('forgotPasswordLink').addEventListener('click', function() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('forgotPasswordContainer').style.display = 'block';
        
        // إعادة تعيين النموذج
        document.getElementById('phoneForm').reset();
        changeStep(1, 1);
    });
    
    // إلغاء تغيير كلمة المرور
    document.getElementById('cancelChangePassword').addEventListener('click', function() {
        document.getElementById('forgotPasswordContainer').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    });
    
    // الخطوة 1: إدخال رقم الجوال
    document.getElementById('phoneForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('resetPhone').value;
        const phoneRegex = /^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        
        if (!phoneRegex.test(phone)) {
            showNotification('يرجى إدخال رقم جوال صحيح (مثال: 0512345678)', 'error');
            return;
        }
        
        appData.resetPhone = phone;
        
        // الانتقال إلى الخطوة التالية مباشرة (تغيير كلمة المرور)
        changeStep(1, 2);
    });
    
    // الخطوة 2: تغيير كلمة المرور
    document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showNotification('كلمات المرور غير متطابقة. يرجى التأكد من تطابق كلمة المرور وتأكيدها.', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        // في التطبيق الحقيقي، هنا سيتم تغيير كلمة المرور في قاعدة البيانات
        showNotification('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.', 'success');
        
        // العودة إلى صفحة تسجيل الدخول
        document.getElementById('forgotPasswordContainer').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    });
    
    // زر الرجوع للخطوات السابقة
    document.querySelectorAll('.back-step').forEach(button => {
        button.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            changeStep(step + 1, step);
        });
    });
    
    // إعداد إظهار/إخفاء كلمة السر (لصفحة تسجيل الدخول فقط)
    document.querySelectorAll('#passwordToggle, #newPasswordToggle, #confirmPasswordToggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
    
    // إعداد أحداث القائمة الجانبية
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(`${section}-section`);
        });
    });
    
    // إعداد أحداث لوحة التحكم
    document.getElementById('addStudentBtn').addEventListener('click', function() {
        document.getElementById('addStudentModal').style.display = 'flex';
    });
    
    document.getElementById('addStudentFromStudentsBtn').addEventListener('click', function() {
        document.getElementById('addStudentModal').style.display = 'flex';
    });
    
    document.getElementById('addCashierBtn').addEventListener('click', function() {
        document.getElementById('addCashierModal').style.display = 'flex';
    });
    
    // زر إضافة كاشير من قسم الكاشير
    document.getElementById('addCashierFromCashiersBtn').addEventListener('click', function() {
        document.getElementById('addCashierModal').style.display = 'flex';
    });
    
    // زر إضافة مستخدم جديد
    document.getElementById('addUserBtn').addEventListener('click', function() {
        document.getElementById('addUserModal').style.display = 'flex';
    });
    
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            secondName: document.getElementById('secondName').value,
            thirdName: document.getElementById('thirdName').value,
            lastName: document.getElementById('lastName').value,
            educationLevel: document.getElementById('educationLevel').value,
            class: document.getElementById('class').value,
            guardianFirstName: document.getElementById('guardianFirstName').value,
            guardianSecondName: document.getElementById('guardianSecondName').value,
            guardianLastName: document.getElementById('guardianLastName').value,
            guardianPhone: document.getElementById('guardianPhone').value,
            guardianPassword: document.getElementById('guardianPassword').value
        };
        
        if (!formData.firstName || !formData.secondName || !formData.thirdName || !formData.lastName || 
            !formData.educationLevel || !formData.class || !formData.guardianFirstName || 
            !formData.guardianSecondName || !formData.guardianLastName || !formData.guardianPhone || 
            !formData.guardianPassword) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        const phoneRegex = /^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        if (!phoneRegex.test(formData.guardianPhone)) {
            showNotification('يرجى إدخال رقم جوال صحيح (مثال: 0512345678)', 'error');
            return;
        }
        
        if (addStudent(formData)) {
            document.getElementById('addStudentModal').style.display = 'none';
            document.getElementById('successTitle').textContent = 'تم إضافة طالب جديد بنجاح!';
            document.getElementById('successMessage').textContent = 'تمت إضافة الطالب إلى النظام بنجاح';
            document.getElementById('successModal').style.display = 'flex';
            document.getElementById('addStudentForm').reset();
            document.getElementById('class').innerHTML = '<option value="">اختر الصف</option>';
            showNotification('تم إضافة الطالب بنجاح!', 'success');
        }
    });
    
    document.getElementById('addCashierForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('cashierFirstName').value,
            secondName: document.getElementById('cashierSecondName').value,
            lastName: document.getElementById('cashierLastName').value,
            phone: document.getElementById('cashierPhone').value,
            password: document.getElementById('cashierPassword').value,
            educationLevel: document.getElementById('cashierEducationLevel').value,
            gender: document.getElementById('cashierGender').value
        };
        
        if (!formData.firstName || !formData.secondName || !formData.lastName || 
            !formData.phone || !formData.password || !formData.educationLevel || !formData.gender) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        const phoneRegex = /^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        if (!phoneRegex.test(formData.phone)) {
            showNotification('يرجى إدخال رقم جوال صحيح (مثال: 0512345678)', 'error');
            return;
        }
        
        if (formData.password.length < 6) {
            showNotification('كلمة السر يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        if (addCashier(formData)) {
            document.getElementById('addCashierModal').style.display = 'none';
            document.getElementById('successTitle').textContent = 'تـم إضافة كاشير جديد بنجاح!';
            document.getElementById('successMessage').textContent = 'تمت إضافة الكاشير إلى النظام بنجاح';
            document.getElementById('successModal').style.display = 'flex';
            document.getElementById('addCashierForm').reset();
            showNotification('تـم إضافة كاشير جديد بنجاح!', 'success');
        }
    });
    
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('userFirstName').value,
            secondName: document.getElementById('userSecondName').value,
            lastName: document.getElementById('userLastName').value,
            position: document.getElementById('userPosition').value,
            phone: document.getElementById('userPhone').value,
            password: document.getElementById('userPassword').value
        };
        
        if (!formData.firstName || !formData.secondName || !formData.lastName || 
            !formData.position || !formData.phone || !formData.password) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        const phoneRegex = /^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        if (!phoneRegex.test(formData.phone)) {
            showNotification('يرجى إدخال رقم جوال صحيح (مثال: 0512345678)', 'error');
            return;
        }
        
        if (formData.password.length < 6) {
            showNotification('كلمة السر يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }
        
        if (addUser(formData)) {
            document.getElementById('addUserModal').style.display = 'none';
            document.getElementById('successTitle').textContent = 'تم إضافة مستخدم جديد بنجاح!';
            document.getElementById('successModal').style.display = 'flex';
            document.getElementById('addUserForm').reset();
            showNotification('تم إضافة مستخدم جديد بنجاح!', 'success');
        }
    });
    
    document.getElementById('successOkBtn').addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
    });
    
    // زر تسجيل الخروج
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('isLoggedIn');
            showLogin();
            showNotification('تم تسجيل الخروج بنجاح', 'success');
        }
    });
    
    // زر الدعم الفني (بدون إشعار)
    document.getElementById('technicalSupportLink').addEventListener('click', function(e) {
        e.preventDefault();
        // تم إزالة الإشعار كما طلبت
    });
    
    document.getElementById('technicalSupportDashboardLink').addEventListener('click', function(e) {
        e.preventDefault();
        // تم إزالة الإشعار كما طلبت
    });
    
    // إعداد المراحل الدراسية
    document.getElementById('educationLevel').addEventListener('change', function() {
        const level = this.value;
        const classSelect = document.getElementById('class');
        classSelect.innerHTML = '<option value="">اختر الصف</option>';
        
        if (level === 'ابتدائي') {
            for (let i = 1; i <= 6; i++) {
                classSelect.innerHTML += `<option value="الصف ${i}">الصف ${i}</option>`;
            }
        } else if (level === 'متوسط' || level === 'ثانوي') {
            for (let i = 1; i <= 3; i++) {
                classSelect.innerHTML += `<option value="الصف ${i}">الصف ${i}</option>`;
            }
        }
    });
    
    // إغلاق النوافذ المنبثقة
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
}

// تشغيل التطبيق
document.addEventListener('DOMContentLoaded', init);
