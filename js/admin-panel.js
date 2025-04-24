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

    
    
    $('.menu-header').on('click', function () {
        $('#mySidenav').toggleClass('show');

        // Eğer #mySidenav elementinde 'show' sınıfı varsa
        if ($('#mySidenav').hasClass('show')) {

            $('#mySidenav').css({'transform': 'translateX(0)', 'visibility': 'visible'});
            $('.sidenav .sidenav-header .logo ').css({'opacity': '1', 'cursor': 'pointer'});

            if($(window).width() < 992){
                $('body').append('<div class="overlay"></div>');
                $('.overlay').addClass('active');
                $('.sidenav a span').css({'margin-left': '13px', 'opacity': '1'});
            } else {
                $('#main').css('margin-left', '245px');
                $('.head').css('margin-left', '245px');
                $('.head').css('width', 'calc(100% - 245px)');
                $('.sidenav a span').css({'margin-left': '8px', 'opacity': '1'});
                $('.sidenav a i').css({'margin-left': '0'});
            }

        } else {
            // Eğer 'show' sınıfı yoksa, overlay'i kaldırmak için
            $('.overlay').remove();
            $('#main').css('margin-left', '70px');
            $('.head').css('margin-left', '70px');
            $('.head').css('width', 'calc(100% - 70px)');
            $('#mySidenav').css({'transform': 'translateX(-70%)', 'visibility': 'visible'});
            $('.sidenav .sidenav-header .logo ').css({'opacity': '0', 'cursor': 'default'});
            $('.sidenav a span').css({'margin-left': '-200px', 'opacity': '0'});
            $('.sidenav a i').css({'margin-left': '165px'});
        }
    });

    // .overlay'e tıklanınca menüyü kapat
    $(document).on('click', '.overlay', function () {
        $('#mySidenav').removeClass('show');
        $(this).remove(); // overlay'i kaldır
        $('#mySidenav').css({'transform': 'translateX(-100%)', 'visibility': 'hidden'});
        $('.sidenav .sidenav-header .logo ').css({'opacity': '0', 'cursor': 'default'});
        $('.sidenav a span').css({'margin-left': '0px', 'opacity': '0'});
        $('.sidenav a i').css({'margin-left': '0'});
    });
    
    
    function checkScreenSize() {
        // Sayfa yüklendiğinde ve ekran boyutu 992px ve üzerindeyse sidenav'ı aç
        if ($(window).width() >= 992) {
            $('#mySidenav').addClass('show');
            $('#main').css('margin-left', '245px');
            $('.head').css('margin-left', '245px');
            $('.head').css('width', 'calc(100% - 245px)');

            $('#mySidenav').css({'transform': 'translateX(0)', 'visibility': 'visible'});
            $('.sidenav .sidenav-header .logo ').css({'opacity': '1', 'cursor': 'pointer'});
            $('.sidenav a span').css({'margin-left': '8px', 'opacity': '1'});
            $('.sidenav a i').css({'margin-left': '0'});

        } else {
            if ($('#mySidenav').hasClass('show')) {
                $('#mySidenav').removeClass('show');
                $('#main').css('margin-left', '0px');
                $('.head').css('margin-left', '0px');
                $('.head').css('width', '100%');
                $('.sidenav').css({'margin-left': '0px'});

                if($('.overlay').length > 0){
                    $('.overlay').remove();
                }
            } else {
                $('#mySidenav').css({'transform': 'translateX(-100%)', 'visibility': 'hidden'});
                $('.sidenav .sidenav-header .logo ').css({'opacity': '0', 'cursor': 'default'});
                $('.sidenav a span').css({'margin-left': '0px', 'opacity': '0'});
                $('.sidenav a i').css({'margin-left': '0'});
            }
        }
    }
    
    // Sayfa yüklendiğinde çalıştır
    checkScreenSize();
    
    // Ekran boyutu değiştiğinde tekrar kontrol et
    $(window).resize(function() {
        checkScreenSize();
    });



    // İstatistikleri API'den al
    function getStatistics() {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/dashboards',
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
            url: 'https://eatwell-api.azurewebsites.net/api/users/getall',
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
                                <td colspan="5" class="empty-table-row">Henüz kullanıcı bulunmamaktadır.</td>
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
            url: `https://eatwell-api.azurewebsites.net/api/users/get?userId=${userId}`,
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
            url: 'https://eatwell-api.azurewebsites.net/api/mealCategories/getAllForAdmin',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Dashboard içeriğini temizle
                $('.dashboard-content').empty();
                
                // Menüler için HTML yapısı
                let menusHTML = `
                <div class="menus-container">
                    <div class="menus-header">
                        <h2>Menü Listesi</h2>
                        <button class="btn-create-menu">
                            <i class="fa-solid fa-plus"></i>
                            Yeni Menü Ekle
                        </button>
                    </div>
                    <div class="menus-body">
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
                </div>`;
                
                // Menüleri dashboard'a ekle
                $('.dashboard-content').append(menusHTML);
                
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
                                        <button class="btn-edit-menu" data-menu-id="${menu.id}">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                            Düzenle
                                        </button>
                                    </td>
                                </tr>`;
                        });
                    } else {
                        // Menü yoksa bilgi mesajı göster
                        menusTableHTML = `
                            <tr>
                                <td colspan="5" class="empty-table-row">Henüz menü bulunmamaktadır.</td>
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
            },
            error: function(xhr, status, error) {
                console.error('Menüler alınırken hata oluştu:', error);
                showToast('error', 'Hata', 'Menüler alınırken bir hata oluştu!');
            }
        });
    }

    // Navbar'daki "Menüler" seçeneğine tıklandığında
    $('.sidenav a:contains("Menüler")').click(function(e) {
        e.preventDefault();
        getMenus();
    });



    function deleteOrRestoreMenu(menuId) {
        const token = localStorage.getItem('token');
        const toggleSwitch = $(`.toggle-switch input[data-menu-id="${menuId}"]`);

        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/mealCategories/setDeleteOrRestore?mealCategoryId=${menuId}`,
            type: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', response.message);
                } else {
                    showToast('error', 'Hata', response.message);
                     // Toggle switch'i eski haline getir
                     toggleSwitch.prop('checked', !toggleSwitch.prop('checked'));
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage);
                 // Toggle switch'i eski haline getir
                 toggleSwitch.prop('checked', !toggleSwitch.prop('checked'));
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
            url: `https://eatwell-api.azurewebsites.net/api/mealCategories/getForAdmin?mealCategoryId=${menuId}`,
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
                                    <img src="${menu.imagePath}" alt="${menu.name}" class="menu-detail-image">
                                </div>
                                <div class="menu-info">
                                    <div class="menu-info-item">
                                        <div class="menu-label">
                                            <strong>Menü Adı</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="menu-value">${menu.name}</p>
                                    </div>
                                    <div class="menu-info-item">
                                        <div class="menu-label">
                                            <strong>Durum</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="menu-value">${menu.isDeleted ? 'Pasif' : 'Aktif'}</p>
                                    </div>
                                    <div class="menu-info-item">
                                        <div class="menu-label">
                                            <strong>Oluşturulma Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="menu-value">${formattedCreateDate}</p>
                                    </div>
                                    <div class="menu-info-item">
                                        <div class="menu-label">
                                            <strong>Güncellenme Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="menu-value">${formattedUpdateDate}</p>
                                    </div>
                                    <div class="menu-info-item">
                                        <div class="menu-label">
                                            <strong>Silinme Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="menu-value">${formattedDeleteDate}</p>
                                    </div>
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
        // Eğer tıklanan element düzenleme butonu veya toggle switch ise işlemi durdur
        if ($(e.target).closest('.btn-edit-menu, .toggle-switch').length) {
            return;
        }

        const menuId = $(this).data('menu-id');
        getMenuDetails(menuId);
    });


    // Modal açıldığında, öğelerin alt alta gelip gelmediğini kontrol et
    function checkIfItemsAreOnNewLine() {
        var menuItem = $(".menu-update-modal .menu-info .menu-info-item");
        var label = menuItem.find(".menu-label");
        var value = menuItem.find(".menu-value");
        
        if (label.length === 0 || value.length === 0) return;

        var labelOffset = label.offset().top;
        var valueOffset = value.offset().top;
        
        // Eğer value, label'ın altındaysa margin-top uygula
        if (valueOffset > labelOffset) {
            menuItem.css("margin", "10px 15px");
        } else {
            menuItem.css("margin", "0 15px");
        }
    }

    // Modal açıldığında fonksiyonu çağır
    $(document).on('shown.bs.modal', '.menu-update-modal', function() {
        setTimeout(function() {
            checkIfItemsAreOnNewLine();
        }, 1);
    });

    // Ekran boyutu değiştiğinde kontrol et (sadece modal açıkken)
    var resizeTimer;
    $(window).resize(function() {
        if ($('.menu-update-modal').is(':visible')) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                checkIfItemsAreOnNewLine();
            }, 250);
        }
    });

    function updateMenu(menuId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/mealCategories/getForAdmin?mealCategoryId=${menuId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const menu = response.data;
                              
                    let menuUpdateHTML = `
                    <div class="menu-update-modal" data-menu-id="${menu.id}">
                        <div class="menu-update-content">
                            <div class="menu-update-header">
                                <h2>Menü Güncelleme</h2>
                                <span class="close-menu-update">&times;</span>
                            </div>
                            <div class="menu-update-body">
                                <div class="menu-image-container">
                                    <img src="${menu.imagePath}" alt="${menu.name}" class="menu-update-image" id="previewImage">

                                    <label for="menuImage" class="custom-upload-button">Resim Seç</label>
                                    <input type="file" id="menuImage" accept="image/*" class="menu-image-input">
                                </div>
                                <div class="menu-info">
                                    <div class="menu-info-item">
                                        <div class="menu-label">
                                            <strong>Menü Adı</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="menu-value" value="${menu.name}">
                                    </div>
                                </div>
                                <button class="btn-update-menu">Güncelle</button>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.menu-update-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(menuUpdateHTML);
                    
                    // Detay modülünü göster
                    $('.menu-update-modal').fadeIn(300, function() {
                        checkIfItemsAreOnNewLine();
                    });
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-menu-update').click(function() {
                        $('.menu-update-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.menu-update-modal').click(function(e) {
                        if ($(e.target).hasClass('menu-update-modal')) {
                            $('.menu-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Menü güncellenirken bir hata oluştu!');
                }
            },
            error: function(xhr, status, error) {
                console.error('Menü güncellenirken hata oluştu:', error);
                showToast('error', 'Hata', 'Menü güncellenirken bir hata oluştu!');
            }
        });
    }

    // Menüde "Düzenle" butonuna tıklandığında
    $(document).on('click', '.btn-edit-menu', function(e) {
        e.stopPropagation();

        const menuId = $(this).data('menu-id');
        updateMenu(menuId);
    });

    // Menüde "Güncelle" butonuna tıklandığında
    $(document).on('click', '.btn-update-menu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const menuId = $(this).closest('.menu-update-modal').data('menu-id');
        const menuName = $(this).closest('.menu-update-modal').find('.menu-value').val();
        
        if (menuName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen menü adını giriniz!');
            return;
        }

        const menuImage = $('#menuImage')[0].files[0];

        const formData = new FormData();
        formData.append('name', menuName);
        if (menuImage) {
            formData.append('image', menuImage);
        }
        
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/mealCategories/update?mealCategoryId=${menuId}`,
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Menü başarıyla güncellendi!');
                    $('.menu-update-modal').fadeOut(300, function() {
                        $(this).remove();
                    });
                    getMenus(); // Menü listesini yenile
                } else {
                    showToast('error', 'Hata', response.message);
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage);
            }
        });
    });

    // Resim seçildiğinde önizleme gösterme
    $(document).on('change', '#menuImage', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // FileReader ile dosyayı oku
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Önizleme resmini güncelle
                $('#previewImage').attr('src', e.target.result);
            }
            
            // Dosyayı base64 formatında oku
            reader.readAsDataURL(file);
        }
    });


    // Dashboard'a tıklandığında
    $('.sidenav a:contains("Dashboard")').click(function(e) {
        e.preventDefault();
        resetDashboard();
        getStatistics();
    });

    // Dashboard'u ilk haline getiren fonksiyon
    function resetDashboard() {
        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();
        
        // İlk halindeki HTML yapısını oluştur
        let dashboardHTML = `
            <div class="col-div-3 users">
                <div class="box">
                    <p><br/><span>Kullanıcılar</span></p>
                    <i class="fa fa-users box-icon"></i>
                </div>
            </div>
            <div class="col-div-3 menu">
                <div class="box">
                    <p><br/><span>Menüler</span></p>
                    <i class="fa fa-list box-icon"></i>
                </div>
            </div>
            <div class="col-div-3 orders">
                <div class="box">
                    <p><br/><span>Siparişler</span></p>
                    <i class="fa fa-shopping-bag box-icon"></i>
                </div>
            </div>
            <div class="col-div-3 reservations">
                <div class="box">
                    <p><br/><span>Rezervasyonlar</span></p>
                    <i class="fa fa-tasks box-icon"></i>
                </div>
            </div>
            <div class="col-div-8">
                <div class="box-8">
                    <div class="content-box">
                        <p>Top Selling Projects <span>Sell All</span></p>
                        <br/>
                        <table>
                            <tr>
                                <th>Company</th>
                                <th>Contact</th>
                                <th>Country</th>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Centro comercial Moctezuma</td>
                                <td>Francisco Chang</td>
                                <td>Mexico</td>
                            </tr>
                            <tr>
                                <td>Ernst Handel</td>
                                <td>Roland Mendel</td>
                                <td>Austria</td>
                            </tr>
                            <tr>
                                <td>Island Trading</td>
                                <td>Helen Bennett</td>
                                <td>UK</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-div-4">
                <div class="box-4">
                    <div class="content-box">
                        <p>Total Sale <span>Sell All</span></p>
                        <div class="circle-wrap">
                            <div class="circle">
                                <div class="mask full">
                                    <div class="fill"></div>
                                </div>
                                <div class="mask half">
                                    <div class="fill"></div>
                                </div>
                                <div class="inside-circle"> 70% </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        
        // Dashboard içeriğini güncelle
        $('.dashboard-content').append(dashboardHTML);
    }
}); 