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
            
            localStorage.removeItem('selectedBranchId');
            localStorage.removeItem('selectedBranchName');

            localStorage.removeItem('menuHistory');
            localStorage.removeItem('cityHistory');
            localStorage.removeItem('branchHistory');

            localStorage.removeItem('menuHistoryIndex');
            localStorage.removeItem('cityHistoryIndex');
            localStorage.removeItem('branchHistoryIndex');

            window.location.href = 'admin-login.html';
            return;
        }

        // Kullanıcı adını göster
        $('#userNameDisplay').text(userName);
    } catch (error) {
        console.error('Token decode hatası:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('adminRemembered');
        
        localStorage.removeItem('selectedMenuId');
        localStorage.removeItem('selectedMenuName');
        
        localStorage.removeItem('selectedCityId');
        localStorage.removeItem('selectedCityName');

        localStorage.removeItem('selectedBranchId');
        localStorage.removeItem('selectedBranchName');
        
        localStorage.removeItem('menuHistory');
        localStorage.removeItem('cityHistory');
        localStorage.removeItem('branchHistory');

        localStorage.removeItem('menuHistoryIndex');
        localStorage.removeItem('cityHistoryIndex');
        localStorage.removeItem('branchHistoryIndex');

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

            localStorage.removeItem('selectedBranchId');
            localStorage.removeItem('selectedBranchName');

            localStorage.removeItem('menuHistory');
            localStorage.removeItem('cityHistory');
            localStorage.removeItem('branchHistory');

            localStorage.removeItem('menuHistoryIndex');
            localStorage.removeItem('cityHistoryIndex');
            localStorage.removeItem('branchHistoryIndex');

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


    //Global değişkenler
    const baseUrl = 'https://eatwell-api.azurewebsites.net/api/';
    let currentPage = 1; // Global tanım
    let totalPages = 1;  // Toplam sayfa sayısı
    let totalItems = 0;  // Toplam öge sayısı
    let pageItems = 10;  // Toplam görüntülenmek istenen öge sayısı


    function paginationTemplate(addToDiv, prevId, nextId, pageInfoId, totalItemsInfoId){
        
        let paginationsHtml = `
        <div class="pagination-container">
            <div class="pagination-page-size">
                <span class="page-size-label">Göster: </span>
                <div class="dropdown" id="customPaginationDropdown">
                    <i class="fa-solid fa-caret-down"></i>
                    <div class="dropdown-pagination-toggle" id="selectedValue">10</div>
                    <div class="dropdown-pagination">
                        <div class="dropdown-pagination-option">10</div>
                        <div class="dropdown-pagination-option">15</div>
                        <div class="dropdown-pagination-option">20</div>
                    </div>
                </div>
            </div>
            <div class="pagination">
                <button id="${prevId}" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
                <span id="${pageInfoId}">Sayfa 1</span>
                <button id="${nextId}" class="pagination-btn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="pagination-total-info">
                <span id="${totalItemsInfoId}">Toplam Kayıt: ${totalItems}</span>
            </div>
        </div>
        `;

        $(`.${addToDiv}`).append(paginationsHtml);
    }

    // İstatistikleri API'den al
    function getStatistics() {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `${baseUrl}dashboards`,
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


    // Kullanıcıları göster
    function displayUsers(response) {

        let usersTableHTML = '';
        
        // Kullanıcıları tabloya ekle
        if (response.data.length > 0) {
            response.data.forEach(user => {
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

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#userPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#userTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);
        
        // Sayfalama butonlarının durumunu güncelle
        $('#prevUserPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextUserPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }


    // Kullanıcıları getiren fonksiyon
    function getUsers(page = 1) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `${baseUrl}users/getall?pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Dashboard içeriğini temizle
                $('.dashboard-content').empty();
                
                currentPage = page;

                // Kullanıcılar için HTML yapısı
                let usersHTML = `
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
                    </div>
                </div>
                `;
                
                // Kullanıcıları dashboard'a ekle
                $('.dashboard-content').append(usersHTML);

                paginationTemplate("users-container", "prevUserPage", "nextUserPage", "userPageInfo", "userTotalItemsInfo");

                // Kullanıcıları göster
                displayUsers(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Kullanıcılar alınırken hata oluştu!');
            }
        });
    }


    function fetchUsers() {
        let baseRequest = `${baseUrl}users/getall?pageNumber=${currentPage}&pageSize=${pageItems}`;

        $.ajax({
            url: baseRequest,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('#usersTableBody').empty();

                displayUsers(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Kullanıcılar alınırken hata oluştu!");
            }
        });
    }


    // Kullanıcılar sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevUserPage', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchUsers();
        }
    });
    
    
    // Kullanıcılar sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextUserPage', function() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchUsers();
        }
    });


    // Navbar'daki "Kullanıcılar" seçeneğine tıklandığında
    $('.sidenav a:contains("Kullanıcılar")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'users' }, 'Kullanıcılar', '?page=users'); 

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


    // Menüleri göster
    function displayMenus(response) {

        let menusTableHTML = '';
        
        // Menüleri tabloya ekle
        if (response.data.length > 0) {
            response.data.forEach(menu => {
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

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#menuPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#menuTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevMenuPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextMenuPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }


    // Menüleri getiren fonksiyon
    function getMenus(page = 1) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `${baseUrl}mealCategories/getAllForAdmin?pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Dashboard içeriğini temizle
                $('.dashboard-content').empty();
                
                currentPage = page;

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
                    </div>
                </div>`;
                
                // Menüleri dashboard'a ekle
                $('.dashboard-content').append(menusHTML);
                
                paginationTemplate("menus-container", "prevMenuPage", "nextMenuPage", "menuPageInfo", "menuTotalItemsInfo");
                
                // Menüleri göster
                displayMenus(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Menüler alınırken hata oluştu!');
            }
        });
    }


    function fetchMenus() {
        $.ajax({
            url: `${baseUrl}mealCategories/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('#menusTableBody').empty();

                displayMenus(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Menüler alınırken hata oluştu!");
            }
        });
    }


    // Menüler sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevMenuPage', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchMenus();
        }
    });
    
    
    // Menüler sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextMenuPage', function() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchMenus();
        }
    });



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



    function displayProducts(response, showGoToMenuButton) {
    
        let tableHTML = '';

        if (response.data.length > 0) {
            response.data.forEach(product => {
                // Tarihi formatla (gün.ay.yıl şeklinde)
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
                    <td>${product.name}</td>
                    ${showGoToMenuButton ? `<td>${product.mealCategoryName}</td>` : '' }
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
            // Ürün yoksa bilgi mesajı göster
            tableHTML = `
                <tr>
                    <td colspan="6" class="empty-table-row">Henüz ürün bulunmamaktadır.</td>
                </tr>`;
        }

        // Tabloyu güncelle
        $('#productsTableBody').html(tableHTML);
        
        totalPages = response.totalPages;
        totalItems = response.totalItems;
        
        // Sayfa bilgisini güncelle
        $('#productPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#productTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevProductPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextProductPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }


    // Ürünleri getiren ortak fonksiyon
    function renderProductsList(data, options = {}) {
        const {
            title = 'Ürün Listesi',
            showGoToMenuButton = false
        } = options;
    
        // Ortak HTML yapısı
        $('.dashboard-content').empty();

        currentPage = 1;

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
                            <th>Ürün Adı</th>
                            ${showGoToMenuButton ? `<th>Menü Adı</th>` : '' }
                            <th>Fiyatı</th>
                            <th>Kayıt Tarihi</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody"></tbody>
                </table>
            </div>
        </div>`;

        // Ürünleri dashboard'a ekle
        $('.dashboard-content').append(html);

        paginationTemplate("products-container", "prevProductPage", "nextProductPage", "productPageInfo", "productTotalItemsInfo");

        // Ürünleri göster
        displayProducts(data, showGoToMenuButton);
    }


    function fetchProducts(request, showGoToMenuButton) {
        $.ajax({
            url: request,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('#productsTableBody').empty();

                displayProducts(response, showGoToMenuButton);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Ürünler alınırken hata oluştu!");
            }
        });
    }


    // Ürünler sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevProductPage', function() {
        if (currentPage > 1) {
            currentPage--;

            const params = new URLSearchParams(window.location.search);
            const menuId = params.get('menuId');
            let request;
            let showGoToMenuButton;

            if (menuId === null) {
                request = `${baseUrl}products/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToMenuButton = true;
            } else {
                request = `${baseUrl}products/getAllForAdminByMealCategoryId?mealCategoryId=${menuId}&pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToMenuButton = false;
            }

            fetchProducts(request, showGoToMenuButton);
        }
    });
    
    
    // Ürünler sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextProductPage', function() {
        if (currentPage < totalPages) {
            currentPage++;

            const params = new URLSearchParams(window.location.search);
            const menuId = params.get('menuId');
            let request;
            let showGoToMenuButton;

            if (menuId === null) {
                request = `${baseUrl}products/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToMenuButton = true;
            } else {
                request = `${baseUrl}products/getAllForAdminByMealCategoryId?mealCategoryId=${menuId}&pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToMenuButton = false;
            }

            fetchProducts(request, showGoToMenuButton);
        }
    });


    function getProductsByMenu(menuId, menuName) {
        const token = localStorage.getItem('token');
        $.ajax({
            url: `${baseUrl}products/getAllForAdminByMealCategoryId?mealCategoryId=${menuId}&pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderProductsList(response, { title: menuName, showGoToMenuButton: false }),
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
            url: `${baseUrl}products/getAllForAdmin?pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderProductsList(response, { title: 'Ürün Listesi', showGoToMenuButton: true }),
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
                url: `${baseUrl}mealCategories/getAllForAdmin`,
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




    function displayCities(response) {
                    
        let citiesTableHTML = '';
        
        // Şehirleri tabloya ekle
        if (response.data.length > 0) {
            response.data.forEach(city => {
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

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#cityPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#cityTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevCityPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextCityPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }


    // Şehirleri getiren fonksiyon
    function getCities(page = 1) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `${baseUrl}cities?pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Dashboard içeriğini temizle
                $('.dashboard-content').empty();
                
                currentPage = page;

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
                    </div>
                </div>`;
                
                // Şehirleri dashboard'a ekle
                $('.dashboard-content').append(citiesHTML);
                
                paginationTemplate("cities-container", "prevCityPage", "nextCityPage", "cityPageInfo", "cityTotalItemsInfo");

                // Şehirleri göster
                displayCities(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Şehirler alınırken hata oluştu!');
            }
        });
    }
    

    function fetchCities() {
        $.ajax({
            url: `${baseUrl}cities?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('#citiesTableBody').empty();

                displayCities(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Şehirler alınırken hata oluştu!");
            }
        });
    }


    // Şehirler sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevCityPage', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchCities();
        }
    });
    
    
    // Şehirler sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextCityPage', function() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchCities();
        }
    });


    // Navbar'daki "Şehir ve Şubeler" seçeneğine tıklandığında
    $('.sidenav a:contains("Şehir ve Şubeler")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'cities' }, 'Şehirler', '?page=cities'); 

        getCities();
    });



    function displayBranches(response, showGoToCityButton, showGoToReservationsButton) {
    
        let tableHTML = '';

        if (response.data.length > 0) {
            response.data.forEach(branch => {

                tableHTML += `
                <tr class="branch-row" data-branch-id="${branch.id}">
                    ${showGoToCityButton || showGoToReservationsButton ? `<td>${branch.cityName}</td>` : '' }
                    <td>${branch.name}</td>
                    <td>
                        <span class="truncate">${branch.address}</span>
                    </td>
                    <td>${branch.email}</td>
                    <td>
                        <div class="table-actions-scroll">
                            ${!showGoToReservationsButton ? `
                            <button class="btn-delete-branch" data-branch-id="${branch.id}">
                                <i class="fa-solid fa-trash"></i>
                                Sil
                            </button>
                            <button class="btn-edit-branch" data-branch-id="${branch.id}">
                                <i class="fa-solid fa-pen-to-square"></i>
                                Düzenle
                            </button>` : ''
                            }
                            ${showGoToCityButton ? `
                                <button class="btn-city" data-city-id="${branch.cityId}" data-city-name="${branch.cityName}">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    Şehre Git
                                </button>` : ''
                            }
                            ${showGoToReservationsButton ? `
                                <button class="btn-reservation" data-branch-id="${branch.id}" data-branch-name="${branch.name}">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    Rezervasyonlara Git
                                </button>` : ''
                            }
                        </div>
                    </td>
                </tr>`;
            });
        } else {
            // Şube yoksa bilgi mesajı göster
            tableHTML = `
                <tr>
                    <td colspan="5" class="empty-table-row">Henüz şube bulunmamaktadır.</td>
                </tr>`;
        }

        // Tabloyu güncelle
        $('#branchesTableBody').html(tableHTML);

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#branchPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#branchTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevBranchPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextBranchPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }


    // Şubeleri getiren ortak fonksiyon
    function renderBranchesList(data, options = {}) {
        const {
            title = 'Şube Listesi',
            showGoToCityButton = false,
            showGoToReservationsButton = false
        } = options;
    
        // Ortak HTML yapısı
        $('.dashboard-content').empty();

        currentPage = 1;

        let html = `
        <div class="branches-container">
            <div class="branches-header">
                <h2>${title}</h2>
                ${!showGoToReservationsButton ? `
                    <button class="btn-create-branch">
                        <i class="fa-solid fa-plus"></i>
                        Şube Ekle
                    </button>` : ''
                }
            </div>
            <div class="branches-body">
                <table class="branches-table">
                    <thead>
                        <tr>
                            ${showGoToCityButton || showGoToReservationsButton ? `<th class="city-col">Şehir</th>` : '' }
                            <th class="branch-name-col">Şube Adı</th>
                            <th class="address-col">Adres</th>
                            <th class="email-col">E-posta</th>
                            <th class="actions-col">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="branchesTableBody"></tbody>
                </table>
            </div>
        </div>`;

        // Şubeleri dashboard'a ekle
        $('.dashboard-content').append(html);
    
        paginationTemplate("branches-container", "prevBranchPage", "nextBranchPage", "branchPageInfo", "branchTotalItemsInfo");
    
        // Şubeleri göster
        displayBranches(data, showGoToCityButton, showGoToReservationsButton);
    }


    function fetchBranches(request, showGoToCityButton, showGoToReservationsButton) {
        $.ajax({
            url: request,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('#branchesTableBody').empty();

                displayBranches(response, showGoToCityButton, showGoToReservationsButton);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Ürünler alınırken hata oluştu!");
            }
        });
    }


    // Şubeler sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevBranchPage', function() {
        if (currentPage > 1) {
            currentPage--;

            const params = new URLSearchParams(window.location.search);
            const cityId = params.get('cityId');
            let request;
            let showGoToCityButton;
            let showGoToReservationsButton;

            if (cityId === null) {
                request = `${baseUrl}branches/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToCityButton = false;
                showGoToReservationsButton = false;
            } else {
                request = `${baseUrl}branches/getAllForAdminByCityId?cityId=${cityId}&pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToCityButton = true;
                showGoToReservationsButton = false;
            }

            fetchBranches(request, showGoToCityButton, showGoToReservationsButton);
        }
    });
    
    
    // Şubeler sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextBranchPage', function() {
        if (currentPage < totalPages) {
            currentPage++;

            const params = new URLSearchParams(window.location.search);
            const cityId = params.get('cityId');
            let request;
            let showGoToCityButton;
            let showGoToReservationsButton;

            if (cityId === null) {
                request = `${baseUrl}branches/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToCityButton = false;
                showGoToReservationsButton = false;
            } else {
                request = `${baseUrl}branches/getAllForAdminByCityId?cityId=${cityId}&pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToCityButton = true;
                showGoToReservationsButton = false;
            }

            fetchBranches(request, showGoToCityButton, showGoToReservationsButton);
        }
    });


    // Şehirlerin şubelerini getiren fonksiyon
    function getBranchesByCity(cityId, cityName) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `${baseUrl}branches/getAllForAdminByCityId?cityId=${cityId}&pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderBranchesList(response, { title: cityName, showGoToCityButton: false, showGoToReservationsButton: false }),
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
            url: `${baseUrl}branches/getAllForAdmin?pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderBranchesList(response, { title: 'Şube Listesi', showGoToCityButton: true, showGoToReservationsButton: false }),
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
        // Eğer tıklanan element düzenleme butonu, silme butonu, şehre git veya rezervasyonlara git butonu ise işlemi durdur
        if ($(e.target).closest('.btn-edit-branch, .btn-delete-product, .btn-city, .btn-reservation').length) {
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

                    if (cityName === null){
                        getAllBranches();
                    }else{
                        getBranchesByCity(cityId, cityName); 
                    }
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

                            if (cityName === null){
                                getAllBranches();
                            }else{
                                getBranchesByCity(cityId, cityName); 
                            }
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
                url: `${baseUrl}cities`,
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




    function getAllBranchesForReservations() {
        const token = localStorage.getItem('token');

        $.ajax({
            url: `${baseUrl}branches/getAllForAdmin?pageNumber=1&pageSize=10`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            success: (response) => renderBranchesList(response, { title: 'Şube Seçiniz...', showGoToCityButton: false, showGoToReservationsButton: true }),
            error: (xhr) => showToast('error', 'Hata', xhr.responseJSON?.Message || 'Şubeler alınırken hata oluştu!')
        });
    }


    // Navbar'daki "Rezervasyonlar" seçeneğine tıklandığında
    $('.sidenav a:contains("Rezervasyonlar")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'branchesForReservation' }, 'Şubeler', '?page=branchesForReservation'); 

        getAllBranchesForReservations();
    });


    // Rezervasyonları göster
    function displayReservations(response) {
        let reservationsTableHTML = '';
        
        // Rezervasyonları tabloya ekle
        if (response.data.length > 0) {
            response.data.forEach(reservation => {
                // Tarihi formatla (gün.ay.yıl şeklinde)
                const date = new Date(reservation.reservationDate);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}\t${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                                                
                reservationsTableHTML += `
                    <tr class="reservation-row" data-reservation-id="${reservation.id}">
                        <td>${reservation.tableNo}</td>
                        <td>${reservation.personCount}</td>
                        <td>${formattedDate}</td>
                        <td>${reservation.fullName}</td>
                        <td>${reservation.phone}</td>
                    </tr>`;
            });
        } else {
            // Rezervasyon yoksa bilgi mesajı göster
            reservationsTableHTML = `
                <tr>
                    <td colspan="5" class="empty-table-row">Henüz rezervasyon bulunmamaktadır.</td>
                </tr>`;
        }
        
        // Tabloyu güncelle
        $('#reservationsTableBody').html(reservationsTableHTML);

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#reservationPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#reservationTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevReservationPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextReservationPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }


    // Masaları göster
    function displayTables() { 
        $('.table-box').empty();

        let tablesHTML = '';

        if (tables.length > 0) {

            // Masaları ekle
            tables.forEach(table => {
                tablesHTML += `
                <div class="table-item">
                    <span>${table.no}</span>
                    <div class="tooltip-text">
                        <span class="tooltip-label">
                            <strong>Masa Adı</strong> 
                            <span>:</span>
                            ${table.name}
                        </span>
                        </br>
                        <span class="tooltip-label">
                            <strong>Kapasite</strong> 
                            <span>:</span>
                            ${table.capacity}
                        </span>
                    </div>
                </div>`;
            })
        } else {
            tablesHTML = `
                <h3 class="empty-table-row">Henüz masa bulunmamaktadır.</h3>
            `;
        }

        $('.table-box').html(tablesHTML);
    }


    function updateTableList(){
        $('.dropdown-menu').empty();

        let tablesHTML = '';

        if (tables.length > 0) {
            tablesHTML += `
                <div class="dropdown-option" data-table-id="">Tüm masaları göster</div>
            `;

            // Masaları ekle
            tables.forEach(table => {
                tablesHTML += `
                    <div class="dropdown-option" data-table-id="${table.id}">${table.no}</div>
                `;
            })
        } else {
            tablesHTML = `
                <h3 class="empty-table-row">Henüz masa bulunmamaktadır.</h3>
            `;
        }

        $('.dropdown-menu').html(tablesHTML);
    }


    let tables = null;
    

    // Rezervasyonlar sayfasının taslağını getiren fonksiyon
    function getReservationTemplate(branchId, branchName, page = 1) {
        const token = localStorage.getItem('token');
        
        // Bugünün tarihi
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        $.ajax({
            url: `${baseUrl}reservations/getAdminDashboardReservationData?pageNumber=1&pageSize=10&branchId=${branchId}&DateRangeFilter.StartDate=${todayStr}&DateRangeFilter.EndDate=${todayStr}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                // Dashboard içeriğini temizle
                $('.dashboard-content').empty();
                
                const tableResponse = response.tableResponse.data;
                tables = response.tableResponse.data;
                currentPage = page;
                
                // Rezervasyonlar için temel HTML yapısı
                let reservationsHTML = `
                <div class="reservations-container">
                    <div class="reservations-header">
                        <h2>${branchName} Şubesi</h2>
                        <div class="table-management">
                            <button class="btn-manage-table">
                                <i class="fa-solid fa-gear"></i>
                                Masaları Yönet
                            </button>
                            <div class="table-options">
                                <button class="btn-create-table table-manage-button">
                                    Ekle
                                </button>
                                <button class="btn-edit-table table-manage-button">
                                    Düzenle
                                </button>
                                <button class="btn-delete-table table-manage-button">
                                    Sil
                                </button>
                            </div>
                        </div>
                        <div class="table-exit-button">
                            <i class="fa-solid fa-arrow-left"></i>
                            Geri Dön
                        </div>
                    </div>
                    <div class="reservations-body">
                        <div class="reservation-section">
                            <div class="reservation-box">
                                <div class="input-wrapper">
                                    <input id="filter-name" type="text" placeholder="Müşteri adı ara...">
                                    <span class="user">
                                        <i class="fa-solid fa-user"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="reservation-box">
                                <div class="input-wrapper">
                                    <div class="dropdown" id="customDropdown">
                                        <div class="dropdown-toggle" id="selectedId" data-selected-id="">Masalarda ara...</div>
                                        <div class="dropdown-menu">
                                        </div>
                                    </div>
                                    <span class="chair">
                                        <i class="fa-solid fa-chair"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="reservation-box">
                                <div class="input-wrapper">
                                    <label for="filter-start-date">Başlangıç Tarihi</label>
                                    <input id="filter-start-date" type="date" class="custom-date">
                                    <span class="calendar">
                                        <i class="fa-solid fa-calendar-days"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="reservation-box">
                                <div class="input-wrapper">
                                    <label for="filter-end-date">Bitiş Tarihi</label>
                                    <input id="filter-end-date" type="date" class="custom-date">
                                    <span class="calendar">
                                        <i class="fa-solid fa-calendar-days"></i>
                                    </span>
                                </div>
                            </div>

                            <button class="btn-filter-table">
                                <i class="fa-solid fa-search"></i>
                                Ara
                            </button>
                        </div>

                        <div class="table-section">
                            <h2>Masa Durumu</h2>
                            <div class="table-box">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="reservations-container subdivision">
                    <div class="reservations-body">
                        <table class="reservations-table">
                            <thead>
                                <tr>
                                    <th class="table-col">Masa No</th>
                                    <th class="actions-col">Kişi Sayısı</th>
                                    <th class="actions-col">Rezervasyon Tarihi</th>
                                    <th class="customer-name-col">Müşteri Adı</th>
                                    <th class="address-col">Telefon</th>
                                </tr>
                            </thead>
                            <tbody id="reservationsTableBody"></tbody>
                        </table>
                    </div>
                </div>
                `;

                // Rezervasyon taslağını dashboard'a ekle
                $('.dashboard-content').append(reservationsHTML);
                paginationTemplate("reservations-container.subdivision", "prevReservationPage", "nextReservationPage", "reservationPageInfo", "reservationTotalItemsInfo");
                
                $('#filter-start-date').val(todayStr);
                $('#filter-end-date').val(todayStr);


                displayTables();

                updateTableList();
                
                displayReservations(response.reservationResponse);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Rezervasyonlar alınırken hata oluştu!');
            }
        });
    }


    // Rezervasyon detaylarını getiren fonksiyon
    function getReservationDetails(reservationId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `${baseUrl}reservations/get?reservationId=${reservationId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const reservation = response.data;
                    const date = new Date(reservation.reservationDate);
                    
                    // Tarihleri formatla
                    const formattedReservationDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}\t${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;


                    let reservationDetailsHTML = `
                    <div class="reservation-details-modal">
                        <div class="reservation-details-content">
                            <div class="reservation-details-header">
                                <h2>Rezervasyon Detayı</h2>
                                <span class="close-reservation-details">&times;</span>
                            </div>
                            <div class="reservation-details-body">
                                <div class="reservation-info">
                                    <div class="reservation-info-item">
                                        <div class="reservation-label">
                                            <strong>Müşteri Adı</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="reservation-value">${reservation.fullName}</p>
                                    </div>
                                    <div class="reservation-info-item">
                                        <div class="reservation-label">
                                            <strong>E-posta</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="reservation-value">${reservation.email}</p>
                                    </div>
                                    <div class="reservation-info-item">
                                        <div class="reservation-label">
                                            <strong>Rezervasyon Tarihi</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="reservation-value">${formattedReservationDate}</p>
                                    </div>
                                    <div class="reservation-info-item">
                                        <div class="reservation-label">
                                            <strong>Telefon</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="reservation-value">${reservation.phone}</p>
                                    </div>
                                    <div class="reservation-info-item">
                                        <div class="reservation-label">
                                            <strong>Masa No</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="reservation-value">${reservation.tableNo}</p>
                                    </div>
                                    <div class="reservation-info-item">
                                        <div class="reservation-label">
                                            <strong>Kişi Sayısı</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="reservation-value">${reservation.personCount}</p>
                                    </div>
                                    <div class="reservation-info-item">
                                        <div class="reservation-label">
                                            <strong>Not</strong> 
                                            <span>:</span>
                                        </div>
                                        <p class="reservation-value">${reservation.note || '<span style="color: gray;">—</span>'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.reservation-details-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(reservationDetailsHTML);
                    
                    // Detay modülünü göster
                    $('.reservation-details-modal').fadeIn(300);
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-reservation-details').click(function() {
                        $('.reservation-details-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.reservation-details-modal').click(function(e) {
                        if ($(e.target).hasClass('reservation-details-modal')) {
                            $('.reservation-details-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Rezervasyon detayı alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Rezervasyon detayı alınırken hata oluştu!');
            }
        });
    }

    
    // Rezervasyon satırına tıklama olayı
    $(document).on('click', '.reservation-row', function(e) {
        const reservationId = $(this).data('reservation-id');

        getReservationDetails(reservationId);
    });




    function fetchReservations() {
        const reservationBody = $('.reservations-body');
    
        const customerName = reservationBody.find('#filter-name').val();
        const tableId = reservationBody.find('.dropdown-toggle').attr('data-selected-id');
        const startDate = reservationBody.find('#filter-start-date').val();
        const endDate = reservationBody.find('#filter-end-date').val();
    
        const token = localStorage.getItem('token');
        const params = new URLSearchParams(window.location.search);
        const branchId = params.get('branchId');
    
        let baseRequest = `${baseUrl}reservations/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}&branchId=${branchId}&DateRangeFilter.StartDate=${startDate}&DateRangeFilter.EndDate=${endDate}`;
    
        if (customerName.trim() !== '') baseRequest += `&fullName=${customerName}`;
        if (tableId !== "") baseRequest += `&tableId=${tableId}`;
    
        $.ajax({
            url: baseRequest,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('#reservationsTableBody').empty();

                displayReservations(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Rezervasyonlar alınırken hata oluştu!");
            }
        });
    }
    

    $(document).on('click', '#prevReservationPage', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchReservations();
        }
    });
    
    
    $(document).on('click', '#nextReservationPage', function() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchReservations();
        }
    });
    


    // Rezervasyon filtreleme seçeneklerinden "Ara" butonuna tıklandığında
    $(document).on('click', '.btn-filter-table', function(e) {
        e.stopPropagation();

        currentPage = 1; // Filtreleme yapıldığında sayfa başa dönsün
        fetchReservations();
    });


    // Şubeler listesinde "Rezervasyonlara Git" butonuna tıklandığında
    $(document).on('click', '.btn-reservation', function(e) {
        e.stopPropagation();

        const branchId = $(this).data('branch-id');
        const branchName = $(this).data('branch-name');

        // Seçilen şubeyi geçmişe kaydediyoruz
        selectEntity(branchId, branchName, Entity.BRANCH);

        localStorage.setItem('selectedBranchId', branchId);
        localStorage.setItem('selectedBranchName', branchName);

        getReservationTemplate(branchId, branchName);
    });


    // Pagination bölümündeki "Göster" option'ına tıklandığında
    $(document).on('click', '.dropdown-pagination-toggle', function(e) {
        e.stopPropagation(); 

        const pagination = $("#customPaginationDropdown").find(".dropdown-pagination");
        pagination.toggleClass("active");

        if (pagination.hasClass("active")) {
            $(".dropdown-pagination-toggle").css("border-color", "#ffc515"); 
            $('#customPaginationDropdown i').addClass('rotated-180');
        } else {
            $(".dropdown-pagination-toggle").css("border-color", "#dedbdb"); 
            $('#customPaginationDropdown i').removeClass('rotated-180');
        }
    });
    
    
    // Pagination bölümündeki "Göster" option'ının ikonuna tıklandığında
    $(document).on('click', '#customPaginationDropdown i', function(e) {
        e.stopPropagation(); 

        const pagination = $("#customPaginationDropdown").find(".dropdown-pagination");
        pagination.toggleClass("active");

        if (pagination.hasClass("active")) {
            $(".dropdown-pagination-toggle").css("border-color", "#ffc515"); 
            $('#customPaginationDropdown i').addClass('rotated-180');
        } else {
            $(".dropdown-pagination-toggle").css("border-color", "#dedbdb"); 
            $('#customPaginationDropdown i').removeClass('rotated-180');
        }
    });


    // "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.dropdown-pagination-option', function() {
        const label = $(this).text();
        const dropdownToggle = $("#customPaginationDropdown").find(".dropdown-pagination-toggle");

        pageItems = label;
        dropdownToggle.text(label);
        dropdownToggle.css("color", "#000");

        $("#customPaginationDropdown").find(".dropdown-pagination").removeClass("active");
        $(".dropdown-pagination-toggle").css("border-color", "#dedbdb"); 
        $('#customPaginationDropdown i').removeClass('rotated-180');
    });



    // Rezervasyonlar sayfasındaki "Masalarda Ara" option'ına tıklandığında
    $(document).on('click', '.dropdown-toggle', function(e) {
        e.stopPropagation(); 

        const menu = $("#customDropdown").find(".dropdown-menu");
        menu.toggleClass("active");

        if (menu.hasClass("active")) {
            $(".dropdown-toggle").css("border-color", "#ffc515"); 
        } else {
            $(".dropdown-toggle").css("border-color", "#dedbdb"); 
        }
    });


    // "Masalarda Ara" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.dropdown-option', function() {
        const label = $(this).text();
        const selectedId = $(this).data('table-id');
        const dropdownToggle = $("#customDropdown").find(".dropdown-toggle");

        dropdownToggle.text(label);
        dropdownToggle.css("color", "#000");
        dropdownToggle.attr('data-selected-id', selectedId); // seçilen nesnenin id bilgisini saklıyoruz

        $("#customDropdown").find(".dropdown-menu").removeClass("active");
        $(".dropdown-toggle").css("border-color", "#dedbdb"); 
    });


    // Dışarı tıklanınca ilgili menüleri kapat
    $(document).on("click", function (e) {

        // Eğer tıklanan yer Rezervasyonlar sayfasındaki "Masalarda Ara..." listesi veya içindeki seçenekler değilse
        if (!$("#customDropdown").is(e.target) && $("#customDropdown").has(e.target).length === 0) {
            $("#customDropdown").find(".dropdown-menu").removeClass("active");
            $(".dropdown-toggle").css("border-color", "#dedbdb"); 
        }
        

        // Eğer tıklanan yer pagination bölümündeki "Göster" listesi veya içindeki seçenekler değilse
        if (!$("#customPaginationDropdown").is(e.target) && $("#customPaginationDropdown").has(e.target).length === 0) {
            $("#customPaginationDropdown").find(".dropdown-pagination").removeClass("active");
            $(".dropdown-pagination-toggle").css("border-color", "#dedbdb"); 
            $('#customPaginationDropdown i').removeClass('rotated-180');
        }


        // Eğer tıklanan yer .table-options kutusu (yani "Masaları Yönet" butonuna tıklandığında açılan kutu) veya içindeki seçenekler değilse
        if (!$(e.target).closest('.table-options, .btn-manage-table').length) {
            $('.table-options').removeClass('table-manage-show');
            $(".btn-manage-table i").removeClass("rotated-90");
        }
    });


    // Rezervasyon filtreleme seçeneklerinden "Takvim" ikonuna tıklandığında takvim listesinin görüntülenmesi için...
    $(document).on('click', '.calendar', function(e) {
        e.stopPropagation();
        
       // İkona en yakın input'u hedefliyoruz
        const input = $(this).siblings('.custom-date')[0];

        if (input && typeof input.showPicker === 'function') {
            input.showPicker();
        } else {
            input?.focus();
        }
    });


    function createTable() {
        
        let tableCreateHTML = `
        <div class="table-create-modal">
            <div class="table-create-content">
                <div class="table-create-header">
                    <h2>Masa Ekleme</h2>
                    <span class="close-table-create">&times;</span>
                </div>
                <div class="table-create-body">
                    <div class="table-info">
                        <div class="table-info-item">
                            <div class="table-label">
                                <strong>Masa Adı</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="table-value table-name">
                        </div>
                        <div class="table-info-item">
                            <div class="table-label">
                                <strong>Masa No</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="table-value table-no">
                        </div>
                        <div class="table-info-item">
                            <div class="table-label">
                                <strong>Kapasite</strong> 
                                <span>:</span>
                            </div>
                            <input type="text" class="table-value table-capacity">
                        </div>
                    </div>
                    
                    <button class="btn-add-table">Ekle</button>
                </div>
            </div>
        </div>`;
        
        // Detay modülünü ekle
        $('body').append(tableCreateHTML);
        
        // Detay modülünü göster
        $('.table-create-modal').fadeIn(300);
        
        // Kapatma butonuna tıklandığında
        $('.close-table-create').click(function() {
            $('.table-create-modal').fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        // Modül dışına tıklandığında kapat
        $('.table-create-modal').click(function(e) {
            if ($(e.target).hasClass('table-create-modal')) {
                $('.table-create-modal').fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
    }


    // Masa No ve Masa Kapasitesi alanlarına rakam dışında diğer karakterlerin girilmesini engelliyoruz.
    $(document).on('input', '.table-no, .table-capacity', function () {
        
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
        
        // Eğer inputta rakam dışı karakter varsa uyarı veriyoruz
        if (/[^0-9]/.test(oldValue)) {
            showToast('error', 'Hata', 'Lütfen yalnızca sayısal karakter kullanın.');
        }
        
        // Tüm rakamları al 
        let digitsOnly = oldValue.replace(/\D/g, '').substring(0, 12);
        
        
        $(this).val(digitsOnly);
        
        // Yeni uzunluğu alıp imleç pozisyonunu ayarlıyoruz
        let newLength = digitsOnly.length;
        cursorPosition += newLength - oldLength;
        inputElement.setSelectionRange(cursorPosition, cursorPosition);
    });


    // Rezervasyonda "Masaları Yönet" butonuna tıklandığında
    $(document).on('click', '.btn-manage-table', function(e) {
        e.stopPropagation();

        $('.table-options').toggleClass('table-manage-show');

        $(".btn-manage-table i").toggleClass("rotated-90");
    });


    // table-options içindeki butonlardan herhangi birine tıklandığında table-options kutusunu kapat
    $(document).on('click', '.table-manage-button', function () {
        $('.table-options').removeClass('table-manage-show');
        $(".btn-manage-table i").removeClass("rotated-90");
    });


    // Masaları Yönet butonlarından "Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-create-table', function(e) {
        e.stopPropagation();

        createTable();
    });


    // Masalarda "Ekle" butonuna tıklandığında
    $(document).on('click', '.btn-add-table', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const createModal = $(this).closest('.table-create-modal');

        const tableName = createModal.find('.table-name').val();
        const tableNo = createModal.find('.table-no').val();
        const tableCapacity = createModal.find('.table-capacity').val();

        
        if (tableName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen masa adını giriniz!');
            return;
        }
        
        if (tableNo.trim() === '') {
            showToast('error', 'Hata', 'Lütfen masa numarasını giriniz!');
            return;
        }
        
        if (tableCapacity.trim() === '') {
            showToast('error', 'Hata', 'Lütfen masa kapasitesini giriniz!');
            return;
        }
        
        const token = localStorage.getItem('token');
        const params = new URLSearchParams(window.location.search);
        const branchId = params.get('branchId');
        
        $.ajax({
            url: `${baseUrl}tables/add`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                branchId: branchId,
                no: tableNo,
                name: tableName,
                capacity: tableCapacity
            }),
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Masa başarıyla eklendi!');
                    
                    $('.table-create-modal').fadeOut(300, function() {
                        $(this).remove();
                    });
                    
                    fetchTables();
                } else {
                    showToast('error', 'Hata', response.message);
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Masa eklenirken hata oluştu!");
            }
        });
    });


    // Düzenleme için masaları göster
    function displayTablesForUpdate() { 
        hideTableManagement();
        
        $('.table-box').empty();

        let tablesHTML = '';

        if (tables.length > 0) {
            // Masaları ekle
            tables.forEach(table => {
                tablesHTML += `
                <div class="table-item">
                   <i class="fa-solid fa-pen-to-square" data-table-id="${table.id}"></i>
                   <div class="table-number">
                        <span>${table.no}</span>
                    </div>
                        <div class="tooltip-text">
                            <span class="tooltip-label">
                                <strong>Masa Adı</strong> 
                                <span>:</span>
                                ${table.name}
                            </span>
                            </br>
                            <span class="tooltip-label">
                                <strong>Kapasite</strong> 
                                <span>:</span>
                                ${table.capacity}
                            </span>
                        </div>
                </div>`;
            })
        } else {
            tablesHTML = `
                <h3 class="empty-table-row">Henüz masa bulunmamaktadır.</h3>
            `;
        }

        $('.table-box').html(tablesHTML);
    }
    

    function updateTable(tableId) {
        const token = localStorage.getItem('token');
        
        $.ajax({
            url: `${baseUrl}tables/getForAdmin?tableId=${tableId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const table = response.data;
                              
                    let tableUpdateHTML = `
                        <div class="table-update-modal" data-table-id="${table.id}">
                            <div class="table-update-content">
                                <div class="table-update-header">
                                    <h2>Masa Güncelleme</h2>
                                    <span class="close-table-update">&times;</span>
                                </div>
                                <div class="table-update-body">
                                    <div class="table-info">
                                        <div class="table-info-item">
                                            <div class="table-label">
                                                <strong>Masa Adı</strong> 
                                                <span>:</span>
                                            </div>
                                            <input type="text" class="table-value table-name" value="${table.name}">
                                        </div>
                                        <div class="table-info-item">
                                            <div class="table-label">
                                                <strong>Masa No</strong> 
                                                <span>:</span>
                                            </div>
                                            <input type="text" class="table-value table-no" value="${table.no}">
                                        </div>
                                        <div class="table-info-item">
                                            <div class="table-label">
                                                <strong>Kapasite</strong> 
                                                <span>:</span>
                                            </div>
                                            <input type="text" class="table-value table-capacity" value="${table.capacity}">
                                        </div>
                                    </div>

                                    <button class="btn-update-table">Güncelle</button>
                                </div>
                            </div>
                        </div>`;
                    
                    // Eğer detay modülü zaten varsa kaldır
                    $('.table-update-modal').remove();
                    
                    // Detay modülünü ekle
                    $('body').append(tableUpdateHTML);
                    
                    // Detay modülünü göster
                    $('.table-update-modal').fadeIn(300);
                    
                    // Kapatma butonuna tıklandığında
                    $('.close-table-update').click(function() {
                        $('.table-update-modal').fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    
                    // Modül dışına tıklandığında kapat
                    $('.table-update-modal').click(function(e) {
                        if ($(e.target).hasClass('table-update-modal')) {
                            $('.table-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Masa bilgileri alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Masa bilgileri alınırken hata oluştu!');
            }
        });
    }


    // Masada "Düzenle" butonuna tıklandığında düzenleme ikonunun görüntülenmesi için...
    $(document).on('click', '.btn-edit-table', function(e) {
        e.stopPropagation();

        displayTablesForUpdate();
    });
    
    
    // Masada "Düzenle" ikonuna tıklandığında
    $(document).on('click', '.table-item i.fa-pen-to-square', function(e) {
        e.stopPropagation();
        
        const tableId = $(this).data('table-id');
    
        updateTable(tableId);
    });

    
    function hideTableManagement(){
        $('.table-exit-button').css({
            'display': 'flex',
            'justify-content': 'space-between',
            'align-items': 'flex-end'
        }).animate({
            opacity: 1
        }, 110);
        
        $('.table-management').css({
            'display': 'none'
        }).animate({
            opacity: 0
        }, 50)
    }


    function showTableManagement(){
        $('.table-management').css({
            'display': 'block'  
        }).animate({
            opacity: 1  
        }, 400);
        
        $('.table-exit-button').animate({
            opacity: 0
        }, 50, function () {
            $(this).css('display', 'none');
        });
    }


    function fetchTables() {
    
        const branchId = localStorage.getItem('selectedBranchId');
    
        $.ajax({
            url: `${baseUrl}tables/getAllForAdmin?branchId=${branchId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                tables = response.data;

                displayTables();

                updateTableList();
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Masalar alınırken hata oluştu!");
            }
        });
    }


    // Masada "Güncelle" butonuna tıklandığında
    $(document).on('click', '.btn-update-table', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const updateModal = $(this).closest('.table-update-modal');
        
        const tableId = updateModal.data('table-id');
        const tableName = updateModal.find('.table-name').val();
        const tableNo = updateModal.find('.table-no').val();
        const tableCapacity = updateModal.find('.table-capacity').val();
        
        if (tableName.trim() === '') {
            showToast('error', 'Hata', 'Lütfen masa adını giriniz!');
            return;
        }

        if (tableNo.trim() === '') {
            showToast('error', 'Hata', 'Lütfen masa numarasını giriniz!');
            return;
        }

        if (tableCapacity.trim() === '') {
            showToast('error', 'Hata', 'Lütfen masa kapasitesini giriniz!');
            return;
        }

        const token = localStorage.getItem('token');

        $.ajax({
            url: `${baseUrl}tables/update?tableId=${tableId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                name: tableName,
                no: tableNo,
                capacity: tableCapacity
            }),
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Masa başarıyla güncellendi!');
                    
                    $('.table-update-modal').fadeOut(300, function() {
                        $(this).remove();
                    });

                    showTableManagement();

                    fetchTables();
                } else {
                    showToast('error', 'Hata', 'Masa güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Masa güncellenirken hata oluştu!');
            }
        });
    });


    // Masada "Geri Dön" butonuna tıklandığında
    $(document).on('click', '.table-exit-button', function(e) {
        e.stopPropagation();

        showTableManagement();

        displayTables();
    });


    // Silme için masaları göster
    function displayTablesForDelete() { 
        hideTableManagement()
        
        $('.table-box').empty();

        let tablesHTML = '';

        if (tables.length > 0) {
            // Masaları ekle
            tables.forEach(table => {
                tablesHTML += `
                <div class="table-item">
                    <i class="fa-solid fa-trash" data-table-id="${table.id}"></i>
                    <div class="table-number">
                        <span>${table.no}</span>
                    </div>
                    <div class="tooltip-text">
                        <span class="tooltip-label">
                            <strong>Masa Adı</strong> 
                            <span>:</span>
                            ${table.name}
                        </span>
                        </br>
                        <span class="tooltip-label">
                            <strong>Kapasite</strong> 
                            <span>:</span>
                            ${table.capacity}
                        </span>
                    </div>
                </div>`;
            })
        } else {
            tablesHTML = `
                <h3 class="empty-table-row">Henüz masa bulunmamaktadır.</h3>
            `;
        }

        $('.table-box').html(tablesHTML);
    }


    // Masada "Sil" butonuna tıklandığında silme ikonunun görüntülenmesi için...
    $(document).on('click', '.btn-delete-table', function(e) {
        e.stopPropagation();

        displayTablesForDelete();
    });


    // Masada "Sil" ikonuna tıklandığında
    $(document).on('click', '.table-item i.fa-trash', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const tableId = $(this).data('table-id');
        
        // SweetAlert2 ile özelleştirilmiş onay kutusu
        Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu masayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
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
                    url: `${baseUrl}tables/delete?tableId=${tableId}`,
                    type: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    success: function(response) {
                        if (response.success) {
                            showToast('success', 'Başarılı', 'Masa başarıyla silindi!');

                            $('.table-update-modal').fadeOut(300, function() {
                                $(this).remove();
                            });

                            showTableManagement();

                            fetchTables();
                        } else {
                            showToast('error', 'Hata', 'Masa silinirken hata oluştu!');
                        }
                    },
                    error: function(xhr) {
                        const errorMessage = xhr.responseJSON?.Message;
                        showToast('error', 'Hata', errorMessage ? errorMessage : 'Masa silinirken hata oluştu!');
                    }
                });
            }
        });
    });
    

    // Rezervasyonda "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.reservations-container.subdivision  .dropdown-pagination-option', function() {
        fetchReservations();
    });



    // Navbar'daki "Sayfalar" seçeneğine tıklandığında
    $('.sidenav a:contains("Sayfalar")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'pages' }, 'Sayfalar', '?page=pages'); 

        getPages();
    });


    // Sayfaları getiren fonksiyon
    function getPages() {
        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();

        // Sayfalar için HTML yapısı
        let pagesHTML = `
        <div class="pages-container">
            <div class="pages-header">
                <h2>Sayfa Seçiniz...</h2>
            </div>
            <div class="pages-body">
                <a href="#" class="page-box">
                    <div class="page-img">
                        <img src="../images/home-admin.jpg" alt="anasayfa"/>
                    </div>
                    <div class="page-action">
                        <button class="btn-home">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </a>
                <a href="#" class="page-box">
                    <div class="page-img">
                        <img src="../images/about-admin.jpg" alt="anasayfa"/>
                    </div>
                    <div class="page-action">
                        <button class="btn-home">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </a>
                <a href="#" class="page-box">
                    <div class="page-img">
                        <img src="../images/menu-admin.jpg" alt="anasayfa"/>
                    </div>
                    <div class="page-action">
                        <button class="btn-home">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </a>
                <a href="#" class="page-box">
                    <div class="page-img">
                        <img src="../images/gallery-admin.jpg" alt="anasayfa"/>
                    </div>
                    <div class="page-action">
                        <button class="btn-home">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </a>
            </div>
        </div>`;
        
        // Sayfaları dashboard'a ekle
        $('.dashboard-content').append(pagesHTML);
    }



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

        }else if (page === 'branchesForReservation') {
            history.replaceState({ page: 'branchesForReservation' }, 'Şubeler', '?page=branchesForReservation');
            
            getAllBranchesForReservations();

        }else if (page === 'reservationsByBranch') {
            const branchId = localStorage.getItem('selectedBranchId');
            const branchName = localStorage.getItem('selectedBranchName');

            history.replaceState({ page: 'reservationsByBranch' }, 'Rezervasyonlar', `?page=reservationsByBranch&branchId=${branchId}`);

            getReservationTemplate(branchId, branchName, 1);

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
    let branchHistory = JSON.parse(localStorage.getItem('branchHistory')) || [];

    // Şu an kullanıcı hangi menüde bulunuyor, onu takip edebilmek için bir indeks değeri tutuyoruz.
    // localStorage'dan alıyoruz, yoksa dizinin en son elemanını varsayıyoruz.
    let menuCurrentIndex = parseInt(localStorage.getItem('menuHistoryIndex')) || (menuHistory.length - 1);
    let cityCurrentIndex = parseInt(localStorage.getItem('cityHistoryIndex')) || (cityHistory.length - 1);
    let branchCurrentIndex = parseInt(localStorage.getItem('branchHistoryIndex')) || (branchHistory.length - 1);


    const Entity = {
        MENU: 0,
        CITY: 1,
        BRANCH: 2
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

        } else if (selectedEntity === Entity.BRANCH) {
            entityHistory = branchHistory;
            entityCurrentIndex = branchCurrentIndex;

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
            updateMenuNavigationState(entityId);

        } else if (selectedEntity === Entity.BRANCH) {
            branchHistory = entityHistory;
            branchCurrentIndex = entityCurrentIndex;
            updateBranchNavigationState(entityId);

        } else{
            cityHistory = entityHistory;
            cityCurrentIndex = entityCurrentIndex;
            updateCityNavigationState(entityId);
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
    
    
    function updateBranchNavigationState(branchId){
        // localStorage’a yeni geçmişi ve güncel indeksi kaydediyoruz.
        localStorage.setItem('branchHistory', JSON.stringify(branchHistory));
        localStorage.setItem('branchHistoryIndex', branchCurrentIndex);

        // URL'yi güncelliyoruz.
        history.pushState({ page: 'reservationsByBranch' }, 'Rezervasyonlar', `?page=reservationsByBranch&branchId=${branchId}`);
    }


    // Bu metot sayesinde, kullanıcı geri tuşuna bastığında doğru şekilde bir önceki menü, şube veya şehre döner.
    // Ve geçmişi düzgün yöneterek daha kontrollü bir kullanıcı deneyimi sağlanır.
    function goBackToPreviousEntity(currentIndex, selectedEntity) {

        // Eğer kullanıcı daha önce bir menü, şube veya şehri ziyaret etmişse (yani index 0'dan büyükse) geri gidiyoruz.
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

            } else if (selectedEntity === Entity.BRANCH) {

                // İlgili şubeyi geçmiş dizisinden alıyoruz.
                const previousBranch = branchHistory[currentIndex];
    
                // Eğer geçerli bir şube varsa, o şubenin rezervasyonlarını getiriyoruz.
                if (previousBranch) {
                    getReservationTemplate(previousBranch.id, previousBranch.name);
    
                    // Güncel index değerini localStorage’a kaydediyoruz.
                    localStorage.setItem('branchHistoryIndex', currentIndex);
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


    // Bu metot sayesinde, kullanıcı ileri tuşuna bastığında doğru şekilde bir sonraki menü, şube veya şehre döner.
    // Ve geçmişi düzgün yöneterek daha kontrollü bir kullanıcı deneyimi sağlanır.
    function goForwardToNextEntity(currentIndex, selectedEntity) {

        let historyList = selectedEntity === Entity.MENU 
        ? menuHistory 
        : selectedEntity === Entity.BRANCH 
            ? branchHistory 
            : cityHistory; 


        // Eğer daha ileriye gidilebilecek bir menü, şube veya şehir varsa (dizi sınırını aşmıyorsak)
        if (currentIndex < historyList.length - 1) {

            // İndeks değerini 1 artırarak bir sonraki menüyü hedefliyoruz.
            currentIndex++;

            // İlgili menüyü, şubeyi veya şehri geçmiş dizisinden alıyoruz.
            const nextItem = historyList[currentIndex];


            // Eğer geçerli bir öge varsa ilgili elemanlarını getiriyoruz.
            if (nextItem) {

                if (selectedEntity === Entity.MENU) {
                    getProductsByMenu(nextItem.id, nextItem.name);
                    localStorage.setItem('menuHistoryIndex', currentIndex);

                } else if (selectedEntity === Entity.CITY) {
                    getReservationTemplate(nextItem.id, nextItem.name);
                    localStorage.setItem('branchHistoryIndex', currentIndex);

                } else {
                    getBranchesByCity(nextItem.id, nextItem.name);
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

                case 'reservationsByBranch':
                    
                    const storedIndexBranch = parseInt(localStorage.getItem('branchHistoryIndex')) || 0;
                    const branchHistory = JSON.parse(localStorage.getItem('branchHistory')) || [];
                    
                    const currentBranchIdFromURL = params.get('branchId');
                    
                    // URL'deki şube dizide kaçıncı sıradaysa onu bul
                    const branchCurrentIndexInHistory = branchHistory.findIndex(m => m.id == currentBranchIdFromURL);
                    
                    if (branchCurrentIndexInHistory < storedIndexBranch) {
                        // Geriye gidilmiş
                        goBackToPreviousEntity(storedIndexBranch, Entity.BRANCH);

                    } else if (branchCurrentIndexInHistory > storedIndexBranch) {
                        // İleriye gidilmiş
                        goForwardToNextEntity(storedIndexBranch, Entity.BRANCH);

                    } else {
                        // Aynı yerde kalınmış
                        const branch = branchHistory[branchCurrentIndexInHistory];
                        if (branch) getReservationTemplate(branch.id, branch.name);
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
                    
                case 'branchesForReservation':
                    getAllBranchesForReservations();
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
                    
                    localStorage.removeItem('selectedBranchId');
                    localStorage.removeItem('selectedBranchName');

                    localStorage.removeItem('menuHistory');
                    localStorage.removeItem('cityHistory');
                    localStorage.removeItem('branchHistory');

                    localStorage.removeItem('menuHistoryIndex');
                    localStorage.removeItem('cityHistoryIndex');
                    localStorage.removeItem('branchHistoryIndex');

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