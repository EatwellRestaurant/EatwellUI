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

    // Token kontrolü
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    
    if (!token) {
        window.location.href = 'admin-login.html';
        return;
    }

    try {
        // Token'ı decode et
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // Role bilgisini al
        const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        // Eğer kullanıcının yetkisi admin değilse
        if (userRole !== 'Admin') {
            localStorage.removeItem('token');
            window.location.href = 'admin-login.html';
            return;
        }

        // Kullanıcı adını göster
        $('#userNameDisplay').text(userName);

        // Admin içeriğini göster
        $('#adminContent').show();
    } catch (error) {
        console.error('Token decode hatası:', error);
        localStorage.removeItem('token');
        window.location.href = 'admin-login.html';
    }

    // Çıkış yap butonuna tıklandığında
    $('#logoutBtn').click(function(e) {
        e.preventDefault();
        showToast('success', 'Başarılı', 'Çıkış işlemi başarıyla tamamlandı!');
        
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('adminRemembered');
            window.location.href = 'admin-login.html';
        }, 1500);
    });

    // Geri tuşuna basıldığında veya sayfa kapatıldığında token'ı sil
    window.onbeforeunload = function() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('adminRemembered');
    };

    // Sidebar toggle işlemleri
    $(".nav").click(function(){
        $("#mySidenav").css('width','70px');
        $("#main").css('margin-left','70px');
        $(".logo").css('visibility', 'hidden');
        $(".logo span").css('visibility', 'visible');
        $(".logo span").css('margin-left', '-10px');
        $(".icon-a").css('visibility', 'hidden');
        $(".icons").css('visibility', 'visible');
        $(".icons").css('margin-left', '-8px');
        $(".nav").css('display','none');
        $(".nav2").css('display','block');
    });

    $(".nav2").click(function(){
        $("#mySidenav").css('width','300px');
        $("#main").css('margin-left','300px');
        $(".logo").css('visibility', 'visible');
        $(".icon-a").css('visibility', 'visible');
        $(".icons").css('visibility', 'visible');
        $(".nav").css('display','block');
        $(".nav2").css('display','none');
    });
}); 