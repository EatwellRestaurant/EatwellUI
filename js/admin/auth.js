$(document).ready(function() {
    // Toast container'ı oluştur
    $('body').append('<div class="toast-container"></div>');

    // Toast gösterme fonksiyonu
    function showToast(type, title, message) {
        const icon = type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check';
        const toast = $(`
            <div class="toast ${type}">
                <i class="fa-solid ${icon}"></i>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
            </div>
        `);

        $('.toast-container').append(toast);

        // 5 saniye sonra toast'ı kaldır
        setTimeout(() => {
            toast.addClass('hide');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // Register form submit
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        const fullName = $('#fullName').val().trim();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();

        // Ad Soyad ayrıştırma
        const nameParts = fullName.split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        if (!firstName || !lastName) {
            showToast('error', 'Hata', 'Lütfen ad ve soyadınızı giriniz.');
            return;
        }

        // Şifre kontrolü
        if (password !== confirmPassword) {
            showToast('error', 'Hata', 'Şifreler eşleşmiyor!');
            return;
        }

        // API'ye kayıt isteği gönder
        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/auths/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }),
            success: function(response) {
                showToast('success', 'Başarılı', 'Kayıt işlemi başarılı! Lütfen e-posta adresinizi doğrulayın.');
                localStorage.setItem('pendingVerificationEmail', email);
                localStorage.setItem('userId', response.dataId);
                setTimeout(() => {
                    window.location.href = 'verify-email.html';
                }, 1500);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message || 'Kayıt sırasında bir hata oluştu';
                showToast('error', 'Hata', errorMessage);
            }
        });
    });

    // Login form submit
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();
        const password = $('#password').val();
        const remember = $('#remember').is(':checked');

        // API'ye giriş isteği gönder
        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/auths/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                email: email,
                password: password
            }),
            success: function(response) {
                // Token'ı localStorage'a kaydet
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Remember me seçiliyse token'ı uzun süreli sakla
                if (remember) {
                    localStorage.setItem('remember', 'true');
                }

                showToast('success', 'Başarılı', 'Giriş başarıyla tamamlandı!');
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 1500);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message || 'Giriş sırasında bir hata oluştu';
                showToast('error', 'Hata', errorMessage);
            }
        });
    });

    // Form validasyonları
    $('input[type="email"]').on('input', function() {
        const email = $(this).val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    $('input[type="password"]').on('input', function() {
        const password = $(this).val();
        
        if (password.length < 6) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    // Şifre göster/gizle fonksiyonu
    $('.toggle-password').click(function() {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        
        // İkon değiştirme (tersine çevrildi)
        $(this).toggleClass('fa-eye');
    });
}); 