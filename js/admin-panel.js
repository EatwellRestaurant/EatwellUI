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
            localStorage.removeItem('userName');
            localStorage.removeItem('adminRemembered');

            localStorage.removeItem('selectedMenuId');
            localStorage.removeItem('selectedMenuName');

            localStorage.removeItem('selectedCityId');
            localStorage.removeItem('selectedCityName');

            localStorage.removeItem('cityHistory');
            localStorage.removeItem('menuHistory');

            localStorage.removeItem('menuHistoryIndex');
            localStorage.removeItem('cityHistoryIndex');

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
        localStorage.removeItem('userName');
        localStorage.removeItem('adminRemembered');
        
        localStorage.removeItem('selectedMenuId');
        localStorage.removeItem('selectedMenuName');
        
        localStorage.removeItem('selectedCityId');
        localStorage.removeItem('selectedCityName');
        
        localStorage.removeItem('cityHistory');
        localStorage.removeItem('menuHistory');

        localStorage.removeItem('menuHistoryIndex');
        localStorage.removeItem('cityHistoryIndex');

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

            localStorage.removeItem('selectedMenuId');
            localStorage.removeItem('selectedMenuName');

            localStorage.removeItem('selectedCityId');
            localStorage.removeItem('selectedCityName');

            localStorage.removeItem('cityHistory');
            localStorage.removeItem('menuHistory');

            localStorage.removeItem('menuHistoryIndex');
            localStorage.removeItem('cityHistoryIndex');

            window.location.href = 'admin-login.html';
        }, 1500);
    });

    

    function openSidenavStyles() {
        $('#main').css('margin-left', '245px');
        $('.head').css({
            'margin-left': '245px',
            'width': 'calc(100% - 245px)'
        });
        $('.sidenav a span').css({
            'margin-left': '40px',
            'opacity': '1'
        });
        $('.sidenav a img').css('left', '17%');
    }


    function closeSidenavStyles() {
        $('#mySidenav').css({
            'transform': 'translateX(-100%)',
            'visibility': 'hidden'
        });
        $('.sidenav .sidenav-header .logo').css({
            'opacity': '0',
            'cursor': 'default'
        });
        $('.sidenav a span').css({
            'margin-left': '0px',
            'opacity': '0'
        });
        $('.sidenav a img').css('left', '17%');
    }
    

    $('.menu-header').on('click', function () {
        $('#mySidenav').toggleClass('show');

        // Eğer #mySidenav elementinde 'show' sınıfı varsa
        if ($('#mySidenav').hasClass('show')) {

            $('#mySidenav').css({'transform': 'translateX(0)', 'visibility': 'visible'});
            $('.sidenav .sidenav-header .logo ').css({'opacity': '1', 'cursor': 'pointer'});

            if($(window).width() < 992){
                $('body').append('<div class="overlay"></div>');
                $('.overlay').addClass('active');
                $('.sidenav a span').css({'margin-left': '40px', 'opacity': '1'});
            } else {
                openSidenavStyles();
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
            $('.sidenav a img').css('left', '84%');
        }
    });


    // .overlay'e tıklanınca menüyü kapat
    $(document).on('click', '.overlay', function () {
        $('#mySidenav').removeClass('show');
        $(this).remove(); // overlay'i kaldır
        closeSidenavStyles();
    });
    

    // sidenav'daki herhangi bir linke tıklanınca menüyü kapat
    $(document).on('click', '.sidenav a', function () {
        if ($('#mySidenav').hasClass('show') && $(window).width() < 992 && $('.overlay').length > 0) {
            $('#mySidenav').removeClass('show');
            $('.overlay').remove(); 
            closeSidenavStyles();
        }
    });
    
    
    function checkScreenSize() {
        // Sayfa yüklendiğinde ve ekran boyutu 992px ve üzerindeyse sidenav'ı aç
        if ($(window).width() >= 992) {
            
            if($('.overlay').length > 0){
                $('.overlay').remove();
            }

            $('#mySidenav').addClass('show');
            $('#mySidenav').css({'transform': 'translateX(0)', 'visibility': 'visible'});
            $('.sidenav .sidenav-header .logo ').css({'opacity': '1', 'cursor': 'pointer'});
            openSidenavStyles();

        } else {
            if ($('#mySidenav').hasClass('show')) {
                $('#mySidenav').removeClass('show');
                $('#main').css('margin-left', '0px');
                $('.head').css('margin-left', '0px');
                $('.head').css('width', '100%');
                $('.sidenav').css({'margin-left': '0px'});
                closeSidenavStyles();

                if($('.overlay').length > 0){
                    $('.overlay').remove();
                }
            } else {
                closeSidenavStyles();
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
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'İstatistikler alınırken hata oluştu!');
            }
        });
    }

    
    // Her 10 dakikada bir istatistikleri güncelle
    setInterval(getStatistics, 600000);



    // Kullanıcıları getiren fonksiyon
    function getUsers() {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/users/getall',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Dashboard içeriğini temizle
                $('.dashboard-content').empty();
                
                // Menüler için HTML yapısı
                let menusHTML = `
                <div class="users-container">
                    <div class="users-header">
                        <h2>Kullanıcı Listesi</h2>
                    </div>
                    <div class="users-body">
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
                                <button id="prevUserPage" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
                                <span id="userPageInfo">Sayfa 1</span>
                                <button id="nextUserPage" class="pagination-btn"><i class="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                // Menüleri dashboard'a ekle
                $('.dashboard-content').append(menusHTML);
                
                // Sayfalama için gerekli değişkenler
                let currentPage = 1; // Mevcut sayfa numarası
                const itemsPerPage = 10; // Her sayfada gösterilecek kullanıcı sayısı
                const totalUsers = response.data.length; // Toplam kullanıcı sayısı
                const totalPages = Math.ceil(totalUsers / itemsPerPage) ? Math.ceil(totalUsers / itemsPerPage) : 1 ; // Toplam sayfa sayısı

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
                            const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                            
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
                    $('#userPageInfo').text(`Sayfa ${page} / ${totalPages}`);
                    
                    // Sayfalama butonlarının durumunu güncelle
                    $('#prevUserPage').prop('disabled', page === 1); // İlk sayfada geri butonu devre dışı
                    $('#nextUserPage').prop('disabled', page === totalPages); // Son sayfada ileri butonu devre dışı
                }
                
                // İlk sayfayı göster
                displayUsers(currentPage);
                
                // Önceki sayfa butonuna tıklama olayı
                $('#prevUserPage').click(function() {
                    if (currentPage > 1) {
                        currentPage--;
                        displayUsers(currentPage);
                    }
                });
                
                // Sonraki sayfa butonuna tıklama olayı
                $('#nextUserPage').click(function() {
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayUsers(currentPage);
                    }
                });
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Kullanıcılar alınırken hata oluştu!');
            }
        });
    }

    // Navbar'daki "Kullanıcılar" seçeneğine tıklandığında
    $('.sidenav a:contains("Kullanıcılar")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'users' }, 'Kullanıcılar', '?page=users'); 

        getUsers();
    });

    // Kullanıcılar kutusuna tıklandığında
    $('.col-div-3:eq(0) .box').click(function() {
        getUsers();
    });



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
                    const lastLoginDate = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
                    
                    // Tarihleri formatla
                    const formattedCreateDate = `${createDate.getDate().toString().padStart(2, '0')}.${(createDate.getMonth() + 1).toString().padStart(2, '0')}.${createDate.getFullYear()}`;
                    const formattedLastLoginDate = lastLoginDate ? `${lastLoginDate.getDate().toString().padStart(2, '0')}.${(lastLoginDate.getMonth() + 1).toString().padStart(2, '0')}.${lastLoginDate.getFullYear()}` : '-';
                    
                    let userDetailsHTML = `
                    <div class="user-details-modal">
                        <div class="user-details-content">
                            <div class="user-details-header">
                                <h2>Kullanıcı Detayı</h2>
                                <span class="close-user-details">&times;</span>
                            </div>
                            <div class="user-details-body">
                                <div class="user-info">
                                    <div class="user-info-item">
                                        <div class="user-label">
                                            <strong>Adı Soyadı</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="user-value">${user.firstName} ${user.lastName}</p>
                                    </div>
                                    <div class="user-info-item">
                                        <div class="user-label">
                                            <strong>Email</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="user-value">${user.email}</p>
                                    </div>
                                    <div class="user-info-item">
                                        <div class="user-label">
                                            <strong>Kayıt Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="user-value">${formattedCreateDate}</p>
                                    </div>
                                    <div class="user-info-item">
                                        <div class="user-label">
                                            <strong>Doğrulama</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="user-value">${user.verification ? 'Yapılmış' : 'Yapılmamış'}</p>
                                    </div>
                                    <div class="user-info-item">
                                        <div class="user-label">
                                            <strong>Son Giriş Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="user-value">${formattedLastLoginDate}</p>
                                    </div>
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
                    showToast('error', 'Hata', 'Kullanıcı detayı alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Kullanıcı detayı alınırken hata oluştu!');
            }
        });
    }

    // Kullanıcı satırına tıklama olayı
    $(document).on('click', '.user-row', function() {
        const userId = $(this).data('user-id');
       
        getUserDetails(userId);
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
                            Menü Ekle
                        </button>
                    </div>
                    <div class="menus-body">
                        <table class="menus-table">
                            <thead>
                                <tr>
                                    <th>Durum</th>
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
                const totalPages = Math.ceil(totalMenus / itemsPerPage) ? Math.ceil(totalMenus / itemsPerPage) : 1 ; // Toplam sayfa sayısı

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
                            const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                            
                            menusTableHTML += `
                                <tr class="menu-row" data-menu-id="${menu.id}">
                                    <td>
                                        <label class="toggle-switch menu-toggle-switch">
                                            <input type="checkbox" ${menu.isActive ? 'checked' : ''} data-menu-id="${menu.id}">
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </td>
                                    <td>${menu.name}</td>
                                    <td>${formattedDate}</td>
                                    <td>
                                        <div class="table-actions-scroll">
                                            <button class="btn-delete-menu" data-menu-id="${menu.id}">
                                                <i class="fa-solid fa-trash"></i>
                                                Sil
                                            </button>
                                            <button class="btn-edit-menu" data-menu-id="${menu.id}">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                                Düzenle
                                            </button>
                                            <button class="btn-products-menu" data-menu-id="${menu.id}" data-menu-name="${menu.name}">
                                                <i class="fa-solid fa-list"></i>
                                                Ürünleri Gör
                                            </button>
                                        </div>
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
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Menüler alınırken hata oluştu!');
            }
        });
    }

    // Navbar'daki "Menüler" seçeneğine tıklandığında
    $('.sidenav a:contains("Menüler")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'menus' }, 'Menüler', '?page=menus'); 

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
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Menü durumunu değiştirirken hata oluştu!');
                 // Toggle switch'i eski haline getir
                 toggleSwitch.prop('checked', !toggleSwitch.prop('checked'));
            }
        });
    }

    // Menü durumunu değiştirme olayı
    $(document).on('change', '.menu-toggle-switch input', function(e) {
        e.stopPropagation(); // Event'in yayılmasını durduruyoruz yani menü detayının gelmesini engelliyoruz.
        const menuId = $(this).data('menu-id');
        deleteOrRestoreMenu(menuId);
    });

    // Toggle switch'e tıklama olayını engelle
    $(document).on('click', '.menu-toggle-switch', function(e) {
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
                    
                    // Tarihleri formatla
                    const formattedCreateDate = `${createDate.getDate().toString().padStart(2, '0')}.${(createDate.getMonth() + 1).toString().padStart(2, '0')}.${createDate.getFullYear()}`;
                    
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
                                        <p class="menu-value">${menu.isActive ? 'Aktif' : 'Pasif'}</p>
                                    </div>
                                    <div class="menu-info-item">
                                        <div class="menu-label">
                                            <strong>Oluşturulma Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="menu-value">${formattedCreateDate}</p>
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
                    showToast('error', 'Hata', 'Menü detayı alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Menü detayı alınırken hata oluştu!');
            }
        });
    }

    // Menü satırına tıklama olayı
    $(document).on('click', '.menu-row', function(e) {
        // Eğer tıklanan element düzenleme butonu, toggle switch veya ürünleri gör butonu ise işlemi durdur
        if ($(e.target).closest('.btn-edit-menu, .toggle-switch, .btn-products-menu').length) {
            return;
        }

        const menuId = $(this).data('menu-id');
        getMenuDetails(menuId);
    });


    // Modal açıldığında, öğelerin alt alta gelip gelmediğini kontrol et
    function checkIfItemsAreOnNewLine(isUpdateModal) {
        if (isUpdateModal) {
            var menuItem = $(".menu-update-modal .menu-info .menu-info-item");
        } else {
            var menuItem = $(".menu-create-modal .menu-info .menu-info-item");
        }

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
            checkIfItemsAreOnNewLine(true);
        }, 1);
    });

    // Modal açıldığında fonksiyonu çağır
    $(document).on('shown.bs.modal', '.menu-create-modal', function() {
        setTimeout(function() {
            checkIfItemsAreOnNewLine(false);
        }, 1);
    });

    // Ekran boyutu değiştiğinde kontrol et (sadece modal açıkken)
    var resizeTimer;
    $(window).resize(function() {
        if ($('.menu-update-modal').is(':visible')) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                checkIfItemsAreOnNewLine(true);
            }, 250);
        }else if($('.menu-create-modal').is(':visible')){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                checkIfItemsAreOnNewLine(false);
            }, 250);
        }else{
            clearTimeout(resizeTimer);
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
                                    <input type="file" id="menuImage" accept="image/*" class="image-input">
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
                        checkIfItemsAreOnNewLine(true);
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
                    showToast('error', 'Hata', 'Menü bilgileri alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Menü bilgileri alınırken hata oluştu!');
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
                    showToast('error', 'Hata', 'Menü güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Menü güncellenirken hata oluştu!');
            }
        });
    });

    // Resim seçildiğinde önizleme gösterme (Menü için)
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


    function createMenu() {
        let menuCreateHTML = `
        <div class="menu-create-modal">
            <div class="menu-create-content">
                <div class="menu-create-header">
                    <h2>Menü Ekleme</h2>
                    <span class="close-menu-create">&times;</span>
                </div>
                <div class="menu-create-body">
                    <div class="menu-image-container">
                        <img src="../icons/default-menu-image-placeholder.png" alt="default-menu-image" class="menu-create-image" id="previewImage">
                        <label for="menuImage" class="custom-upload-button">Resim Seç</label>
                        <input type="file" id="menuImage" accept="image/*" class="image-input">
                    </div>
                    <div class="menu-info">
                        <div class="menu-info-item">
                            <div class="menu-label">
                                <strong>Menü Adı</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="menu-value">
                        </div>
                    </div>
                    <button class="btn-add-menu">Ekle</button>
                </div>
            </div>
        </div>`;
        
        
        // Detay modülünü ekle
        $('body').append(menuCreateHTML);
        
        // Detay modülünü göster
        $('.menu-create-modal').fadeIn(300, function() {
            checkIfItemsAreOnNewLine(false);
        });
        
        // Kapatma butonuna tıklandığında
        $('.close-menu-create').click(function() {
            $('.menu-create-modal').fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        // Modül dışına tıklandığında kapat
        $('.menu-create-modal').click(function(e) {
            if ($(e.target).hasClass('menu-create-modal')) {
                $('.menu-create-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    }


    // Menüde "Menü Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-create-menu', function(e) {
        e.stopPropagation();

        createMenu();
    });


    // Menüde "Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-add-menu', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const menuName = $(this).closest('.menu-create-modal').find('.menu-value').val();
        const menuImage = $('#menuImage')[0].files[0];

        if (menuName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen menü adını giriniz!');
            return;
        }
        
        const formData = new FormData();
        formData.append('name', menuName);
        if (menuImage) {
            formData.append('image', menuImage);
        }
        else{
            showToast('error', 'Hata', 'Lütfen menü resmi seçiniz!');
            return;
        }

        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/mealCategories/add`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Menü başarıyla eklendi!');
                    $('.menu-create-modal').fadeOut(300, function() {
                        $(this).remove();
                    });
                    getMenus(); // Menü listesini yenile
                } else {
                    showToast('error', 'Hata', response.message);
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Menü eklenirken hata oluştu!");
            }
        });
    });


    // Menüde "Sil" butonuna tıklandığında
    $(document).on('click', '.btn-delete-menu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const menuId = $(this).closest('.menu-row').data('menu-id');
        
        // SweetAlert2 ile özelleştirilmiş onay kutusu
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu menüyü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText: 'İptal',
            customClass: {
                popup: 'swal2-popup-custom',
                icon: 'swal2-icon-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                
                $.ajax({
                    url: `https://eatwell-api.azurewebsites.net/api/mealCategories/delete?mealCategoryId=${menuId}`,
                    type: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function(response) {
                        if (response.success) {
                            showToast('success', 'Başarılı', 'Menü başarıyla silindi!');

                            $('.menu-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });

                            getMenus(); // Menü listesini yenile
                        } else {
                            showToast('error', 'Hata', 'Menü silinirken hata oluştu!');
                        }
                    },
                    error: function(xhr) {
                        const errorMessage = xhr.responseJSON?.Message;
                        showToast('error', 'Hata', errorMessage ? errorMessage : 'Menü silinirken hata oluştu!');
                    }
                });
            }
        });
    });




    // Ürünleri getiren ortak fonksiyon
    function renderProductsList(data, options = {}) {
        const {
            title = 'Ürün Listesi',
            showGoToMenuButton = false
        } = options;
    
        // Ortak HTML yapısı
        $('.dashboard-content').empty();
        let html = `
        <div class="products-container">
            <div class="products-header">
                <h2>${title}</h2>
                <button class="btn-create-product">
                    <i class="fa-solid fa-plus"></i>
                    Ürün Ekle
                </button>
            </div>
            <div class="products-body">
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Durum</th>
                            ${showGoToMenuButton ? `<th>Menü Adı</th>` : '' }
                            <th>Ürün Adı</th>
                            <th>Fiyatı</th>
                            <th>Kayıt Tarihi</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody"></tbody>
                </table>
                <div class="pagination-container">
                    <div class="pagination">
                        <button id="prevProductPage" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
                        <span id="productPageInfo">Sayfa 1</span>
                        <button id="nextProductPage" class="pagination-btn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
        $('.dashboard-content').append(html);
    
        let currentPage = 1;
        const itemsPerPage = 10;
        const totalProducts = data.length;
        const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
    
        function displayProducts(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const productsToShow = data.slice(start, end);
    
            let tableHTML = '';
            if (productsToShow.length > 0) {
                productsToShow.forEach(product => {
                    const date = new Date(product.createDate);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
                    tableHTML += `
                    <tr class="product-row" data-product-id="${product.id}">
                        <td>
                            <label class="toggle-switch product-toggle-switch">
                                <input type="checkbox" ${product.isActive ? 'checked' : ''} data-product-id="${product.id}">
                                <span class="toggle-slider"></span>
                            </label>
                        </td>
                        ${showGoToMenuButton ? `<td>${product.mealCategoryName}</td>` : '' }
                        <td>${product.name}</td>
                        <td>${formatPriceInputLive(product.price.toFixed(2).replace('.', ','))}₺</td>
                        <td>${formattedDate}</td>
                        <td>
                            <div class="table-actions-scroll">
                                <button class="btn-delete-product" data-product-id="${product.id}">
                                    <i class="fa-solid fa-trash"></i>
                                    Sil
                                </button>
                                <button class="btn-edit-product" data-product-id="${product.id}">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                    Düzenle
                                </button>
                                ${showGoToMenuButton ? `
                                    <button class="btn-menu" data-menu-id="${product.mealCategoryId}" data-menu-name="${product.mealCategoryName}">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                        Menüye Git
                                    </button>` : ''
                                }
                            </div>
                        </td>
                    </tr>`;
                });
            } else {
                tableHTML = `<tr><td colspan="6" class="empty-table-row">Henüz ürün bulunmamaktadır.</td></tr>`;
            }
    
            $('#productsTableBody').html(tableHTML);
            $('#productPageInfo').text(`Sayfa ${page} / ${totalPages}`);
            $('#prevProductPage').prop('disabled', page === 1);
            $('#nextProductPage').prop('disabled', page === totalPages);
        }
    
        displayProducts(currentPage);
    
        $('#prevProductPage').click(() => {
            if (currentPage > 1) {
                currentPage--;
                displayProducts(currentPage);
            }
        });
    
        $('#nextProductPage').click(() => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts(currentPage);
            }
        });
    }


    function getProductsByMenu(menuId, menuName) {
        const token = localStorage.getItem('token');
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/products/getAllForAdminByMealCategoryId?mealCategoryId=${menuId}`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderProductsList(response.data, { title: menuName, showGoToMenuButton: false }),
            error: (xhr) => showToast('error', 'Hata', xhr.responseJSON?.Message || 'Ürünler getirilirken hata oluştu!')
        });
    }
    

    // Menüde "Ürünleri Gör" butonuna tıklandığında
    $(document).on('click', '.btn-products-menu', function(e) {
        e.stopPropagation();

        const menuId = $(this).data('menu-id');
        const menuName = $(this).data('menu-name');

        // Seçilen menüyü geçmişe kaydediyoruz
        selectEntity(menuId, menuName, Entity.MENU);

        localStorage.setItem('selectedMenuId', menuId);
        localStorage.setItem('selectedMenuName', menuName);

        getProductsByMenu(menuId, menuName);
    });


    function getAllProducts() {
        const token = localStorage.getItem('token');

        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/products/getAllForAdmin',
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderProductsList(response.data, { title: 'Ürün Listesi', showGoToMenuButton: true }),
            error: (xhr) => showToast('error', 'Hata', xhr.responseJSON?.Message || 'Ürünler alınırken hata oluştu!')
        });
    }


    // Navbar'daki "Ürünler" seçeneğine tıklandığında
    $('.sidenav a:contains("Ürünler")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'products' }, 'Ürünler', '?page=products'); 

        getAllProducts();
    });


    // Ürünler listesinde "Menüye Git" butonuna tıklandığında
    $(document).on('click', '.btn-menu', function(e) {
        e.stopPropagation();

        const menuId = $(this).data('menu-id');
        const menuName = $(this).data('menu-name');

        // Seçilen menüyü geçmişe kaydediyoruz
        selectEntity(menuId, menuName, Entity.MENU);

        localStorage.setItem('selectedMenuId', menuId);
        localStorage.setItem('selectedMenuName', menuName);

        getProductsByMenu(menuId, menuName);
    });


    // Ürün detaylarını getiren fonksiyon
    function getProductDetails(productId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/products/getForAdmin?productId=${productId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const product = response.data;
                    const createDate = new Date(product.createDate);
                    
                    // Tarihleri formatla
                    const formattedCreateDate = `${createDate.getDate().toString().padStart(2, '0')}.${(createDate.getMonth() + 1).toString().padStart(2, '0')}.${createDate.getFullYear()}`;
                    
                    let productDetailsHTML = `
                    <div class="product-details-modal">
                        <div class="product-details-content">
                            <div class="product-details-header">
                                <h2>Ürün Detayı</h2>
                                <span class="close-product-details">&times;</span>
                            </div>
                            <div class="product-details-body">
                                <div class="product-image-container">
                                    <img src="${product.imagePath}" alt="${product.name}" class="product-detail-image">
                                </div>
                                <div class="product-info">
                                    <div class="product-info-item">
                                        <div class="product-label">
                                            <strong>Ürün Adı</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="product-value">${product.name}</p>
                                    </div>
                                    <div class="product-info-item">
                                        <div class="product-label">
                                            <strong>Fiyatı</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="product-value">${formatPriceInputLive(product.price.toFixed(2).replace('.', ','))}₺</p>
                                    </div>
                                    <div class="product-info-item">
                                        <div class="product-label">
                                            <strong>Durum</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="product-value">${product.isActive ? 'Aktif' : 'Pasif'}</p>
                                    </div>
                                    <div class="product-info-item">
                                        <div class="product-label">
                                            <strong>Oluşturulma Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="product-value">${formattedCreateDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.product-details-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(productDetailsHTML);
                    
                    // Detay modülünü göster
                    $('.product-details-modal').fadeIn(300);
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-product-details').click(function() {
                        $('.product-details-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.product-details-modal').click(function(e) {
                        if ($(e.target).hasClass('product-details-modal')) {
                            $('.product-details-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Ürün detayı alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Ürün detayı alınırken hata oluştu!");
            }
        });
    }


    // Ürün satırına tıklama olayı
    $(document).on('click', '.product-row', function(e) {
        // Eğer tıklanan element düzenleme butonu, silme butonu, toggle switch veya menüye git butonu ise işlemi durdur
        if ($(e.target).closest('.btn-edit-product, .btn-delete-product, .toggle-switch, .btn-menu').length) {
            return;
        }

        const productId = $(this).data('product-id');
        getProductDetails(productId);
    });




    function updateProduct(productId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/products/getForAdmin?productId=${productId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const product = response.data;
                              
                    let productUpdateHTML = `
                    <div class="product-update-modal" data-product-id="${product.id}">
                        <div class="product-update-content">
                            <div class="product-update-header">
                                <h2>Ürün Güncelleme</h2>
                                <span class="close-product-update">&times;</span>
                            </div>
                            <div class="product-update-body">
                                <div class="product-image-container">
                                    <img src="${product.imagePath}" alt="${product.name}" class="product-update-image" id="previewImage">

                                    <label for="productImage" class="custom-upload-button">Resim Seç</label>
                                    <input type="file" id="productImage" accept="image/*" class="image-input">
                                </div>
                                <div class="product-info">
                                    <div class="product-info-item">
                                        <div class="product-label">
                                            <strong>Ürün Adı</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="product-value product-name" value="${product.name}">
                                    </div>
                                    <div class="product-info-item">
                                        <div class="product-label">
                                            <strong>Fiyatı (₺)</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="product-value product-price price-value" value="${formatPriceInputLive(product.price.toFixed(2).replace('.', ','))}">    
                                    </div>
                                </div>
                                <button class="btn-update-product">Güncelle</button>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.product-update-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(productUpdateHTML);
                    
                    // Detay modülünü göster
                    $('.product-update-modal').fadeIn(300, function() {
                        checkIfItemsAreOnNewLine(true);
                    });
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-product-update').click(function() {
                        $('.product-update-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.product-update-modal').click(function(e) {
                        if ($(e.target).hasClass('product-update-modal')) {
                            $('.product-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Ürün bilgileri alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Ürün bilgileri alınırken hata oluştu!");
            }
        });
    }

    function formatPriceInputLive(value) {

        // Eğer kullanıcı hiçbir şey yazmadıysa (null, undefined, veya boş string) direkt boş string dönüyoruz. 
        if (!value) 
            return '';
    
        // Tüm noktaları siliyoruz. 
        value = value.replace(/\./g, '');

        // Rakam ve virgül dışında kalan her şeyi siliyoruz.
        value = value.replace(/[^\d,]/g, '');
    
        // Virgülün solundaki ve sağındaki kısımları ayırıyoruz.
        const parts = value.split(',');
    
        let integerPart = parts[0]; //Ana para kısmı
        let decimalPart = parts[1] || ''; //Kuruş kısmı
    

        //Sayıyı sağdan sola doğru 3'erli gruplar haline getirip her 3'lünün önüne bir nokta koyuyoruz.
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    

        // Eğer kullanıcı kuruş kısmını çok uzun yazdıysa, sadece ilk 2 karakterini alıyoruz.
        if (decimalPart.length > 2) {
            decimalPart = decimalPart.substring(0, 2);
        }
    
        return decimalPart.length > 0 ? `${integerPart},${decimalPart}` : integerPart;
    }
    
    // Kullanıcı yazarken CANLI formatlama
    $(document).on('input', '.price-value', function () {
        // İmlecin input içindeki tam pozisyonunu alıyoruz.
        let cursorPosition = this.selectionStart; 

        //Formatlanmadan önceki input'un karakter uzunluğunu kaydediyoruz.
        let oldLength = $(this).val().length;

        //Formatlama sonrası imleç doğru yere gelsin diye bu değerleri kaydediyoruz.
    
        // İlk, default yazılan değeri alıyoruz.
        var value = $(this).val();

        // Formatlama yapıyoruz.
        var formattedValue = formatPriceInputLive(value);
    
        // İlk değeri silip, yerine formatlanmış yeni değeri yazıyoruz.
        $(this).val(formattedValue);
    
        // Yeni formatlı değerin uzunluğunu buluyoruz.
        let newLength = formattedValue.length;

        // cursorPosition'u (yani imlecin pozisyonu), yeni uzunluk ile eski uzunluk arasındaki fark kadar kaydırıyoruz.
        cursorPosition += (newLength - oldLength);

        // İmleci kullanıcının yazmaya devam ettiği yere tekrar koyuyoruz.
        this.setSelectionRange(cursorPosition, cursorPosition);
    });
    
    // Kullanıcı input'tan çıkınca (blur) ondalıklı hale getiriyoruz.
    $(document).on('blur', '.price-value', function () {
        var value = $(this).val();
    
        // Eğer kullanıcı hiçbir şey yazmadıysa (null, undefined, veya boş string) direkt boş string dönüyoruz. 
        if (!value) 
            return;
    
        // Eğer kullanıcı virgül yazmadıysa, değerin sonuna virgül ve 00 ekliyoruz.
        if (value.indexOf(',') === -1) {
            value += ',00';
        }
    
        // Virgülün solundaki ve sağındaki kısımları ayırıyoruz.
        const parts = value.split(',');

        let integerPart = parts[0]; //Ana para kısmı
        let decimalPart = parts[1] || ''; //Kuruş kısmı
    
        // Eğer kuruş kısmı yoksa, 00 ekliyoruz.
        if (decimalPart.length === 0) {
            decimalPart = '00';
        } 
        // Eğer kuruş kısmı 1 karakterse, tek bir tane 0 ekliyoruz.
        else if (decimalPart.length === 1) {
            decimalPart += '0';
        } 
        // Eğer kuruş kısmı 2 karakterden uzunsa, sadece ilk 2 karakterini alıyoruz.
        else if (decimalPart.length > 2) {
            decimalPart = decimalPart.substring(0, 2);
        }
        
        // İlk değeri silip, yerine formatlanmış yeni değeri yazıyoruz.
        $(this).val(integerPart + ',' + decimalPart);
    });
    

    // Üründe "Düzenle" butonuna tıklandığında
    $(document).on('click', '.btn-edit-product', function(e) {
        e.stopPropagation();

        const productId = $(this).data('product-id');
        updateProduct(productId);
    });


    // Üründe "Güncelle" butonuna tıklandığında
    $(document).on('click', '.btn-update-product', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = $(this).closest('.product-update-modal').data('product-id');
        const productName = $(this).closest('.product-update-modal').find('.product-name').val();
        const productPrice = $(this).closest('.product-update-modal').find('.product-price').val();
        
        if (productName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen ürün adını giriniz!');
            return;
        }

        if (productPrice.trim() === '') {
            showToast('error', 'Hata', 'Lütfen ürünün fiyat bilgisini giriniz!');
            return;
        }

        const productImage = $('#productImage')[0].files[0];

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('price', productPrice);
        if (productImage) {
            formData.append('image', productImage);
        }
        
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/products/update?productId=${productId}`,
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Ürün başarıyla güncellendi!');
                    $('.product-update-modal').fadeOut(300, function() {
                        $(this).remove();
                    });

                    const menuId = localStorage.getItem('selectedMenuId');
                    const menuName = localStorage.getItem('selectedMenuName');

                    if (menuName === null){
                        getAllProducts();
                    }else{
                        getProductsByMenu(menuId, menuName); 
                    }
                } else {
                    showToast('error', 'Hata', 'Ürün güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Ürün güncellenirken hata oluştu!');
            }
        });
    });


    function createProduct(showMenuList) {
        let productCreateHTML = `
        <div class="product-create-modal">
            <div class="product-create-content">
                <div class="product-create-header">
                    <h2>Ürün Ekleme</h2>
                    <span class="close-product-create">&times;</span>
                </div>
                <div class="product-create-body">
                    <div class="product-image-container">
                        <img src="../icons/default-menu-image-placeholder.png" alt="default-product-image" class="product-create-image" id="previewImage">
                        <label for="productImage" class="custom-upload-button">Resim Seç</label>
                        <input type="file" id="productImage" accept="image/*" class="image-input">
                    </div>
                    <div class="product-info">
                        ${showMenuList ? `
                        <div class="product-info-item">
                            <div class="product-label">
                                <strong>Menü Listesi</strong> 
                                <span>:</span>
                            </div>
                            <select class="product-value" id="menuSelect">
                            </select>
                        </div>` : ''}
                        <div class="product-info-item">
                            <div class="product-label">
                                <strong>Ürün Adı</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="product-value product-name">
                        </div>
                        <div class="product-info-item">
                            <div class="product-label">
                                <strong>Fiyatı (₺)</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="product-value product-price price-value">    
                        </div>
                    </div>
                    <button class="btn-add-product">Ekle</button>
                </div>
            </div>
        </div>`;
        
        
        // Detay modülünü ekle
        $('body').append(productCreateHTML);
        
        // Detay modülünü göster
        $('.product-create-modal').fadeIn(300, function() {
            checkIfItemsAreOnNewLine(false);
        });
        
        // Kapatma butonuna tıklandığında
        $('.close-product-create').click(function() {
            $('.product-create-modal').fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        // Modül dışına tıklandığında kapat
        $('.product-create-modal').click(function(e) {
            if ($(e.target).hasClass('product-create-modal')) {
                $('.product-create-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    }


    function getMenusForAddProduct() {
        const token = localStorage.getItem('token');

        if ($('#menuSelect option').length === 0) {
            $.ajax({
                url: 'https://eatwell-api.azurewebsites.net/api/mealCategories/getAllForAdmin',
                type: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function(response) {
                    const menus = response.data;
    
                    if (menus.length > 0){
                        menus.forEach(menu =>{
                            $('#menuSelect').append(`<option value="${menu.id}">${menu.name}</option>`);
                        })
                    }else {
                        $('#menuSelect').append('<option disabled selected>Menü bulunamadı.</option>');

                        showToast('error', 'Hata', 'Lütfen öncelikle menü ekleyiniz!');
                    }
                },
                error: function(xhr) {
                    const errorMessage = xhr.responseJSON?.Message;
                    showToast('error', 'Hata', errorMessage ? errorMessage : "Menüler alınırken hata oluştu!");
                }
            })
        }
    }


    // Ürün listesinde "Ürün Ekle" butonuna tıklanıp menü listesi görüntülendiğinde 
    $(document).on('click', '#menuSelect', function(e) {
        getMenusForAddProduct();
    });


    // Menüde "Ürün Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-create-product', function(e) {
        e.stopPropagation();

        const params = new URLSearchParams(window.location.search);
        const menuId = params.get('menuId');
        const showMenuList = menuId === null; // menuId varsa menü listesini göstermiyoruz

        createProduct(showMenuList);
    });


    // Üründe "Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-add-product', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const productName = $(this).closest('.product-create-modal').find('.product-name').val();
        const productPrice = $(this).closest('.product-create-modal').find('.product-price').val();
        const productImage = $('#productImage')[0].files[0];
        
        const formData = new FormData();

        if (productImage) {
            formData.append('image', productImage);
        }
        else{
            showToast('error', 'Hata', 'Lütfen ürün resmi seçiniz!');
            return;
        }


        // menuId varsa demektir ki Ürünler sayfasında ürün ekleme işlemi yapılıyordur. 
        // Bu yüzden localStorage'da menuId değeri bulunmaz. Menü listesinden menuId değerini almamız gerekir.
        
        const menuName = localStorage.getItem('selectedMenuName');
        const params = new URLSearchParams(window.location.search);
        let menuId = params.get('menuId');

        const isExistsMenuId = menuId === null; // menuId varsa menü listesini göstermiyoruz

        if (isExistsMenuId) {
            menuId = $('#menuSelect').val();

            if (menuId === null ){
                showToast('error', 'Hata', 'Lütfen menü seçiniz!');
                return;
            }
        }


        if (productName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen ürün adını giriniz!');
            return;
        }


        if (productPrice.trim() === '') {
            showToast('error', 'Hata', 'Lütfen ürünün fiyat bilgisini giriniz!');
            return;
        }

        formData.append('name', productName);
        formData.append('price', productPrice);
        formData.append('mealCategoryId', menuId);

        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/products/add`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Ürün başarıyla eklendi!');
                    $('.product-create-modal').fadeOut(300, function() {
                        $(this).remove();
                    });

                    if (menuName === null){
                        getAllProducts();
                    }else{
                        getProductsByMenu(menuId, menuName); 
                    }
                } else {
                    showToast('error', 'Hata', response.message);
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Menü eklenirken hata oluştu!");
            }
        });
    });

    
    // Resim seçildiğinde önizleme gösterme (Ürün için)
    $(document).on('change', '#productImage', function(e) {
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


    // Üründe "Sil" butonuna tıklandığında
    $(document).on('click', '.btn-delete-product', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = $(this).closest('.product-row').data('product-id');
        
        // SweetAlert2 ile özelleştirilmiş onay kutusu
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText: 'İptal',
            customClass: {
                popup: 'swal2-popup-custom',
                icon: 'swal2-icon-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                
                $.ajax({
                    url: `https://eatwell-api.azurewebsites.net/api/products/delete?productId=${productId}`,
                    type: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function(response) {
                        if (response.success) {
                            showToast('success', 'Başarılı', 'Ürün başarıyla silindi!');

                            $('.product-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });

                            const menuId = localStorage.getItem('selectedMenuId');
                            const menuName = localStorage.getItem('selectedMenuName');

                            getProductsByMenu(menuId, menuName); // Ürün listesini yenile
                        } else {
                            showToast('error', 'Hata', 'Ürün silinirken hata oluştu!');
                        }
                    },
                    error: function(xhr) {
                        const errorMessage = xhr.responseJSON?.Message;
                        showToast('error', 'Hata', errorMessage ? errorMessage : 'Ürün silinirken hata oluştu!');
                    }
                });
            }
        });
    });



    function deleteOrRestoreProduct(productId) {
        const token = localStorage.getItem('token');
        const toggleSwitch = $(`.toggle-switch input[data-product-id="${productId}"]`);

        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/products/setDeleteOrRestore?productId=${productId}`,
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
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Ürün durumunu değiştirirken hata oluştu!');
                 // Toggle switch'i eski haline getir
                 toggleSwitch.prop('checked', !toggleSwitch.prop('checked'));
            }
        });
    }

    // Ürün durumunu değiştirme olayı
    $(document).on('change', '.product-toggle-switch input', function(e) {
        e.stopPropagation(); // Event'in yayılmasını durduruyoruz yani ürün detayının gelmesini engelliyoruz.

        const productId = $(this).data('product-id');
        deleteOrRestoreProduct(productId);
    });

    // Toggle switch'e tıklama olayını engelle
    $(document).on('click', '.product-toggle-switch', function(e) {
        e.stopPropagation();
    });





    // Şehirleri getiren fonksiyon
    function getCities() {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/cities/getAll',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Dashboard içeriğini temizle
                $('.dashboard-content').empty();
                
                // Şehirler için HTML yapısı
                let citiesHTML = `
                <div class="cities-container">
                    <div class="cities-header">
                        <h2>Şehir Listesi</h2>
                        <button class="btn-all-branches">
                             <i class="fa-solid fa-building"></i>
                            Tüm Şubeler
                        </button>
                    </div>
                    <div class="cities-body">
                        <table class="cities-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Şehir Adı</th>
                                    <th>Şube Sayısı</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody id="citiesTableBody">
                            </tbody>
                        </table>
                        <!-- Sayfalama kontrolleri -->
                        <div class="pagination-container">
                            <div class="pagination">
                                <button id="prevCityPage" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
                                <span id="cityPageInfo">Sayfa 1</span>
                                <button id="nextCityPage" class="pagination-btn"><i class="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                // Şehirleri dashboard'a ekle
                $('.dashboard-content').append(citiesHTML);
                
                // Sayfalama için gerekli değişkenler
                let currentPage = 1; // Mevcut sayfa numarası
                const itemsPerPage = 10; // Her sayfada gösterilecek şehir sayısı
                const totalCities = response.data.length; // Toplam şehir sayısı
                const totalPages = Math.ceil(totalCities / itemsPerPage) ? Math.ceil(totalCities / itemsPerPage) : 1 ; // Toplam sayfa sayısı

                // Şehirleri sayfalara böl ve göster
                function displayCities(page) {
                    // Gösterilecek şehirlerin başlangıç ve bitiş indekslerini hesapla
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    // İlgili sayfadaki şehirleri seç
                    const citiesToShow = response.data.slice(startIndex, endIndex);
                    
                    let citiesTableHTML = '';
                    
                    // Seçilen şehirleri tabloya ekle
                    if (citiesToShow.length > 0) {
                        citiesToShow.forEach(city => {
                            citiesTableHTML += `
                                <tr class="city-row" data-city-id="${city.id}">
                                    <td>${city.id}</td>
                                    <td>${city.name}</td>
                                    <td>${city.branchCount}</td>
                                    <td>
                                        <button class="btn-branches-city" data-city-id="${city.id}" data-city-name="${city.name}">
                                            <i class="fa-solid fa-list"></i>
                                            Şubeleri Gör
                                        </button>
                                    </td>
                                </tr>`;
                        });
                    } 
                    
                    // Tabloyu güncelle
                    $('#citiesTableBody').html(citiesTableHTML);
                    // Sayfa bilgisini güncelle
                    $('#cityPageInfo').text(`Sayfa ${page} / ${totalPages}`);
                    
                    // Sayfalama butonlarının durumunu güncelle
                    $('#prevCityPage').prop('disabled', page === 1); // İlk sayfada geri butonu devre dışı
                    $('#nextCityPage').prop('disabled', page === totalPages); // Son sayfada ileri butonu devre dışı
                }
                
                // İlk sayfayı göster
                displayCities(currentPage);
                
                // Önceki sayfa butonuna tıklama olayı
                $('#prevCityPage').click(function() {
                    if (currentPage > 1) {
                        currentPage--;
                        displayCities(currentPage);
                    }
                });
                
                // Sonraki sayfa butonuna tıklama olayı
                $('#nextCityPage').click(function() {
                    if (currentPage < totalPages) {
                        currentPage++;
                        displayCities(currentPage);
                    }
                });
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Şehirler alınırken hata oluştu!');
            }
        });
    }
    

    // Navbar'daki "Şehir ve Şubeler" seçeneğine tıklandığında
    $('.sidenav a:contains("Şehir ve Şubeler")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'cities' }, 'Şehirler', '?page=cities'); 

        getCities();
    });



    // Şubeleri getiren ortak fonksiyon
    function renderBranchesList(data, options = {}) {
        const {
            title = 'Şube Listesi',
            showGoToCityButton = false
        } = options;
    
        // Ortak HTML yapısı
        $('.dashboard-content').empty();

        let html = `
        <div class="branches-container">
            <div class="branches-header">
                <h2>${title}</h2>
                <button class="btn-create-branch">
                    <i class="fa-solid fa-plus"></i>
                    Şube Ekle
                </button>
            </div>
            <div class="branches-body">
                <table class="branches-table">
                    <thead>
                        <tr>
                            ${showGoToCityButton ? `<th class="city-col">Şehir</th>` : '' }
                            <th class="branch-name-col">Şube Adı</th>
                            <th class="address-col">Adres</th>
                            <th class="email-col">E-posta</th>
                            <th class="actions-col">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="branchesTableBody"></tbody>
                </table>
                <div class="pagination-container">
                    <div class="pagination">
                        <button id="prevBranchPage" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
                        <span id="branchPageInfo">Sayfa 1</span>
                        <button id="nextBranchPage" class="pagination-btn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        </div>`;

        $('.dashboard-content').append(html);
    
        let currentPage = 1;
        const itemsPerPage = 10;
        const totalBranches = data.length;
        const totalPages = Math.ceil(totalBranches / itemsPerPage) || 1;
    
        function displayBranches(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const branchesToShow = data.slice(start, end);
    
            let tableHTML = '';
            if (branchesToShow.length > 0) {

                branchesToShow.forEach(branch => {

                    tableHTML += `
                    <tr class="branch-row" data-branch-id="${branch.id}">
                        ${showGoToCityButton ? `<td>${branch.cityName}</td>` : '' }
                        <td>${branch.name}</td>
                        <td>
                            <span class="truncate">${branch.address}</span>
                        </td>
                        <td>${branch.email}</td>
                        <td>
                            <div class="table-actions-scroll">
                                <button class="btn-delete-branch" data-branch-id="${branch.id}">
                                    <i class="fa-solid fa-trash"></i>
                                    Sil
                                </button>
                                <button class="btn-edit-branch" data-branch-id="${branch.id}">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                    Düzenle
                                </button>
                                ${showGoToCityButton ? `
                                    <button class="btn-city" data-city-id="${branch.cityId}" data-city-name="${branch.cityName}">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                        Şehre Git
                                    </button>` : ''
                                }
                            </div>
                        </td>
                    </tr>`;
                });
            } else {
                tableHTML = `<tr><td colspan="5" class="empty-table-row">Henüz şube bulunmamaktadır.</td></tr>`;
            }
    
            $('#branchesTableBody').html(tableHTML);
            $('#branchPageInfo').text(`Sayfa ${page} / ${totalPages}`);
            $('#prevBranchPage').prop('disabled', page === 1);
            $('#nextBranchPage').prop('disabled', page === totalPages);
        }
    
        displayBranches(currentPage);
    
        $('#prevBranchPage').click(() => {
            if (currentPage > 1) {
                currentPage--;
                displayBranches(currentPage);
            }
        });
    
        $('#nextBranchPage').click(() => {
            if (currentPage < totalPages) {
                currentPage++;
                displayBranches(currentPage);
            }
        });
    }


    // Şehirlerin şubelerini getiren fonksiyon
    function getBranchesByCity(cityId, cityName) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/branches/getAllForAdminByCityId?cityId=${cityId}`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderBranchesList(response.data, { title: cityName, showGoToCityButton: false }),
            error: (xhr) => showToast('error', 'Hata', xhr.responseJSON?.Message || 'Şubeler getirilirken hata oluştu!')
        });
    }


    // Şehirlerde "Şubeleri Gör" butonuna tıklandığında
    $(document).on('click', '.btn-branches-city', function(e) {
        e.stopPropagation();

        const cityId = $(this).data('city-id');
        const cityName = $(this).data('city-name');

        // Seçilen şehri geçmişe kaydediyoruz
        selectEntity(cityId, cityName, Entity.CITY);

        localStorage.setItem('selectedCityId', cityId);
        localStorage.setItem('selectedCityName', cityName);

        getBranchesByCity(cityId, cityName);
    });



    function getAllBranches() {
        const token = localStorage.getItem('token');

        $.ajax({
            url: 'https://eatwell-api.azurewebsites.net/api/branches/getAllForAdmin',
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderBranchesList(response.data, { title: 'Şube Listesi', showGoToCityButton: true }),
            error: (xhr) => showToast('error', 'Hata', xhr.responseJSON?.Message || 'Şubeler alınırken hata oluştu!')
        });
    }


    // Şehir listesindeki "Tüm Şubeler" butonuna tıklandığında
    $(document).on('click', '.btn-all-branches', function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'branches' }, 'Şubeler', '?page=branches'); 

        getAllBranches();
    });



    // Şubeler listesinde "Şehre Git" butonuna tıklandığında
    $(document).on('click', '.btn-city', function(e) {
        e.stopPropagation();

        const cityId = $(this).data('city-id');
        const cityName = $(this).data('city-name');

        // Seçilen şehri geçmişe kaydediyoruz
        selectEntity(cityId, cityName, Entity.CITY);

        localStorage.setItem('selectedCityId', cityId);
        localStorage.setItem('selectedCityName', cityName);

        getBranchesByCity(cityId, cityName);
    });



    // Şube detaylarını getiren fonksiyon
    function getBranchDetails(branchId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/branches/getForAdmin?branchId=${branchId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const branch = response.data;
                                        
                    let branchDetailsHTML = `
                    <div class="branch-details-modal">
                        <div class="branch-details-content">
                            <div class="branch-details-header">
                                <h2>Şube Detayı</h2>
                                <span class="close-branch-details">&times;</span>
                            </div>
                            <div class="branch-details-body">
                                <div class="branch-info">
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Şube Adı</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.name}</p>
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Adres</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.address}</p>   
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Email</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.email}</p>    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Telefon</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.phone}</p>   
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Web Site</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.webSite || '<span style="color: gray;">—</span>'}</p> 
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Facebook</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.facebook || '<span style="color: gray;">—</span>'}</p>    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Instagram</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.instagram || '<span style="color: gray;">—</span>'}</p>    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Twitter</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.twitter || '<span style="color: gray;">—</span>'}</p>    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Gmail</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="branch-value">${branch.gmail || '<span style="color: gray;">—</span>' }</p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.branch-details-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(branchDetailsHTML);
                    
                    // Detay modülünü göster
                    $('.branch-details-modal').fadeIn(300);
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-branch-details').click(function() {
                        $('.branch-details-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.branch-details-modal').click(function(e) {
                        if ($(e.target).hasClass('branch-details-modal')) {
                            $('.branch-details-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Şube detayı alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Şube detayı alınırken hata oluştu!');
            }
        });
    }


    // Şube satırına tıklama olayı
    $(document).on('click', '.branch-row', function(e) {
        // Eğer tıklanan element düzenleme butonu, silme butonu veya şehre git butonu ise işlemi durdur
        if ($(e.target).closest('.btn-edit-branch, .btn-delete-product, .btn-city').length) {
            return;
        }

        const branchId = $(this).data('branch-id');
        getBranchDetails(branchId);
    });



    function updateBranch(branchId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/branches/getForAdmin?branchId=${branchId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const branch = response.data;

                    let branchUpdateHTML = `
                    <div class="branch-update-modal" data-branch-id="${branch.id}">
                        <div class="branch-update-content">
                            <div class="branch-update-header">
                                <h2>Şube Güncelleme</h2>
                                <span class="close-branch-update">&times;</span>
                            </div>
                            <div class="branch-update-body">
                                <div class="branch-info">
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Şube Adı</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-name" value="${branch.name}">
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Adres</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-address" value="${branch.address}">    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>E-posta</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-email" value="${branch.email}">    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Telefon</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" id="branchPhone" class="branch-value branch-phone" placeholder="0___ ___ __ __"  value="${branch.phone}">    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Web Site</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-web-site" value="${branch.webSite}">    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Facebook</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-facebook" value="${branch.facebook === null ? '' : branch.facebook}">    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Instagram</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-instagram" value="${branch.instagram === null ? '' : branch.instagram}">    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Twitter</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-twitter" value="${branch.twitter === null ? '' : branch.twitter}">    
                                    </div>
                                    <div class="branch-info-item">
                                        <div class="branch-label">
                                            <strong>Gmail</strong> 
                                            <span>:</span>
                                        </div>
                                        <input type="text" class="branch-value branch-gmail" value="${branch.gmail === null ? '' : branch.gmail}">    
                                    </div>
                                    <button class="btn-update-branch">Güncelle</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.branch-update-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(branchUpdateHTML);
                    
                    // Detay modülünü göster
                    $('.branch-update-modal').fadeIn(300, function() {
                        checkIfItemsAreOnNewLine(true);
                    });
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-branch-update').click(function() {
                        $('.branch-update-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.branch-update-modal').click(function(e) {
                        if ($(e.target).hasClass('branch-update-modal')) {
                            $('.branch-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Şube bilgileri getirilirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Şube bilgileri getirilirken hata oluştu!");
            }
        });
    }


    $(document).on('input', '#branchPhone', function () {
        
        let $this = $(this);
        let inputElement = this;
        
        // İmlecin mevcut pozisyonunu alıyoruz
        let cursorPosition = inputElement.selectionStart;
        let oldValue = $this.val();
        let oldLength = oldValue.length;
        
        // Eğer input tamamen boşsa, formatlama yapmadan çık
        if (oldValue.trim() === '') {
            return;
        }
        
        // Eğer inputta rakam dışı (boşluk hariç) karakter varsa uyarı veriyoruz
        if (/[^0-9\s]/.test(oldValue)) {
            showToast('error', 'Hata', 'Lütfen yalnızca sayısal karakter kullanın.');
        }
        
        // Tüm rakamları al (boşluk dahil değil)
        let digitsOnly = oldValue.replace(/\D/g, '').substring(0, 12);
        
        
        // En başta her zaman sıfır olmasını sağlıyoruz
        if (digitsOnly.charAt(0) !== '0') {
            digitsOnly = '0' + digitsOnly; // Eğer sıfır yoksa başa ekliyoruz
        }
        
        // Formatlama: 0xxx xxx xx xx
        let formatted = '';
        if (digitsOnly.length > 0) formatted += digitsOnly.substring(0, 4);
        if (digitsOnly.length > 4) formatted += ' ' + digitsOnly.substring(4, 7);
        if (digitsOnly.length > 7) formatted += ' ' + digitsOnly.substring(7, 9);
        if (digitsOnly.length > 9) formatted += ' ' + digitsOnly.substring(9, 11);
        
        $(this).val(formatted);
        
        // Yeni uzunluğu alıp imleç pozisyonunu ayarlıyoruz
        let newLength = formatted.length;
        cursorPosition += newLength - oldLength;
        inputElement.setSelectionRange(cursorPosition, cursorPosition);
    });
    
    
    // Sıfırın silinmesini engelliyoruz
    $(document).on('keydown', '#branchPhone', function (e) {
        let input = $(this).val();
        
        // Eğer imleç 0'ın olduğu yerdeyse ve silme tuşuna basılmışsa (Backspace veya Delete)
        let cursorPosition = this.selectionStart;
        
        if ((e.key === 'Backspace' && cursorPosition === 1) ||
        (e.key === 'Delete' && cursorPosition === 0)) {
            
            // İlk karakter 0 ise silinmesini engelle
            if (input.charAt(0) === '0') {
                e.preventDefault();
            }
        }
    });


    // Şubede "Düzenle" butonuna tıklandığında
    $(document).on('click', '.btn-edit-branch', function(e) {
        e.stopPropagation();

        const branchId = $(this).data('branch-id');
        updateBranch(branchId);
    });
    

    
    // Şubede "Güncelle" butonuna tıklandığında
    $(document).on('click', '.btn-update-branch', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const updateModal = $(this).closest('.branch-update-modal');
        
        const branchId = updateModal.data('branch-id');
        const branchName = updateModal.find('.branch-name').val();
        const branchAddress = updateModal.find('.branch-address').val();
        const branchEmail = updateModal.find('.branch-email').val();
        const branchPhone = updateModal.find('.branch-phone').val();
        const branchWebSite = updateModal.find('.branch-web-site').val();
        const branchFacebook = updateModal.find('.branch-facebook').val();
        const branchInstagram = updateModal.find('.branch-instagram').val();
        const branchTwitter = updateModal.find('.branch-twitter').val();
        const branchGmail = updateModal.find('.branch-gmail').val();
        const phoneRegex = /^0\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
        
        if (branchName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şube adını giriniz!');
            return;
        }

        if (branchAddress.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şubenin adresini giriniz!');
            return;
        }

        if (branchEmail.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şubenin e-posta adresini giriniz!');
            return;
        }

        if (branchPhone.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şubenin telefon numarasını giriniz!');
            return;
        }

        if (!phoneRegex.test(branchPhone.trim())) {
            showToast('error', 'Hata', 'Lütfen geçerli bir telefon numarası giriniz!');
            return;
        }
        
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/branches/update?branchId=${branchId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                name: branchName,
                address: branchAddress,
                email: branchEmail,
                phone: branchPhone,
                webSite: branchWebSite,
                facebook: branchFacebook,
                instagram: branchInstagram,
                twitter: branchTwitter,
                gmail: branchGmail
            }),
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Şube başarıyla güncellendi!');
                    
                    $('.branch-update-modal').fadeOut(300, function() {
                        $(this).remove();
                    });

                    const cityId = localStorage.getItem('selectedCityId');
                    const cityName = localStorage.getItem('selectedCityName');

                    getBranchesByCity(cityId, cityName);
                } else {
                    showToast('error', 'Hata', 'Şube güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Şube güncellenirken hata oluştu!');
            }
        });
    });



    // Şubede "Sil" butonuna tıklandığında
    $(document).on('click', '.btn-delete-branch', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const branchId = $(this).closest('.branch-row').data('branch-id');
        
        // SweetAlert2 ile özelleştirilmiş onay kutusu
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu şubeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText: 'İptal',
            customClass: {
                popup: 'swal2-popup-custom',
                icon: 'swal2-icon-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                
                $.ajax({
                    url: `https://eatwell-api.azurewebsites.net/api/branches/delete?branchId=${branchId}`,
                    type: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function(response) {
                        if (response.success) {
                            showToast('success', 'Başarılı', 'Şube başarıyla silindi!');

                            $('.branch-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });

                            const cityId = localStorage.getItem('selectedCityId');
                            const cityName = localStorage.getItem('selectedCityName');

                            getBranchesByCity(cityId, cityName); // Şube listesini yenile
                        } else {
                            showToast('error', 'Hata', 'Şube silinirken hata oluştu!');
                        }
                    },
                    error: function(xhr) {
                        const errorMessage = xhr.responseJSON?.Message;
                        showToast('error', 'Hata', errorMessage ? errorMessage : 'Şube silinirken hata oluştu!');
                    }
                });
            }
        });
    });



    function createBranch(showCityList) {
        
        let branchCreateHTML = `
        <div class="branch-create-modal">
            <div class="branch-create-content">
                <div class="branch-create-header">
                    <h2>Şube Ekleme</h2>
                    <span class="close-branch-create">&times;</span>
                </div>
                <div class="branch-create-body">
                    <div class="branch-info">
                        ${showCityList ? `
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Şehirler</strong> 
                                <span>:</span>
                            </div>
                            <select class="branch-value" id="citySelect">
                            </select>
                        </div>` : ''}
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Şube Adı</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="branch-value branch-name">
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Adres</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="branch-value branch-address">    
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>E-posta</strong> 
                                <span>:</span>
                            </div>
                            <input type="email" class="branch-value branch-email">    
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Telefon</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" id="branchPhone" class="branch-value branch-phone" placeholder="0___ ___ __ __" >    
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Web Site</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="branch-value branch-web-site">    
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Facebook</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="branch-value branch-facebook">    
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Instagram</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="branch-value branch-instagram">    
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Twitter</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="branch-value branch-twitter">    
                        </div>
                        <div class="branch-info-item">
                            <div class="branch-label">
                                <strong>Gmail</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="branch-value branch-gmail">    
                        </div>
                        <button class="btn-add-branch">Ekle</button>
                    </div>
                </div>
            </div>
        </div>`;
        
        // Detay modülünü ekle
        $('body').append(branchCreateHTML);
        
        if ($('#citySelect').length > 0) $('.btn-add-branch').css('margin-left', 'auto');

        // Detay modülünü göster
        $('.branch-create-modal').fadeIn(300);
        
        // Kapatma butonuna tıklandığında
        $('.close-branch-create').click(function() {
            $('.branch-create-modal').fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        // Modül dışına tıklandığında kapat
        $('.branch-create-modal').click(function(e) {
            if ($(e.target).hasClass('branch-create-modal')) {
                $('.branch-create-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    }


    function getCitiesForAddBranch() {
        const token = localStorage.getItem('token');

        if ($('#citySelect option').length === 0) {
            $.ajax({
                url: 'https://eatwell-api.azurewebsites.net/api/cities/getAll',
                type: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: function(response) {
                    const cities = response.data;
    
                    cities.forEach(city =>{
                        $('#citySelect').append(`<option value="${city.id}">${city.name}</option>`);
                    })
                },
                error: function(xhr) {
                    const errorMessage = xhr.responseJSON?.Message;
                    showToast('error', 'Hata', errorMessage ? errorMessage : "Şehirler alınırken hata oluştu!");
                }
            })
        }
    }


    // Şube listesinde "Şube Ekle" butonuna tıklanıp şehir listesi görüntülendiğinde 
    $(document).on('click', '#citySelect', function(e) {
        getCitiesForAddBranch();
    });



    // Şehirde "Şube Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-create-branch', function(e) {
        e.stopPropagation();

        const params = new URLSearchParams(window.location.search);
        const cityId = params.get('cityId');
        const showCityList = cityId === null; // cityId varsa şehir listesini göstermiyoruz

        createBranch(showCityList);
    });



    // Şubede "Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-add-branch', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const createModal = $(this).closest('.branch-create-modal');

        const params = new URLSearchParams(window.location.search);
        let cityId = params.get('cityId');

        const isExistsCityId = cityId === null; // cityId varsa şehir listesini göstermiyoruz

        if (isExistsCityId) {
            cityId = $('#citySelect').val();

            if (cityId === null ){
                showToast('error', 'Hata', 'Lütfen şehir seçiniz!');
                return;
            }
        }

        const branchName = createModal.find('.branch-name').val();
        const branchAddress = createModal.find('.branch-address').val();
        const branchEmail = createModal.find('.branch-email').val();
        const branchPhone = createModal.find('.branch-phone').val();
        const branchWebSite = createModal.find('.branch-web-site').val();
        const branchFacebook = createModal.find('.branch-facebook').val();
        const branchInstagram = createModal.find('.branch-instagram').val();
        const branchTwitter = createModal.find('.branch-twitter').val();
        const branchGmail = createModal.find('.branch-gmail').val();
        const phoneRegex = /^0\d{3}\s\d{3}\s\d{2}\s\d{2}$/;

        if (branchName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şube adını giriniz!');
            return;
        }

        if (branchAddress.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şubenin adresini giriniz!');
            return;
        }

        if (branchEmail.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şubenin e-posta adresini giriniz!');
            return;
        }

        if (branchPhone.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şubenin telefon numarasını giriniz!');
            return;
        }

        if (!phoneRegex.test(branchPhone.trim())) {
            showToast('error', 'Hata', 'Lütfen geçerli bir telefon numarası giriniz!');
            return;
        }
        
        
        const cityName = localStorage.getItem('selectedCityName');
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/branches/add`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                cityId: cityId,
                name: branchName,
                address: branchAddress,
                email: branchEmail,
                phone: branchPhone,
                webSite: branchWebSite,
                facebook: branchFacebook,
                instagram: branchInstagram,
                twitter: branchTwitter,
                gmail: branchGmail
            }),
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Şube başarıyla eklendi!');

                    $('.branch-create-modal').fadeOut(300, function() {
                        $(this).remove();
                    });

                    if (cityName === null){
                        getAllBranches();
                    }else{
                        getBranchesByCity(cityId, cityName); 
                    }
                } else {
                    showToast('error', 'Hata', response.message);
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Şube eklenirken hata oluştu!");
            }
        });
    });


    

    // Sayfa ilk açıldığında, yüklendiğinde
    window.addEventListener('load', function() {

        //URL’deki parametreleri (?page=xxx) okuyoruz
        const params = new URLSearchParams(window.location.search);

        //Tarayıcının adres çubuğunda yazan URL'den, query string değerini (?page=menus, ?page=products gibi) alıyoruz.
        const page = params.get('page');


        //URL’de hangi "page" değeri varsa ona göre yönlendiriyoruz...
        if (page === 'menus') {

            //Tarayıcı geçmişinde sahte bir adım (menus) oluşturuyoruz.
            //Tarayıcı sekmesinin başlığı 'Menüler' oluyor.
            // Ve URL'de ?page=menus yazıyor.
            history.replaceState({ page: 'menus' }, 'Menüler', '?page=menus');

            getMenus();

        } else if (page === 'productsByMenu') {
            const menuId = localStorage.getItem('selectedMenuId');
            const menuName = localStorage.getItem('selectedMenuName');
            
            history.replaceState({ page: 'productsByMenu' }, 'Ürünler', `?page=productsByMenu&menuId=${menuId}`);
            
            getProductsByMenu(menuId, menuName);

        } else if (page === 'users') {
            history.replaceState({ page: 'users' }, 'Kullanıcılar', `?page=users`);

            getUsers();

        }else if (page === 'products') {
            history.replaceState({ page: 'products' }, 'Ürünler', `?page=products`);

            getAllProducts();

        }else if (page === 'cities') {
            history.replaceState({ page: 'cities' }, 'Şehirler', '?page=cities'); 

            getCities();

        }else if (page === 'branchesByCity') {
            const cityId = localStorage.getItem('selectedCityId');
            const cityName = localStorage.getItem('selectedCityName');

            history.replaceState({ page: 'branchesByCity' }, 'Şubeler', `?page=branchesByCity&cityId=${cityId}`);

            getBranchesByCity(cityId, cityName);

        }else if (page === 'branches') {
            history.replaceState({ page: 'branches' }, 'Şubeler', `?page=branches`);

            getAllBranches();

        }else {
            // Hiç page değeri yoksa dashboard'u yükle.

            //Tarayıcı geçmişinde sahte bir adım (dashboard) oluşturuyoruz
            //URL temiz oluyor (admin-panel.html gibi).
            history.replaceState({ page: 'dashboard' }, '', window.location.pathname);

            getStatistics();
        }
    });



    // localStorage’dan daha önce tuttuğumuz menuHistory verisini alıyoruz.
    // Ve bu veri string olduğu için JSON.parse ile tekrar dizi (array) haline getiriyoruz.
    // Eğer hiç veri yoksa (yani null dönerse), boş bir dizi ([]) başlatıyoruz.
    let menuHistory = JSON.parse(localStorage.getItem('menuHistory')) || [];
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];

    // Şu an kullanıcı hangi menüde bulunuyor, onu takip edebilmek için bir indeks değeri tutuyoruz.
    // localStorage'dan alıyoruz, yoksa dizinin en son elemanını varsayıyoruz.
    let menuCurrentIndex = parseInt(localStorage.getItem('menuHistoryIndex')) || (menuHistory.length - 1);
    let cityCurrentIndex = parseInt(localStorage.getItem('cityHistoryIndex')) || (cityHistory.length - 1);


    const Entity = {
        MENU: 0,
        CITY: 1
    };


    // Bu fonksiyon, kullanıcı farklı bir menü veya şehir seçtiğinde çağrılır.
    function selectEntity(entityId, entityName, selectedEntity) {

        // Seçilen yeni id ve adıyla birlikte nesne oluşturulur
        const newEntity = { id: entityId, name: entityName };

        let entityHistory;
        let entityCurrentIndex;

        // Seçilen nesnenin tipi menü ise, ilgili geçmiş ve indeks bilgileri alınır.
        if (selectedEntity === Entity.MENU){
            entityHistory = menuHistory;
            entityCurrentIndex = menuCurrentIndex;

        } else{
            // Aksi halde şehir geçmişi ve indeksi alınır
            entityHistory = cityHistory;
            entityCurrentIndex = cityCurrentIndex;
        }

        // Eğer mevcut index dizinin sonundaysa normal şekilde devam eder.
        // Ancak kullanıcı geri gittikten sonra başka bir menüye geçerse,
        // ileriye ait geçmişi siliyoruz (tarayıcı mantığına benzer şekilde).
        if (entityCurrentIndex < entityHistory.length - 1) {
            entityHistory = entityHistory.slice(0, entityCurrentIndex + 1);
        }

        // Yeni seçilen nesneyi geçmişe ekliyoruz.
        entityHistory.push(newEntity);

        // Geçerli konumu güncelliyoruz (dizinin sonu artık yeni konumdur).
        entityCurrentIndex = entityHistory.length - 1;

        // Geçici olarak kullanılan entityHistory ve entityCurrentIndex değişkenlerinde yapılan değişiklikleri, 
        // asıl cityHistory, cityCurrentIndex gibi gerçek uygulama durumunu yöneten değişkenlere geri yazmalıyız.
        // Çünkü entityHistory ve entityCurrentIndex sadece birer kopya referans gibi davranıyor. 
        // Asıl değişkenler (menuHistory, cityHistory, vs.) doğrudan bu isimlerle güncellenmediği sürece, 
        // sadece bu geçici değişkenlerde yaptığımız değişiklikler uygulamanın durumunu değiştirmez.
        if (selectedEntity === Entity.MENU){
            menuHistory = entityHistory;
            menuCurrentIndex = entityCurrentIndex;
            updateMenuNavigationState(entityId)

        } else{
            cityHistory = entityHistory;
            cityCurrentIndex = entityCurrentIndex;
            updateCityNavigationState(entityId)
        }
    }


    function updateMenuNavigationState(menuId){
        // localStorage’a yeni geçmişi ve güncel indeksi kaydediyoruz.
        localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
        localStorage.setItem('menuHistoryIndex', menuCurrentIndex);

        // URL'yi güncelliyoruz.
        history.pushState({ page: 'productsByMenu' }, 'Ürünler', `?page=productsByMenu&menuId=${menuId}`);
    }


    function updateCityNavigationState(cityId){
        // localStorage’a yeni geçmişi ve güncel indeksi kaydediyoruz.
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
        localStorage.setItem('cityHistoryIndex', cityCurrentIndex);

        // URL'yi güncelliyoruz.
        history.pushState({ page: 'branchesByCity' }, 'Şubeler', `?page=branchesByCity&cityId=${cityId}`);
    }


    // Bu metot sayesinde, kullanıcı geri tuşuna bastığında doğru şekilde bir önceki menü veya şehre döner.
    // Ve geçmişi düzgün yöneterek daha kontrollü bir kullanıcı deneyimi sağlanır.
    function goBackToPreviousEntity(currentIndex, selectedEntity) {

        // Eğer kullanıcı daha önce bir menü veya şehri ziyaret etmişse (yani index 0'dan büyükse) geri gidiyoruz.
        if (currentIndex > 0) {

            // İndeks değerini 1 azaltarak bir önceki menü veya şehri hedefliyoruz.
            currentIndex--;

            if (selectedEntity === Entity.MENU){

                // İlgili menüyü geçmiş dizisinden alıyoruz.
                const previousMenu = menuHistory[currentIndex];
    
                // Eğer geçerli bir menü varsa, o menünün ürünlerini getiriyoruz.
                if (previousMenu) {
                    getProductsByMenu(previousMenu.id, previousMenu.name);
    
                    // Güncel index değerini localStorage’a kaydediyoruz.
                    localStorage.setItem('menuHistoryIndex', currentIndex);
                }

            } else{
                
                // İlgili şehri geçmiş dizisinden alıyoruz.
                const previousCity = cityHistory[currentIndex];
    
                // Eğer geçerli bir şehir varsa, o şehrin şubelerini getiriyoruz.
                if (previousCity) {
                    getBranchesByCity(previousCity.id, previousCity.name);
    
                    // Güncel index değerini localStorage’a kaydediyoruz.
                    localStorage.setItem('cityHistoryIndex', currentIndex);
                }
            }
        }
    }


    // Bu metot sayesinde, kullanıcı ileri tuşuna bastığında doğru şekilde bir sonraki menü veya şehre döner.
    // Ve geçmişi düzgün yöneterek daha kontrollü bir kullanıcı deneyimi sağlanır.
    function goForwardToNextEntity(currentIndex, selectedEntity) {

        // Eğer daha ileriye gidilebilecek bir menü varsa (dizi sınırını aşmıyorsak)
        if (currentIndex < menuHistory.length - 1) {

            // İndeks değerini 1 artırarak bir sonraki menüyü hedefliyoruz.
            currentIndex++;

            if (selectedEntity === Entity.MENU){

                // İlgili menüyü geçmiş dizisinden alıyoruz.
                const nextMenu = menuHistory[currentIndex];
    
                // Eğer geçerli bir menü varsa, o menünün ürünlerini getiriyoruz.
                if (nextMenu) {
                    getProductsByMenu(nextMenu.id, nextMenu.name);
    
                    // Güncel index değerini localStorage’a kaydediyoruz.
                    localStorage.setItem('menuHistoryIndex', currentIndex);
                }

            } else {
                
                // İlgili menüyü geçmiş dizisinden alıyoruz.
                const nextCity = cityHistory[currentIndex];

                // Eğer geçerli bir menü varsa, o menünün ürünlerini getiriyoruz.
                if (nextCity) {
                    getBranchesByCity(nextCity.id, nextCity.name);
    
                    // Güncel index değerini localStorage’a kaydediyoruz.
                    localStorage.setItem('cityHistoryIndex', currentIndex);
                }
            }
        }
    }




    //Kullanıcı tarayıcıda geri veya ileri tuşuna basınca
    window.addEventListener('popstate', function (e) {
        
        const params = new URLSearchParams(window.location.search);
        //Eğer state varsa, yani geçmişte bir adım kaydedilmişse:
        if (e.state) {

            //Burada e.state.page diyerek kullanıcının hangi sayfada olduğunu belirliyoruz.
            switch (e.state.page) {

                case 'menus':
                    getMenus();
                    break;

                case 'productsByMenu':
                    
                    const storedIndexMenu = parseInt(localStorage.getItem('menuHistoryIndex')) || 0;
                    const menuHistory = JSON.parse(localStorage.getItem('menuHistory')) || [];
                
                    // URL'deki menuId'yi al
                    const currentMenuIdFromURL = params.get('menuId');
                
                    // URL'deki menü dizide kaçıncı sıradaysa onu bul
                    const menuCurrentIndexInHistory = menuHistory.findIndex(m => m.id == currentMenuIdFromURL);
                
                    if (menuCurrentIndexInHistory < storedIndexMenu) {
                        // Geriye gidilmiş
                        goBackToPreviousEntity(storedIndexMenu, Entity.MENU);

                    } else if (menuCurrentIndexInHistory > storedIndexMenu) {
                        // İleriye gidilmiş
                        goForwardToNextEntity(storedIndexMenu, Entity.MENU);

                    } else {
                        // Aynı yerde kalınmış
                        const menu = menuHistory[menuCurrentIndexInHistory];
                        if (menu) getProductsByMenu(menu.id, menu.name);
                    }

                    break;

                case 'branchesByCity':
                    
                    const storedIndexCity = parseInt(localStorage.getItem('cityHistoryIndex')) || 0;
                    const cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
                    
                    const currentCityIdFromURL = params.get('cityId');
                    
                    // URL'deki şehir dizide kaçıncı sıradaysa onu bul
                    const cityCurrentIndexInHistory = cityHistory.findIndex(m => m.id == currentCityIdFromURL);
                    
                    if (cityCurrentIndexInHistory < storedIndexCity) {
                        // Geriye gidilmiş
                        goBackToPreviousEntity(storedIndexCity, Entity.CITY);

                    } else if (cityCurrentIndexInHistory > storedIndexCity) {
                        // İleriye gidilmiş
                        goForwardToNextEntity(storedIndexCity, Entity.CITY);

                    } else {
                        // Aynı yerde kalınmış
                        const city = cityHistory[cityCurrentIndexInHistory];
                        if (city) getBranchesByCity(city.id, city.name);
                    }
                    
                    break;

                case 'users':
                    getUsers();
                    break;

                case 'products':
                    getAllProducts();
                    break;

                case 'cities':
                    getCities();
                    break;

                case 'branches':
                    getAllBranches();
                    break;    

                case 'dashboard':
                    resetDashboard();
                    getStatistics();
                    break;
                
                default:
                    // Eğer hiç tanımlamadığımız bir page değeri gelirse token'ı silip ve login sayfasına yönlendiriyoruz.
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('adminRemembered');

                    localStorage.removeItem('selectedMenuId');
                    localStorage.removeItem('selectedMenuName');

                    localStorage.removeItem('selectedCityId');
                    localStorage.removeItem('selectedCityName');

                    localStorage.removeItem('cityHistory');
                    localStorage.removeItem('menuHistory');

                    localStorage.removeItem('menuHistoryIndex');
                    localStorage.removeItem('cityHistoryIndex');

                    window.location.href = 'admin-login.html';
                    break;
            }
        } else {
            // e.state yoksa yani kullanıcı çok geriye gittiyse
            console.warn('State boş, kullanıcı geçmişte başka bir yere döndü.');
        }
    });
    


    // Dashboard'a tıklandığında
    $('.sidenav a:contains("Anasayfa")').click(function(e) {
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