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
        showToast('success', 'Başarılı', 'Çıkış yapılıyor...');
        
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

    
    // Responsive tasarım için mobil menü kontrolü
    function checkScreenSize(e) {
        if (window.innerWidth <= 992) {
            $("#mySidenav").css('width','0');
            $("#main").css('margin-left','0');
            $(".nav").css('display','block');
            $(".nav2").css('display','none');
            $(".head").css("padding-left", "17px");

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
                    $("#main .head").css('padding-left', '320px');
                    $(".logo").css('visibility', 'visible');
                    $(".icon-a").css('visibility', 'visible');
                    $(".icons").css('visibility', 'visible');
                    $(".nav").css('display','block');
                    $(".nav2").css('display','none');
                } else {
                    $("#mySidenav").css('width','70px');
                    $("#main").css('margin-left','70px');
                    $("#main .head").css('padding-left', '95px');
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
                $("#main .head").css('padding-left', '320px');
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
            $("#mySidenav").hasClass('active')) 
        {
            $("#mySidenav").css('width','0');
            $("#mySidenav").removeClass('active');
            $(".head").attr("style", "padding-left: 95px");
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

    // Sayfa yüklendiğinde istatistikleri al
    getStatistics();

    // Her 10 dakikada bir istatistikleri güncelle
    setInterval(getStatistics, 600000);




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
                // Kullanıcılar listesi modalının HTML yapısı
                let usersHTML = `
                <div class="users-modal">
                    <div class="users-modal-content">
                        <div class="users-modal-header">
                            <h2>Kullanıcı Listesi</h2>
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
                                <tbody id="usersTableBody">
                                </tbody>
                            </table>
                            <!-- Sayfalama kontrolleri -->
                            <div class="pagination-container">
                                <div class="pagination">
                                    <button id="prevPage" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
                                    <span id="pageInfo">Sayfa 1</span>
                                    <button id="nextPage" class="pagination-btn"><i class="fas fa-chevron-right"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                // Eğer modül zaten varsa kaldır
                $('.users-modal').remove();
                
                // Modülü ekle
                $('body').append(usersHTML);
                
                // Sayfalama için gerekli değişkenler
                let currentPage = 1; // Mevcut sayfa numarası
                const itemsPerPage = 10; // Her sayfada gösterilecek kullanıcı sayısı
                const totalUsers = response.data.length; // Toplam kullanıcı sayısı
                const totalPages = Math.ceil(totalUsers / itemsPerPage); // Toplam sayfa sayısı

                // Kullanıcıları sayfalara böl ve göster
                function displayUsers(page) {
                    // Gösterilecek kullanıcıların başlangıç ve bitiş indekslerini hesapla
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    // İlgili sayfadaki kullanıcıları seç
                    const usersToShow = response.data.slice(startIndex, endIndex);
                    
                    let usersTableHTML = '';
                    
                    // Seçilen kullanıcıları tabloya ekle
                    if (usersToShow.length > 0) {
                        usersToShow.forEach(user => {
                            // Tarihi formatla (gün.ay.yıl şeklinde)
                            const date = new Date(user.createDate);
                            const formattedDate = `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                            
                            usersTableHTML += `
                                <tr class="user-row" data-user-id="${user.id}">
                                    <td>${user.id}</td>
                                    <td>${user.firstName}</td>
                                    <td>${user.lastName}</td>
                                    <td>${user.email}</td>
                                    <td>${formattedDate}</td>
                                </tr>`;
                        });
                    } else {
                        // Kullanıcı yoksa bilgi mesajı göster
                        usersTableHTML = `
                            <tr>
                                <td colspan="5" style="text-align: center;">Henüz kullanıcı bulunmamaktadır.</td>
                            </tr>`;
                    }
                    
                    // Tabloyu güncelle
                    $('#usersTableBody').html(usersTableHTML);
                    // Sayfa bilgisini güncelle
                    $('#pageInfo').text(`Sayfa ${page} / ${totalPages}`);
                    
                    // Sayfalama butonlarının durumunu güncelle
                    $('#prevPage').prop('disabled', page === 1); // İlk sayfada geri butonu devre dışı
                    $('#nextPage').prop('disabled', page === totalPages); // Son sayfada ileri butonu devre dışı
                }
                
                // Mevcut sayfayı göster
                displayUsers(currentPage);
                
                // Önceki sayfa butonuna tıklama olayı
                $('#prevPage').click(function() {
                    if (currentPage > 1) {
                        currentPage--;
                        displayUsers(currentPage);
                    }
                });
                
                // Sonraki sayfa butonuna tıklama olayı
                $('#nextPage').click(function() {
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayUsers(currentPage);
                    }
                });
                
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

                // Kullanıcı satırına tıklama olayı (dinamik olarak eklenen elementler için)
                $(document).on('click', '.user-row', function() {
                    const userId = $(this).data('user-id');
                    getUserDetails(userId);
                });
            },
            error: function(xhr, status, error) {
                console.error('Kullanıcılar alınırken hata oluştu:', error);
                showToast('error', 'Hata', 'Kullanıcılar alınırken bir hata oluştu!');
            }
        });
    }

    
    // Kullanıcı detaylarını getiren fonksiyon
    function getUserDetails(userId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwellrestaurantapi.somee.com/api/users/get?userId=${userId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const user = response.data;
                    const createDate = new Date(user.createDate);
                    const formattedDate = `${createDate.getDate()}.${(createDate.getMonth() + 1).toString().padStart(2, '0')}.${createDate.getFullYear()}`;
                    
                    let userDetailsHTML = `
                    <div class="user-details-modal">
                        <div class="user-details-content">
                            <div class="user-details-header">
                                <h2>Kullanıcı Detayı</h2>
                                <span class="close-user-details">&times;</span>
                            </div>
                            <div class="user-details-body">
                                <div class="user-info">
                                    <p><strong>Ad:</strong> ${user.firstName}</p>
                                    <p><strong>Soyad:</strong> ${user.lastName}</p>
                                    <p><strong>E-posta:</strong> ${user.email}</p>
                                    <p><strong>Doğrulama Durumu:</strong> ${user.verification ? 'Doğrulanmış' : 'Doğrulanmamış'}</p>
                                    <p><strong>Kayıt Tarihi:</strong> ${formattedDate}</p>
                                    <p><strong>Durum:</strong> ${user.isDeleted ? 'Silinmiş' : 'Aktif'}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.user-details-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(userDetailsHTML);
                    
                    // Detay modülünü göster
                    $('.user-details-modal').fadeIn(300);
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-user-details').click(function() {
                        $('.user-details-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.user-details-modal').click(function(e) {
                        if ($(e.target).hasClass('user-details-modal')) {
                            $('.user-details-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Kullanıcı detayları alınırken bir hata oluştu!');
                }
            },
            error: function(xhr, status, error) {
                console.error('Kullanıcı detayları alınırken hata oluştu:', error);
                showToast('error', 'Hata', 'Kullanıcı detayları alınırken bir hata oluştu!');
            }
        });
    }

    // Kullanıcılar kutusuna tıklandığında
    $('.col-div-3:eq(0) .box').click(function() {
        getUsers();
    });





    // Menüleri getiren fonksiyon
    function getMenus() {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: 'https://eatwellrestaurantapi.somee.com/api/mealCategories/getAllForAdmin',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Menüler modalının HTML yapısı
                let menusHTML = `
                <div class="menus-modal">
                    <div class="menus-modal-content">
                        <div class="menus-modal-header">
                            <h2>Menü Listesi</h2>
                            <span class="close-menus-modal">&times;</span>
                        </div>
                        <div class="menus-modal-body">
                            <table class="menus-table">
                                <thead>
                                    <tr>
                                        <th>Durum</th>
                                        <th>ID</th>
                                        <th>Menü Adı</th>
                                        <th>Kayıt Tarihi</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody id="menusTableBody">
                                </tbody>
                            </table>
                            <!-- Sayfalama kontrolleri -->
                            <div class="pagination-container">
                                <div class="pagination">
                                    <button id="prevMenuPage" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
                                    <span id="menuPageInfo">Sayfa 1</span>
                                    <button id="nextMenuPage" class="pagination-btn"><i class="fas fa-chevron-right"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                // Eğer modül zaten varsa kaldır
                $('.menus-modal').remove();
                
                // Modülü ekle
                $('body').append(menusHTML);
                
                // Sayfalama için gerekli değişkenler
                let currentPage = 1; // Mevcut sayfa numarası
                const itemsPerPage = 10; // Her sayfada gösterilecek menü sayısı
                const totalMenus = response.data.length; // Toplam menü sayısı
                const totalPages = Math.ceil(totalMenus / itemsPerPage); // Toplam sayfa sayısı

                // Menüleri sayfalara böl ve göster
                function displayMenus(page) {
                    // Gösterilecek menülerin başlangıç ve bitiş indekslerini hesapla
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    // İlgili sayfadaki menüleri seç
                    const menusToShow = response.data.slice(startIndex, endIndex);
                    
                    let menusTableHTML = '';
                    
                    // Seçilen menüleri tabloya ekle
                    if (menusToShow.length > 0) {
                        menusToShow.forEach(menu => {
                            // Tarihi formatla (gün.ay.yıl şeklinde)
                            const date = new Date(menu.createDate);
                            const formattedDate = `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                            
                            menusTableHTML += `
                                <tr class="menu-row" data-menu-id="${menu.id}">
                                    <td>
                                        <label class="toggle-switch">
                                            <input type="checkbox" ${menu.isDeleted ? '' : 'checked'} data-menu-id="${menu.id}">
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </td>
                                    <td>${menu.id}</td>
                                    <td>${menu.name}</td>
                                    <td>${formattedDate}</td>
                                    <td>
                                        <button class="btn-edit-menu" data-menu-id="${menu.id}">Düzenle</button>
                                    </td>
                                </tr>`;
                        });
                    } else {
                        // Menü yoksa bilgi mesajı göster
                        menusTableHTML = `
                            <tr>
                                <td colspan="5" style="text-align: center;">Henüz menü bulunmamaktadır.</td>
                            </tr>`;
                    }
                    
                    // Tabloyu güncelle
                    $('#menusTableBody').html(menusTableHTML);
                    // Sayfa bilgisini güncelle
                    $('#menuPageInfo').text(`Sayfa ${page} / ${totalPages}`);
                    
                    // Sayfalama butonlarının durumunu güncelle
                    $('#prevMenuPage').prop('disabled', page === 1); // İlk sayfada geri butonu devre dışı
                    $('#nextMenuPage').prop('disabled', page === totalPages); // Son sayfada ileri butonu devre dışı
                }
                
                // İlk sayfayı göster
                displayMenus(currentPage);
                
                // Önceki sayfa butonuna tıklama olayı
                $('#prevMenuPage').click(function() {
                    if (currentPage > 1) {
                        currentPage--;
                        displayMenus(currentPage);
                    }
                });
                
                // Sonraki sayfa butonuna tıklama olayı
                $('#nextMenuPage').click(function() {
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayMenus(currentPage);
                    }
                });
                
                // Modülü göster
                $('.menus-modal').fadeIn(300);
                
                // Kapatma butonuna tıklandığında
                $('.close-menus-modal').click(function() {
                    $('.menus-modal').fadeOut(300, function() {
                        $(this).remove();
                    });
                });
                
                // Modül dışına tıklandığında kapat
                $('.menus-modal').click(function(e) {
                    if ($(e.target).hasClass('menus-modal')) {
                        $('.menus-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                });

                // ESC tuşu ile kapatma
                $(document).on('keydown', function(e) {
                    if (e.key === "Escape" && $('.menus-modal').is(':visible')) {
                        $('.menus-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Menüler alınırken hata oluştu:', error);
                showToast('error', 'Hata', 'Menüler alınırken bir hata oluştu!');
            }
        });
    }

    // Menüler kutusuna tıklandığında
    $('.col-div-3:eq(1) .box').click(function() {
        getMenus();
    });


    function deleteOrRestoreMenu(menuId) {
        const token = localStorage.getItem('token');

        $.ajax({
            url: `https://eatwellrestaurantapi.somee.com/api/mealCategories/setDeleteOrRestore?mealCategoryId=${menuId}`,
            type: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    showToast('success', 'Başarılı', 'Menü başarıyla silindi!');
                } else {
                    showToast('error', 'Hata', 'Menü silinirken bir hata oluştu!');
                }
            },
            error: function(xhr, status, error) {
                console.error('Menü silinirken hata oluştu:', error);
                showToast('error', 'Hata', 'Menü silinirken bir hata oluştu!');
            }
        });
    }

    // Menü durumunu değiştirme olayı
    $(document).on('change', '.toggle-switch input', function(e) {
        e.stopPropagation(); // Event'in yayılmasını durduruyoruz yani menü detayının gelmesini engelliyoruz.
        const menuId = $(this).data('menu-id');
        deleteOrRestoreMenu(menuId);
    });

    // Toggle switch'e tıklama olayını engelle
    $(document).on('click', '.toggle-switch', function(e) {
        e.stopPropagation();
    });

    


    // Menü detaylarını getiren fonksiyon
    function getMenuDetails(menuId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwellrestaurantapi.somee.com/api/mealCategories/getForAdmin?mealCategoryId=${menuId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const menu = response.data;
                    const createDate = new Date(menu.createDate);
                    const updateDate = menu.updateDate ? new Date(menu.updateDate) : null;
                    const deleteDate = menu.deleteDate ? new Date(menu.deleteDate) : null;
                    
                    // Tarihleri formatla
                    const formattedCreateDate = `${createDate.getDate().toString().padStart(2, '0')}.${(createDate.getMonth() + 1).toString().padStart(2, '0')}.${createDate.getFullYear()}`;
                    const formattedUpdateDate = updateDate ? `${updateDate.getDate().toString().padStart(2, '0')}.${(updateDate.getMonth() + 1).toString().padStart(2, '0')}.${updateDate.getFullYear()}` : '-';
                    const formattedDeleteDate = deleteDate ? `${deleteDate.getDate().toString().padStart(2, '0')}.${(deleteDate.getMonth() + 1).toString().padStart(2, '0')}.${deleteDate.getFullYear()}` : '-';
                    
                    let menuDetailsHTML = `
                    <div class="menu-details-modal">
                        <div class="menu-details-content">
                            <div class="menu-details-header">
                                <h2>Menü Detayı</h2>
                                <span class="close-menu-details">&times;</span>
                            </div>
                            <div class="menu-details-body">
                                <div class="menu-image-container">
                                    <img src="http://${menu.imagePath}" alt="${menu.name}" class="menu-detail-image">
                                </div>
                                <div class="menu-info">
                                    <p><strong>Menü Adı:</strong> ${menu.name}</p>
                                    <p><strong>Durum:</strong> ${menu.isDeleted ? 'Pasif' : 'Aktif'}</p>
                                    <p><strong>Oluşturulma Tarihi:</strong> ${formattedCreateDate}</p>
                                    <p><strong>Güncellenme Tarihi:</strong> ${formattedUpdateDate}</p>
                                    <p><strong>Silinme Tarihi:</strong> ${formattedDeleteDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.menu-details-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(menuDetailsHTML);
                    
                    // Detay modülünü göster
                    $('.menu-details-modal').fadeIn(300);
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-menu-details').click(function() {
                        $('.menu-details-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.menu-details-modal').click(function(e) {
                        if ($(e.target).hasClass('menu-details-modal')) {
                            $('.menu-details-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Menü detayları alınırken bir hata oluştu!');
                }
            },
            error: function(xhr, status, error) {
                console.error('Menü detayları alınırken hata oluştu:', error);
                showToast('error', 'Hata', 'Menü detayları alınırken bir hata oluştu!');
            }
        });
    }

    // Menü satırına tıklama olayı
    $(document).on('click', '.menu-row', function(e) {
        // Eğer toggle switch'e tıklandıysa işlemi durdur
        if ($(e.target).closest('.toggle-switch').length) {
            return;
        }
        const menuId = $(this).data('menu-id');
        getMenuDetails(menuId);
    });
}); 