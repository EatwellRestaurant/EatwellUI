$(document).ready(function() {
    // Toast container'ı oluştur
    $('body').append('<div class="toast-container"></div>');

    // Toast gösterme fonksiyonu
    function showToast(type, title, message) {
        const iconMap = {
            error: 'fa-circle-xmark',
            success: 'fa-circle-check',
            info: 'fa-circle-info'
        };
        const icon = iconMap[type] || 'fa-circle-info';
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

    // Doğrulama kodu input'larının yönetimi
    $('.verification-input').on('input', function() {
        const value = $(this).val();
        const index = $(this).data('index');
        
        // Sadece sayı girişine izin ver
        if (!/^\d*$/.test(value)) {
            $(this).val('');
            return;
        }

        // Bir sonraki input'a geç
        if (value.length === 1 && index < 4) {
            $(`.verification-input[data-index="${index + 1}"]`).focus();
        }
    });

    // Geri silme işlemi
    $('.verification-input').on('keydown', function(e) {
        const index = $(this).data('index');
        
        if (e.key === 'Backspace' && $(this).val().length === 0 && index > 0) {
            $(`.verification-input[data-index="${index - 1}"]`).focus();
        }
    });

    // Form submit
    $('#verifyForm').on('submit', function(e) {
        e.preventDefault();
        
        // Doğrulama kodunu birleştir
        let verificationCode = '';
        $('.verification-input').each(function() {
            verificationCode += $(this).val();
        });

        // 5 haneli kod kontrolü
        if (verificationCode.length !== 5) {
            showToast('error', 'Hata', 'Lütfen 5 haneli doğrulama kodunu giriniz.');
            return;
        }

        // API'ye doğrulama isteği gönder
        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/auths/verifyEmailOfUser?userId=' + localStorage.getItem('userId'),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                verificationCode: verificationCode
            }),
            success: function(response) {
                showToast('success', 'Başarılı', 'E-posta adresiniz başarıyla doğrulandı!');
                localStorage.removeItem('pendingVerificationEmail');
                setTimeout(() => {
                    window.location.href = '../../index.html';
                }, 1500);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message || 'Doğrulama sırasında bir hata oluştu';
                showToast('error', 'Hata', errorMessage);
            }
        });
    });

    // Kodu tekrar gönder
    $('#resendCode').on('click', function() {
        const email = localStorage.getItem('pendingVerificationEmail');
        
        if (!email) {
            showToast('error', 'Hata', 'Email adresi bulunamadı');
            return;
        }

        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/auths/resend-verification',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                email: email
            }),
            success: function(response) {
                showToast('success', 'Başarılı', 'Yeni doğrulama kodu gönderildi!');
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message || 'Kod gönderilirken bir hata oluştu';
                showToast('error', 'Hata', errorMessage);
            }
        });
    });

    // Spam klasörü kontrolü
    $('#checkSpam').on('click', function() {
        showToast('info', 'Bilgi', 'Lütfen spam klasörünüzü kontrol edin.</br>Doğrulama kodu burada olabilir.');
    });
}); 