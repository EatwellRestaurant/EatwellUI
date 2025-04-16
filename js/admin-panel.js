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
        // Sidebar daraltılmış halde ise genişlet, genişse daralt
        if ($("#mySidenav").width() == 70 || $("#mySidenav").width() == 0) {
            $("#mySidenav").css('width','300px');
            $("#main").css('margin-left','300px');
            $(".logo").css('visibility', 'visible');
            $(".icon-a").css('visibility', 'visible');
            $(".icons").css('visibility', 'visible');
            $(".nav").css('display','block');
            $(".nav2").css('display','none');
        } else {
            $("#mySidenav").css('width','70px');
            $("#main").css('margin-left','70px');
            $(".logo").css('visibility', 'hidden');
            $(".logo span").css('visibility', 'visible');
            $(".logo span").css('margin-left', '-10px');
            $(".icon-a").css('visibility', 'hidden');
            $(".icons").css('visibility', 'visible');
            $(".icons").css('margin-left', '-8px');
            $(".nav").css('display','block');
            $(".nav2").css('display','none');
        }
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
    
    // Responsive tasarım için mobil menü kontrolü
    function checkScreenSize() {
        if (window.innerWidth <= 992) {
            $("#mySidenav").css('width','0');
            $("#main").css('margin-left','0');
            $(".nav").css('display','block');
            $(".nav2").css('display','none');
            
            // Mobil menü açma/kapama
            $(".nav").off('click').on('click', function(){
                let targetWidth = '200px'; // Varsayılan mobil genişlik
                if (window.innerWidth <= 480) {
                    targetWidth = '200px'; // 480px altında da 250px olacak
                }
                
                if ($("#mySidenav").width() == 0) {
                    $("#mySidenav").css('width', targetWidth);
                    $("#mySidenav").addClass('active');
                    $(".logo").css('visibility', 'visible');
                    $(".icon-a").css('visibility', 'visible');
                    $(".icons").css('visibility', 'visible');
                    $(".nav").css('display','block');
                    $(".nav2").css('display','none');
                } else {
                    $("#mySidenav").css('width','0');
                    $("#mySidenav").removeClass('active');
                    $(".logo span").css('visibility', 'visible');
                    $(".logo span").css('margin-left', '-10px');
                    $(".icon-a").css('visibility', 'hidden');
                    $(".icons").css('visibility', 'visible');
                    $(".icons").css('margin-left', '-8px');
                    $(".nav").css('display','block');
                    $(".nav2").css('display','none');
                }
            });
            
            $(".nav2").off('click').on('click', function(){
                $("#mySidenav").css('width','0');
                $("#mySidenav").removeClass('active');
            });
        } else {
            // Normal davranışı geri yükle
            $(".nav").off('click').on('click', function(){
                // Sidebar daraltılmış halde ise genişlet, genişse daralt
                if ($("#mySidenav").width() == 70 || $("#mySidenav").width() == 0) {
                    $("#mySidenav").css('width','300px');
                    $("#main").css('margin-left','300px');
                    $(".logo").css('visibility', 'visible');
                    $(".icon-a").css('visibility', 'visible');
                    $(".icons").css('visibility', 'visible');
                    $(".nav").css('display','block');
                    $(".nav2").css('display','none');
                } else {
                    $("#mySidenav").css('width','70px');
                    $("#main").css('margin-left','70px');
                    $(".logo").css('visibility', 'hidden');
                    $(".logo span").css('visibility', 'visible');
                    $(".logo span").css('margin-left', '-10px');
                    $(".icon-a").css('visibility', 'hidden');
                    $(".icons").css('visibility', 'visible');
                    $(".icons").css('margin-left', '-8px');
                    $(".nav").css('display','block');
                    $(".nav2").css('display','none');
                }
            });

            $(".nav2").off('click').on('click', function(){
                $("#mySidenav").css('width','300px');
                $("#main").css('margin-left','300px');
                $(".logo").css('visibility', 'visible');
                $(".icon-a").css('visibility', 'visible');
                $(".icons").css('visibility', 'visible');
                $(".nav").css('display','block');
                $(".nav2").css('display','none');
            });
        }
    }
    
    // Sayfa yüklendiğinde ve ekran boyutu değiştiğinde kontrol et
    $(window).on('load resize', checkScreenSize);
    
    // Sayfa dışında herhangi bir yere tıklandığında mobil menüyü kapat
    $(document).on('click', function(e) {
        if (window.innerWidth <= 992 && 
            !$(e.target).closest('#mySidenav').length && 
            !$(e.target).closest('.nav').length &&
            $("#mySidenav").hasClass('active')) {
            $("#mySidenav").css('width','0');
            $("#mySidenav").removeClass('active');
        }
    });

    // İstatistikleri API'den al
    function getStatistics() {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: 'https://eatwellrestaurantapi.somee.com/api/dashboards',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // HTML elementlerini seçelim
                const userBox = $('.col-div-3:eq(0) .box p');
                const menuBox = $('.col-div-3:eq(1) .box p');
                const orderBox = $('.col-div-3:eq(2) .box p');
                const reservationBox = $('.col-div-3:eq(3) .box p');
                
                // İstatistikleri güncelle
                userBox.html(`${response.data.userCount}<br/><span>Kullanıcılar</span>`);
                menuBox.html(`${response.data.mealCategoryCount}<br/><span>Menüler</span>`);
                orderBox.html(`${response.data.orderCount}<br/><span>Siparişler</span>`);
                reservationBox.html(`${response.data.reservationCount}<br/><span>Rezervasyonlar</span>`);
            },
            error: function(xhr, status, error) {
                console.error('İstatistikler alınırken hata oluştu:', error);
                console.error('XHR Durumu:', xhr);
                showToast('error', 'Hata', 'İstatistikler alınırken bir hata oluştu!');
            }
        });
    }

    // Kullanıcılar listesini getir
    function getUsers() {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: 'https://eatwellrestaurantapi.somee.com/api/users/getall',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Kullanıcılar listesini oluştur
                let usersHTML = `
                <div class="users-modal">
                    <div class="users-modal-content">
                        <div class="users-modal-header">
                            <h2>Kullanıcılar Listesi</h2>
                            <span class="close-users-modal">&times;</span>
                        </div>
                        <div class="users-modal-body">
                            <table class="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Ad</th>
                                        <th>Soyad</th>
                                        <th>E-posta</th>
                                        <th>Kayıt Tarihi</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                
                if (response.data && response.data.length > 0) {
                    response.data.forEach(user => {
                        // Tarihi formatla
                        const date = new Date(user.createDate);
                        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
                        
                        usersHTML += `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td>${user.email}</td>
                                <td>${formattedDate}</td>
                            </tr>`;
                    });
                } else {
                    usersHTML += `
                        <tr>
                            <td colspan="5" style="text-align: center;">Henüz kullanıcı bulunmamaktadır.</td>
                        </tr>`;
                }
                
                usersHTML += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`;
                
                // Eğer modül zaten varsa kaldır
                $('.users-modal').remove();
                
                // Modülü ekle
                $('body').append(usersHTML);
                
                // Modülü göster
                $('.users-modal').fadeIn(300);
                
                // Kapatma butonuna tıklandığında
                $('.close-users-modal').click(function() {
                    $('.users-modal').fadeOut(300, function() {
                        $(this).remove();
                    });
                });
                
                // Modül dışına tıklandığında kapat
                $('.users-modal').click(function(e) {
                    if ($(e.target).hasClass('users-modal')) {
                        $('.users-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                });

                // Klavye olaylarını dinle (ESC tuşu ile kapatma)
                $(document).on('keydown', function(e) {
                    if (e.key === "Escape" && $('.users-modal').is(':visible')) {
                        $('.users-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Kullanıcılar alınırken hata oluştu:', error);
                showToast('error', 'Hata', 'Kullanıcılar alınırken bir hata oluştu!');
            }
        });
    }

    // Kullanıcılar kutusuna tıklandığında
    $('.col-div-3:eq(0) .box').click(function() {
        getUsers();
    });

    // Sayfa yüklendiğinde istatistikleri al
    getStatistics();

    // Her 30 saniyede bir istatistikleri güncelle
    setInterval(getStatistics, 30000);
}); 