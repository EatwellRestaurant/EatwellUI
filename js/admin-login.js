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

    // Admin login form submit
    $('#adminLoginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#adminEmail').val();
        const password = $('#adminPassword').val();
        const rememberMe = $('#rememberMe').is(':checked');

        // API'ye giriş isteği gönder
        $.ajax({
            url: 'http://eatwellrestaurantapi.somee.com/api/auths/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                email: username,
                password: password
            }),
            success: function(response) {
                // Token'ı localStorage'a kaydet
                localStorage.setItem('token', response.data.token);

                // Token'ı decode et ve yetki bilgisini kontrol et
                const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
                
                // Role ve kullanıcı adı bilgisini al
                const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                const encodedUserName = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
                
                // Türkçe karakterleri düzgün şekilde decode et
                const decodedUserName = decodeURIComponent(escape(encodedUserName));
                
                // Eğer kullanıcının yetkisi admin ise
                if (userRole === 'Admin') {
                    if (rememberMe) {
                        localStorage.setItem('adminRemembered', 'true');
                    }
                    localStorage.setItem('userName', decodedUserName);
                    
                    showToast('success', 'Başarılı', 'Admin paneline giriş yapılıyor...');
                    setTimeout(() => {
                        window.location.href = 'admin-panel.html';
                    }, 2000);
                } else {
                    // Admin yetkisi yoksa
                    localStorage.removeItem('token');
                    showToast('error', 'Hata', 'Bu sayfaya erişim yetkiniz bulunmamaktadır!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message || 'Giriş sırasında bir hata oluştu';
                showToast('error', 'Hata', errorMessage);
            }
        });
    });

    
    // Şifre göster/gizle fonksiyonu
    $('.toggle-password').click(function() {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        
        // İkon değiştirme
        $(this).toggleClass('fa-eye-slash fa-eye');
    });

    // Eğer daha önce "Beni hatırla" seçilmişse
    if (localStorage.getItem('adminRemembered') === 'true') {
        $('#rememberMe').prop('checked', true);
    }
}); 