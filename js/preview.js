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

    try {
        // Token'ı decode et
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // Role bilgisini al
        const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        // Eğer kullanıcının yetkisi admin değilse
        if (userRole !== 'Admin') {
            localStorage.removeItem('token');

            window.location.href = '../admin-login.html';
            return;
        }

    } catch (error) {
        console.error('Token decode hatası:', error);

        localStorage.removeItem('token');

        window.location.href = '../admin-login.html';
    }



    // Resim seçildiğinde önizleme gösterme (Anasaydaki ilk karşılama resmi için)
    $(document).on('change', '#homeImage', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // FileReader ile dosyayı okuyoruz
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Önizleme resmini güncelliyoruz
                $('#previewHomeImage').css('background-image', `url(${e.target.result})`);
            }
            
            // Dosyayı base64 formatında okuyoruz    
            reader.readAsDataURL(file); 
        }
    });



    // Resim seçildiğinde önizleme gösterme (Anasaydaki hakkımızda resmi için)
    $(document).on('change', '#aboutImage', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // FileReader ile dosyayı okuyoruz
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Önizleme resmini güncelliyoruz
                $('#previewAboutImage').attr('src', e.target.result);
            }
            
            // Dosyayı base64 formatında okuyoruz    
            reader.readAsDataURL(file); 
        }
    });



    // Resim seçildiğinde önizleme gösterme (Anasaydaki menü resmi için)
    $(document).on('change', '#menuImage', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // FileReader ile dosyayı okuyoruz
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Önizleme resmini güncelliyoruz
                $('#previewMenuImage').css('background-image', `url(${e.target.result})`);
            }
            
            // Dosyayı base64 formatında okuyoruz    
            reader.readAsDataURL(file); 
        }
    });

});


