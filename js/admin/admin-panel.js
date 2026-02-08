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

    //Global değişkenler
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    let tables = null;
    let shiftDayDtos = null;
    let permissionListDtos = null;

    const monthNames = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];


    const days = {
        1: "PZT",
        2: "SAL",
        3: "ÇAR",
        4: "PER",
        5: "CUM",
        6: "CMT",
        7: "PAZ"
    };
    
    
    
    function handleLogout(showMessage = null) {
       
        let title = 'Başarılı';

        if (showMessage && (
            showMessage.includes('geçersiz') ||
            showMessage.includes('süreniz') ||
            showMessage.includes('dolmuş')
        )) {
            title = 'Oturum Sonlandırıldı';
        }
    
        showToast('success', title, showMessage ? showMessage : 'Çıkış yapılıyor...');
    

        setTimeout(() => {
            // Tüm localStorage verilerini temizliyoruz.
            
            localStorage.removeItem('token');
            localStorage.removeItem('expiration');
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
    
            // Giriş sayfasına yönlendiriyoruz
            window.location.href = 'admin-login.html';
        }, 2000);
    }
    

    
    // Token kontrolü
    try {    
        // Token'ı decode et
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // Role bilgisini al
        const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        // Eğer kullanıcının yetkisi admin değilse
        if (userRole !== 'Admin') {
            handleLogout("Yetkiniz yok!");
        }

        // Kullanıcı adını göster
        $('#userNameDisplay').text(userName);
    } catch (error) {

        handleLogout();
    }



    // Çıkış yap butonuna tıklandığında
    $('#logoutBtn').click(function(e) {
        e.preventDefault();

        handleLogout(); 
    });

    

    function openSidenavStyles() {
        $('#main').css('margin-left', '235px');
        $('.head').css({
            'margin-left': '235px',
            'width': 'calc(100% - 235px)'
        });
        $('.sidenav a span').css({
            'margin-left': '36px',
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

            if ($(window).width() < 992) {
                $('body').append('<div class="overlay"></div>');
                $('.overlay').addClass('active');
            }

            if($(window).width() < 480){
                $('.sidenav a span').css({'margin-left': '42px', 'opacity': '1'});
                $('.sidenav a img').css('left', '14%');
            } else if ($(window).width() < 992) {
                $('.sidenav a span').css({'margin-left': '36px', 'opacity': '1'});
            }
             else {
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
                
                $('.sidenav').css({'margin-left': '0px'});
                closeSidenavStyles();

                if($('.overlay').length > 0){
                    $('.overlay').remove();
                }
            } else {
                closeSidenavStyles();
            }

            $('#main').css('margin-left', '0px');
            $('.head').css('margin-left', '0px');
            $('.head').css('width', '100%');
        }
    }
    

    // Sayfa yüklendiğinde çalıştır
    checkScreenSize();
    

    // Ekran boyutu değiştiğinde tekrar kontrol et
    $(window).resize(function() {
        checkScreenSize();
    });


    // Global değişkenler
    const baseUrl = 'https://eatwell-api.azurewebsites.net/api/';
    let currentPage = 1; // Global tanım
    let totalPages = 1;  // Toplam sayfa sayısı
    let totalItems = 0;  // Toplam öge sayısı
    let pageItems = 10;  // Toplam görüntülenmek istenen öge sayısı


    function paginationTemplate(addToDiv, prevId, nextId, pageInfoId, totalItemsInfoId, tableName){
        const container = $(`.${addToDiv}`);
    
        // Eğer zaten pagination varsa eklemiyoruz
        if (container.find(".pagination-container").length > 0) {
            return;
        }


        let paginationsHtml = `
        <div class="pagination-container">
            <div class="pagination-page-size">
                <span class="page-size-label">Göster: </span>
                <div class="dropdown ${tableName}" id="paginationDropdown">
                    <i class="fa-solid fa-caret-down"></i>
                    
                    <div class="dropdown-toggle pagination-toggle" id="selectedValue">10</div>
                    
                    <div class="dropdown-menu">
                        <div class="dropdown-option pagination-option" data-pagination-id="10">10</div>
                        <div class="dropdown-option pagination-option" data-pagination-id="15">15</div>
                        <div class="dropdown-option pagination-option" data-pagination-id="20">20</div>
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

        container.append(paginationsHtml);
    }



    // Pagination bölümündeki "Göster" option'ına veya ikonuna tıklandığında
    $(document).on('click', '#paginationDropdown .dropdown-toggle, #paginationDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#paginationDropdown");
    });
    



    // Hoş geldin bölümünü başlat
    function initWelcomeSection() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        $('#currentDate').text(now.toLocaleDateString('tr-TR', options));
    }

    // Sayı animasyonu
    function animateCount(element, target) {
        const duration = 1000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            element.text(current);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    // Chart instance'larını sakla
    let ordersChartInstance = null;
    let reservationsChartInstance = null;
    let categoriesChartInstance = null;

    // Dashboard grafiklerini oluştur
    function initDashboardCharts() {
        // Aylık Sipariş Trendi - Bar Chart
        const ordersCtx = document.getElementById('ordersChart');
        if (ordersCtx) {
            ordersChartInstance = new Chart(ordersCtx, {
                type: 'bar',
                data: {
                    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                    datasets: [{
                        label: 'Siparişler',
                        data: [65, 78, 90, 81, 95, 110, 130, 125, 105, 98, 115, 140],
                        backgroundColor: 'rgba(126, 70, 229, 0.7)',
                        borderColor: '#4F46E5',
                        borderWidth: 0,
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: .6,
                        categoryPercentage: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#F1F5F9' },
                            ticks: { color: '#64748B', font: { family: 'Poppins' } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#64748B', font: { family: 'Poppins' } }
                        }
                    }
                }
            });
        }

        // Rezervasyon Durumu - Doughnut Chart
        const reservationsCtx = document.getElementById('reservationsChart');
        if (reservationsCtx) {
            reservationsChartInstance = new Chart(reservationsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Onaylanan', 'Bekleyen', 'İptal'],
                    datasets: [{
                        data: [60, 25, 15],
                        backgroundColor: ['#10b95c', '#f5be0b', '#eb3131'],
                        borderWidth: 0,
                        spacing: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyleWidth: 17,
                                font: { family: 'Poppins', size: 13 }
                            }
                        }
                    }
                }
            });
        }

        // Popüler Menü Kategorileri - Pie Chart
        const categoriesCtx = document.getElementById('categoriesChart');
        if (categoriesCtx) {
            categoriesChartInstance = new Chart(categoriesCtx, {
                type: 'pie',
                data: {
                    labels: ['Ana Yemek', 'Tatlılar', 'İçecekler', 'Salatalar', 'Başlangıçlar'],
                    datasets: [{
                        data: [35, 20, 25, 10, 10],
                        backgroundColor: ['#4F46E5', '#EC4899', '#06B6D4', '#10B981', '#F59E0B'],
                        borderWidth: 0,
                        spacing: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                usePointStyle: true,
                                pointStyleWidth: 17,
                                font: { family: 'Poppins', size: 13 }
                            }
                        }
                    }
                }
            });
        }
    }

    // Son siparişler tablosunu doldur (örnek veri)
    function populateRecentOrders() {
        const orders = [
            { no: '#1042', customer: 'Ahmet Yılmaz', amount: '₺245,00', status: 'completed', statusText: 'Tamamlandı', date: '07.02.2026' },
            { no: '#1041', customer: 'Ayşe Demir', amount: '₺180,50', status: 'preparing', statusText: 'Hazırlanıyor', date: '07.02.2026' },
            { no: '#1040', customer: 'Mehmet Kaya', amount: '₺320,00', status: 'pending', statusText: 'Bekliyor', date: '06.02.2026' },
            { no: '#1039', customer: 'Fatma Çelik', amount: '₺95,00', status: 'completed', statusText: 'Tamamlandı', date: '06.02.2026' },
            { no: '#1038', customer: 'Ali Öztürk', amount: '₺410,75', status: 'cancelled', statusText: 'İptal', date: '05.02.2026' }
        ];

        let html = '';
        orders.forEach(order => {
            html += `
                <tr class="recent-order-row">
                    <td><strong>${order.no}</strong></td>
                    <td>${order.customer}</td>
                    <td>${order.amount}</td>
                    <td><span class="order-status ${order.status}">${order.statusText}</span></td>
                    <td>${order.date}</td>
                </tr>`;
        });
        $('#recentOrdersBody').html(html);
    }

    // İstatistikleri API'den al
    function getStatistics() {
        const token = localStorage.getItem('token');

        // Hoş geldin bölümünü başlat
        initWelcomeSection();

        $.ajax({
            url: `${baseUrl}dashboards`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                const data = response.data;

                // İstatistik kartlarını animasyonlu güncelle
                animateCount($('#statUsers'), data.userCount || 0);
                animateCount($('#statOrders'), data.orderCount || 0);
                animateCount($('#statReservations'), data.reservationCount || 0);
                animateCount($('#statEmployees'), data.employeeCount || 0);

                // Grafikleri oluştur
                initDashboardCharts();

                // Son siparişler tablosunu doldur
                populateRecentOrders();
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'İstatistikler alınırken hata oluştu!');

                // Hata durumunda da grafikleri ve tabloyu göster
                initDashboardCharts();
                populateRecentOrders();
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



    // Kullanıcılar tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-users-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        fetchUsers();
    });



    // Tarihi formatla
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    }

    // Kullanıcıları göster
    function displayUsers(response) {

        $('#usersTableBody').empty();

        // Kullanıcı verisini sakla (arama/filtre için)
        allUsersData = response.data;

        renderUsersTable(response.data);

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#userPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#userTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevUserPage').prop('disabled', !response.hasPrevious);
        $('#nextUserPage').prop('disabled', !response.hasNext);
    }

    // Kullanıcı tablosunu render et
    function renderUsersTable(users) {
        $('#usersTableBody').empty();

        let usersTableHTML = '';

        if (users.length > 0) {
            users.forEach(user => {
                const initials = getInitials(user.firstName, user.lastName);
                const color = getAvatarColor(user.firstName + user.lastName);
                const formattedDate = formatDate(user.createDate);
                const mock = mockUserOrderData[user.id] || { orderCount: 0, totalSpent: 0, isVip: false };
                const verificationBadge = user.verification
                    ? '<span class="badge-verified" title="Doğrulanmış"><i class="fa fa-circle-check"></i> Doğrulanmış</span>'
                    : '<span class="badge-unverified" title="Doğrulanmamış"><i class="fa fa-circle-xmark"></i> Doğrulanmamış</span>';
                const vipBadge = mock.isVip ? '<span class="badge-vip"><i class="fa fa-crown"></i> VIP</span>' : '';

                usersTableHTML += `
                    <tr class="user-row" data-user-id="${user.id}">
                        <td class="user-cell">
                            <div class="user-cell-wrapper">
                                <div class="user-avatar-sm" style="background: ${color};">${initials}</div>
                                <div class="user-cell-info">
                                    <div class="user-cell-name">${user.firstName} ${user.lastName} ${vipBadge}</div>
                                    <div class="user-cell-email">${user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td><strong>${mock.orderCount}</strong></td>
                        <td>${mock.totalSpent > 0 ? formatCurrency(mock.totalSpent) : '-'}</td>
                        <td>${formattedDate}</td>
                        <td>${verificationBadge}</td>
                        <td class="user-actions-cell">
                            <div class="actions-wrapper">
                                <button class="user-action-btn btn-view-user" data-user-id="${user.id}" title="Detay"><i class="fa fa-eye"></i></button>
                                <button class="user-action-btn btn-discount-user" data-user-id="${user.id}" title="İndirim"><i class="fa fa-percent"></i></button>
                                <button class="user-action-btn btn-vip-user ${mock.isVip ? 'active' : ''}" data-user-id="${user.id}" title="VIP"><i class="fa fa-crown"></i></button>
                            </div>
                        </td>
                    </tr>`;
            });
        } else {
            usersTableHTML = `
                <tr>
                    <td colspan="6" class="empty-table-row">Kullanıcı bulunamadı.</td>
                </tr>`;
        }

        $('#usersTableBody').html(usersTableHTML);
    }



    function fetchUsers(){
        $.ajax({
            url: `${baseUrl}users/getall?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                paginationTemplate("users-container", "prevUserPage", "nextUserPage", "userPageInfo", "userTotalItemsInfo", "pagination-users-table");

                // Kullanıcıları göster
                displayUsers(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Kullanıcılar alınırken hata oluştu!");
            }
        });
    }

    // Kullanıcı istatistiklerini getir (büyük sayfa ile tüm kullanıcıları çek)
    function fetchUserStats() {
        $.ajax({
            url: `${baseUrl}users/getall?pageNumber=1&pageSize=10000`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                const users = response.data || [];
                const total = response.totalItems || users.length;
                const verified = users.filter(u => u.verification === true).length;
                const unverified = total - verified;

                // Bu ay kayıt olan kullanıcıları hesapla
                const now = new Date();
                const thisMonth = users.filter(u => {
                    const d = new Date(u.createDate);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length;

                // Mock sipariş verileri üret
                generateMockUserStats(users);

                // Toplam gelir ve ortalama sepet hesapla
                const allMock = Object.values(mockUserOrderData);
                const totalRevenue = allMock.reduce((sum, m) => sum + m.totalSpent, 0);
                const ordersWithSpent = allMock.filter(m => m.orderCount > 0);
                const avgBasket = ordersWithSpent.length > 0
                    ? Math.round(ordersWithSpent.reduce((sum, m) => sum + m.avgBasket, 0) / ordersWithSpent.length)
                    : 0;

                // İstatistik kartlarını güncelle
                $('#statTotalUsers').text(total);
                $('#statVerifiedUsers').text(verified);
                $('#statUnverifiedUsers').text(unverified);
                $('#statNewUsers').text(thisMonth);
                $('#statTotalRevenue').text(formatCurrency(totalRevenue));
                $('#statAvgBasket').text(formatCurrency(avgBasket));

                // Grafikleri oluştur
                initUserCharts(users);

                // VIP Top 5 listesi oluştur
                renderVipTopList(users);
            },
            error: function() {
                $('#statTotalUsers').text('-');
                $('#statVerifiedUsers').text('-');
                $('#statUnverifiedUsers').text('-');
                $('#statNewUsers').text('-');
                $('#statTotalRevenue').text('-');
                $('#statAvgBasket').text('-');
            }
        });
    }

    // Kullanıcı grafiklerini oluştur
    function initUserCharts(users) {
        // 1. Aylık Yeni Kullanıcı Trendi (Bar Chart)
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const now = new Date();
        const monthlyNew = new Array(12).fill(0);
        users.forEach(u => {
            const d = new Date(u.createDate);
            if (d.getFullYear() === now.getFullYear()) {
                monthlyNew[d.getMonth()]++;
            }
        });
        // Geçmiş aylar için mock veri ekle (veri yoksa)
        for (let i = 0; i < 12; i++) {
            if (monthlyNew[i] === 0 && i < now.getMonth()) {
                monthlyNew[i] = Math.floor(seededRandom(i + 100) * 15) + 3;
            }
        }

        const newCtx = document.getElementById('usersNewChart');
        if (newCtx) {
            usersNewChartInstance = new Chart(newCtx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Yeni Kullanıcı',
                        data: monthlyNew,
                        backgroundColor: 'rgba(6, 182, 212, 0.7)',
                        borderColor: '#06B6D4',
                        borderWidth: 0,
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.6,
                        categoryPercentage: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { color: '#64748B', font: { family: 'Poppins' } } },
                        x: { grid: { display: false }, ticks: { color: '#64748B', font: { family: 'Poppins' } } }
                    }
                }
            });
        }

        // 2. Sipariş Veren vs Vermeyen (Doughnut)
        const allMock = Object.values(mockUserOrderData);
        const withOrders = allMock.filter(m => m.orderCount > 0).length;
        const withoutOrders = allMock.length - withOrders;

        const orderCtx = document.getElementById('usersOrderChart');
        if (orderCtx) {
            usersOrderChartInstance = new Chart(orderCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Sipariş Veren', 'Sipariş Vermeyen'],
                    datasets: [{
                        data: [withOrders, withoutOrders],
                        backgroundColor: ['#10B981', '#EF4444'],
                        borderWidth: 0,
                        spacing: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 20, usePointStyle: true, pointStyleWidth: 17, font: { family: 'Poppins', size: 13 } }
                        }
                    }
                }
            });
        }

        // 3. Aktif Kullanıcı Trendi (Line Chart - Son 6 ay)
        const activeMonths = [];
        const activeData = [];
        for (let i = 5; i >= 0; i--) {
            const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
            activeMonths.push(months[m.getMonth()]);
            activeData.push(Math.floor(seededRandom(m.getMonth() + 200) * 40) + 20 + users.length * 0.3);
        }

        const activeCtx = document.getElementById('usersActiveChart');
        if (activeCtx) {
            usersActiveChartInstance = new Chart(activeCtx, {
                type: 'line',
                data: {
                    labels: activeMonths,
                    datasets: [{
                        label: 'Aktif Kullanıcı',
                        data: activeData,
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#8B5CF6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { color: '#64748B', font: { family: 'Poppins' } } },
                        x: { grid: { display: false }, ticks: { color: '#64748B', font: { family: 'Poppins' } } }
                    }
                }
            });
        }

        // 4. Kullanıcı Kaybı / Churn (Doughnut)
        const totalU = users.length;
        const active = Math.floor(totalU * 0.6);
        const atRisk = Math.floor(totalU * 0.25);
        const churned = totalU - active - atRisk;

        const churnCtx = document.getElementById('usersChurnChart');
        if (churnCtx) {
            usersChurnChartInstance = new Chart(churnCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Aktif', 'Risk Altında', 'Kayıp'],
                    datasets: [{
                        data: [active, atRisk, churned],
                        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                        borderWidth: 0,
                        spacing: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 20, usePointStyle: true, pointStyleWidth: 17, font: { family: 'Poppins', size: 13 } }
                        }
                    }
                }
            });
        }
    }

    // VIP Top 5 müşteriler listesi
    function renderVipTopList(users) {
        const ranked = users
            .map(u => ({ ...u, mock: mockUserOrderData[u.id] || { orderCount: 0, totalSpent: 0, isVip: false } }))
            .filter(u => u.mock.totalSpent > 0)
            .sort((a, b) => b.mock.totalSpent - a.mock.totalSpent)
            .slice(0, 5);

        let html = '';
        ranked.forEach((user, idx) => {
            const initials = getInitials(user.firstName, user.lastName);
            const color = getAvatarColor(user.firstName + user.lastName);
            const medal = idx === 0 ? 'vip-gold' : idx === 1 ? 'vip-silver' : idx === 2 ? 'vip-bronze' : '';

            html += `
            <div class="vip-item ${medal}">
                <div class="vip-rank">${idx + 1}</div>
                <div class="user-avatar-sm" style="background: ${color};">${initials}</div>
                <div class="vip-info">
                    <div class="vip-name">${user.firstName} ${user.lastName}</div>
                    <div class="vip-email">${user.email}</div>
                </div>
                <div class="vip-stats">
                    <div class="vip-amount">${formatCurrency(user.mock.totalSpent)}</div>
                    <div class="vip-orders">${user.mock.orderCount} sipariş</div>
                </div>
            </div>`;
        });

        if (!html) {
            html = '<p style="text-align:center;color:#94A3B8;padding:20px">Henüz sipariş verisi yok.</p>';
        }

        $('#vipTopList').html(html);
    }

    // Arama ve filtreleme
    function filterAndSearchUsers() {
        const searchText = ($('#usersSearchInput').val() || '').toLowerCase().trim();

        let filtered = allUsersData;

        // Doğrulama filtresi
        if (currentFilter === 'verified') {
            filtered = filtered.filter(u => u.verification === true);
        } else if (currentFilter === 'unverified') {
            filtered = filtered.filter(u => u.verification !== true);
        } else if (currentFilter === 'vip') {
            filtered = filtered.filter(u => mockUserOrderData[u.id] && mockUserOrderData[u.id].isVip);
        }

        // Arama filtresi
        if (searchText) {
            filtered = filtered.filter(u =>
                (u.firstName && u.firstName.toLowerCase().includes(searchText)) ||
                (u.lastName && u.lastName.toLowerCase().includes(searchText)) ||
                (u.email && u.email.toLowerCase().includes(searchText)) ||
                ((u.firstName + ' ' + u.lastName).toLowerCase().includes(searchText))
            );
        }

        renderUsersTable(filtered);
    }

    // Arama kutusu event
    $(document).on('input', '#usersSearchInput', function() {
        filterAndSearchUsers();
    });

    // Filtre butonları event
    $(document).on('click', '.users-filter-btn', function() {
        $('.users-filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        filterAndSearchUsers();
    });



    // Avatar renk paleti
    const avatarColors = ['#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'];

    function getAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return avatarColors[Math.abs(hash) % avatarColors.length];
    }

    function getInitials(firstName, lastName) {
        return ((firstName ? firstName[0] : '') + (lastName ? lastName[0] : '')).toUpperCase();
    }

    // Tüm kullanıcı verisini sakla (arama/filtre için)
    let allUsersData = [];
    let currentFilter = 'all';
    let mockUserOrderData = {};
    let usersNewChartInstance = null;
    let usersOrderChartInstance = null;
    let usersActiveChartInstance = null;
    let usersChurnChartInstance = null;

    // Deterministik pseudo-random (user.id bazlı, her yenilemede aynı sonuç)
    function seededRandom(seed) {
        let x = Math.sin(seed * 9301 + 49297) * 49297;
        return x - Math.floor(x);
    }

    // Mock sipariş verisi üret
    function generateMockUserStats(users) {
        mockUserOrderData = {};
        users.forEach(user => {
            const seed = user.id;
            const hasOrders = seededRandom(seed) > 0.25; // %75 kullanıcı sipariş vermiş
            const orderCount = hasOrders ? Math.floor(seededRandom(seed + 1) * 45) + 1 : 0;
            const avgBasket = hasOrders ? Math.floor(seededRandom(seed + 2) * 350) + 50 : 0;
            const totalSpent = orderCount * avgBasket;
            const daysSinceLastOrder = hasOrders ? Math.floor(seededRandom(seed + 3) * 90) : -1;
            const lastOrderDate = hasOrders ? new Date(Date.now() - daysSinceLastOrder * 86400000) : null;

            mockUserOrderData[user.id] = {
                orderCount,
                totalSpent,
                avgBasket,
                lastOrderDate,
                isVip: false // VIP sonra hesaplanacak
            };
        });

        // Top %10 harcama yapanları VIP olarak işaretle
        const sortedBySpent = Object.entries(mockUserOrderData)
            .filter(([, d]) => d.totalSpent > 0)
            .sort((a, b) => b[1].totalSpent - a[1].totalSpent);
        const vipCount = Math.max(1, Math.ceil(sortedBySpent.length * 0.1));
        sortedBySpent.slice(0, vipCount).forEach(([id]) => {
            mockUserOrderData[id].isVip = true;
        });

        return mockUserOrderData;
    }

    function formatCurrency(amount) {
        return '₺' + amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Chart instance'ları temizle
    function destroyUserCharts() {
        if (usersNewChartInstance) { usersNewChartInstance.destroy(); usersNewChartInstance = null; }
        if (usersOrderChartInstance) { usersOrderChartInstance.destroy(); usersOrderChartInstance = null; }
        if (usersActiveChartInstance) { usersActiveChartInstance.destroy(); usersActiveChartInstance = null; }
        if (usersChurnChartInstance) { usersChurnChartInstance.destroy(); usersChurnChartInstance = null; }
    }

    // Kullanıcıları getiren fonksiyon
    function getUsers(page = 1) {

        // Dashboard içeriğini temizle
        destroyUserCharts();
        $('.dashboard-content').empty();

        currentPage = page;

        // Kullanıcılar için HTML yapısı
        let usersHTML = `
        <div class="users-container">
            <div class="users-header">
                <h2>Kullanıcı Yönetimi</h2>
            </div>

            <!-- İstatistik Kartları -->
            <div class="users-stats-grid">
                <div class="users-stat-card" style="--accent-color: #06B6D4;">
                    <div class="users-stat-icon">
                        <i class="fa fa-users"></i>
                    </div>
                    <div class="users-stat-info">
                        <span class="users-stat-count" id="statTotalUsers">-</span>
                        <span class="users-stat-label">Toplam Kullanıcı</span>
                    </div>
                </div>
                <div class="users-stat-card" style="--accent-color: #10B981;">
                    <div class="users-stat-icon">
                        <i class="fa fa-user-check"></i>
                    </div>
                    <div class="users-stat-info">
                        <span class="users-stat-count" id="statVerifiedUsers">-</span>
                        <span class="users-stat-label">Doğrulanmış</span>
                    </div>
                </div>
                <div class="users-stat-card" style="--accent-color: #EF4444;">
                    <div class="users-stat-icon">
                        <i class="fa fa-user-xmark"></i>
                    </div>
                    <div class="users-stat-info">
                        <span class="users-stat-count" id="statUnverifiedUsers">-</span>
                        <span class="users-stat-label">Doğrulanmamış</span>
                    </div>
                </div>
                <div class="users-stat-card" style="--accent-color: #F59E0B;">
                    <div class="users-stat-icon">
                        <i class="fa fa-user-plus"></i>
                    </div>
                    <div class="users-stat-info">
                        <span class="users-stat-count" id="statNewUsers">-</span>
                        <span class="users-stat-label">Bu Ay Kayıt</span>
                    </div>
                </div>
                <div class="users-stat-card" style="--accent-color: #8B5CF6;">
                    <div class="users-stat-icon">
                        <i class="fa fa-turkish-lira-sign"></i>
                    </div>
                    <div class="users-stat-info">
                        <span class="users-stat-count" id="statTotalRevenue">-</span>
                        <span class="users-stat-label">Toplam Gelir</span>
                    </div>
                </div>
                <div class="users-stat-card" style="--accent-color: #EC4899;">
                    <div class="users-stat-icon">
                        <i class="fa fa-receipt"></i>
                    </div>
                    <div class="users-stat-info">
                        <span class="users-stat-count" id="statAvgBasket">-</span>
                        <span class="users-stat-label">Ort. Sepet Tutarı</span>
                    </div>
                </div>
            </div>

            <!-- Arama ve Filtre Çubuğu -->
            <div class="users-toolbar">
                <div class="users-search-box">
                    <i class="fa fa-search"></i>
                    <input type="text" id="usersSearchInput" placeholder="İsim veya e-posta ile ara...">
                </div>
                <div class="users-filter-group">
                    <button class="users-filter-btn active" data-filter="all">Tümü</button>
                    <button class="users-filter-btn" data-filter="verified">Doğrulanmış</button>
                    <button class="users-filter-btn" data-filter="unverified">Doğrulanmamış</button>
                    <button class="users-filter-btn" data-filter="vip"><i class="fa fa-crown" style="color:#F59E0B;margin-right:4px"></i>VIP</button>
                </div>
            </div>

            <div class="users-body">
                <div class="users-table-wrapper px-7">
                    <table class="users-table">
                        <thead>
                            <tr>
                                <th>Kullanıcı</th>
                                <th>Sipariş</th>
                                <th>Harcama</th>
                                <th>Kayıt Tarihi</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Grafikler -->
        <div class="users-charts-section">
            <div class="charts-grid">
                <div class="chart-card chart-large">
                    <div class="chart-card-header">
                        <h3>Aylık Yeni Kullanıcı Trendi</h3>
                    </div>
                    <div class="chart-card-body">
                        <canvas id="usersNewChart"></canvas>
                    </div>
                </div>
                <div class="chart-card chart-small">
                    <div class="chart-card-header">
                        <h3>Sipariş Veren ve Vermeyen</h3>
                    </div>
                    <div class="chart-card-body">
                        <canvas id="usersOrderChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="charts-grid">
                <div class="chart-card chart-large">
                    <div class="chart-card-header">
                        <h3>Aktif Kullanıcı Trendi</h3>
                    </div>
                    <div class="chart-card-body">
                        <canvas id="usersActiveChart"></canvas>
                    </div>
                </div>
                <div class="chart-card chart-small">
                    <div class="chart-card-header">
                        <h3>Kullanıcı Kaybı (Churn)</h3>
                    </div>
                    <div class="chart-card-body">
                        <canvas id="usersChurnChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- VIP Top 5 Müşteriler -->
        <div class="users-vip-section">
            <div class="chart-card">
                <div class="chart-card-header">
                    <h3><i class="fa fa-crown" style="color:#F59E0B;margin-right:8px"></i>Top 5 VIP Müşteriler</h3>
                </div>
                <div class="chart-card-body vip-card-body">
                    <div id="vipTopList" class="vip-top-list"></div>
                </div>
            </div>
        </div>
        `;

        // Dashboard'a ekle
        $('.dashboard-content').append(usersHTML);

        fetchUsers();
        fetchUserStats();
    }



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
            url: `${baseUrl}users/get?userId=${userId}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                if (response.success && response.data) {
                    const user = response.data;
                    const formattedCreateDate = formatDate(user.createDate);
                    const formattedLastLoginDate = user.lastLoginDate ? formatDate(user.lastLoginDate) : '-';
                    const initials = getInitials(user.firstName, user.lastName);
                    const color = getAvatarColor(user.firstName + user.lastName);
                    const mock = mockUserOrderData[user.id] || { orderCount: 0, totalSpent: 0, avgBasket: 0, lastOrderDate: null, isVip: false };

                    // Kullanıcı durumunu belirle
                    const daysSinceLogin = user.lastLoginDate
                        ? Math.floor((Date.now() - new Date(user.lastLoginDate).getTime()) / 86400000)
                        : 999;
                    let statusClass = 'status-active';
                    let statusText = 'Aktif';
                    let statusIcon = 'fa-circle-check';
                    if (daysSinceLogin > 60) {
                        statusClass = 'status-churned';
                        statusText = 'Kayıp';
                        statusIcon = 'fa-circle-xmark';
                    } else if (daysSinceLogin > 30) {
                        statusClass = 'status-risk';
                        statusText = 'Risk Altında';
                        statusIcon = 'fa-triangle-exclamation';
                    }

                    const vipBadgeHTML = mock.isVip
                        ? '<div class="udm-vip-crown"><i class="fa fa-crown"></i></div>'
                        : '';

                    const verifiedIcon = user.verification
                        ? '<i class="fa fa-circle-check udm-verified-tick"></i>'
                        : '';

                    let userDetailsHTML = `
                    <div class="user-details-modal">
                        <div class="udm-panel">

                            <!-- Üst Profil Bölümü - Gradient Header -->
                            <div class="udm-hero" style="--hero-color: ${color};">
                                <button class="udm-close">&times;</button>
                                ${vipBadgeHTML}
                                <div class="udm-avatar" style="background: ${color}; box-shadow: 0 0 0 4px #fff, 0 0 0 6px ${color}40;">${initials}</div>
                                <div class="udm-identity">
                                    <h3 class="udm-fullname">${user.firstName} ${user.lastName} ${verifiedIcon}</h3>
                                    <p class="udm-email"><i class="fa fa-envelope"></i> ${user.email}</p>
                                    <div class="udm-badges">
                                        <span class="udm-status-pill ${statusClass}"><i class="fa ${statusIcon}"></i> ${statusText}</span>
                                        ${user.verification ? '<span class="udm-status-pill status-verified"><i class="fa fa-shield-halved"></i> Doğrulanmış</span>' : '<span class="udm-status-pill status-unverified"><i class="fa fa-shield-halved"></i> Doğrulanmamış</span>'}
                                        ${mock.isVip ? '<span class="udm-status-pill status-vip"><i class="fa fa-crown"></i> VIP Müşteri</span>' : ''}
                                    </div>
                                </div>
                            </div>

                            <!-- İstatistik Kartları Grid -->
                            <div class="udm-stats-row">
                                <div class="udm-stat-card">
                                    <div class="udm-stat-icon" style="background: #EFF6FF; color: #3B82F6;"><i class="fa fa-shopping-bag"></i></div>
                                    <div class="udm-stat-data">
                                        <span class="udm-stat-number">${mock.orderCount}</span>
                                        <span class="udm-stat-text">Toplam Sipariş</span>
                                    </div>
                                </div>
                                <div class="udm-stat-card">
                                    <div class="udm-stat-icon" style="background: #F0FDF4; color: #22C55E;"><i class="fa fa-turkish-lira-sign"></i></div>
                                    <div class="udm-stat-data">
                                        <span class="udm-stat-number">${formatCurrency(mock.totalSpent)}</span>
                                        <span class="udm-stat-text">Toplam Harcama</span>
                                    </div>
                                </div>
                                <div class="udm-stat-card">
                                    <div class="udm-stat-icon" style="background: #FFF7ED; color: #F97316;"><i class="fa fa-receipt"></i></div>
                                    <div class="udm-stat-data">
                                        <span class="udm-stat-number">${formatCurrency(mock.avgBasket)}</span>
                                        <span class="udm-stat-text">Ort. Sepet</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab Menüsü -->
                            <div class="udm-tabs">
                                <button class="udm-tab active" data-tab="info"><i class="fa fa-user"></i> Bilgiler</button>
                                <button class="udm-tab" data-tab="timeline"><i class="fa fa-clock-rotate-left"></i> Zaman Çizelgesi</button>
                                <button class="udm-tab" data-tab="actions"><i class="fa fa-bolt"></i> Aksiyonlar</button>
                            </div>

                            <!-- Tab İçerikleri -->
                            <div class="udm-tab-content">

                                <!-- Bilgiler Tab -->
                                <div class="udm-tab-pane active" id="udm-tab-info">
                                    <div class="udm-info-grid">
                                        <div class="udm-info-card">
                                            <div class="udm-info-icon"><i class="fa fa-calendar-plus"></i></div>
                                            <div class="udm-info-data">
                                                <span class="udm-info-label">Kayıt Tarihi</span>
                                                <span class="udm-info-value">${formattedCreateDate}</span>
                                            </div>
                                        </div>
                                        <div class="udm-info-card">
                                            <div class="udm-info-icon"><i class="fa fa-right-to-bracket"></i></div>
                                            <div class="udm-info-data">
                                                <span class="udm-info-label">Son Giriş</span>
                                                <span class="udm-info-value">${formattedLastLoginDate}</span>
                                            </div>
                                        </div>
                                        <div class="udm-info-card">
                                            <div class="udm-info-icon"><i class="fa fa-bag-shopping"></i></div>
                                            <div class="udm-info-data">
                                                <span class="udm-info-label">Son Sipariş</span>
                                                <span class="udm-info-value">${mock.lastOrderDate ? formatDate(mock.lastOrderDate.toISOString()) : 'Henüz yok'}</span>
                                            </div>
                                        </div>
                                        <div class="udm-info-card">
                                            <div class="udm-info-icon"><i class="fa fa-fingerprint"></i></div>
                                            <div class="udm-info-data">
                                                <span class="udm-info-label">Kullanıcı ID</span>
                                                <span class="udm-info-value">#${user.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Zaman Çizelgesi Tab -->
                                <div class="udm-tab-pane" id="udm-tab-timeline">
                                    <div class="udm-timeline">
                                        ${mock.lastOrderDate ? `
                                        <div class="udm-tl-item">
                                            <div class="udm-tl-dot" style="background:#3B82F6"></div>
                                            <div class="udm-tl-body">
                                                <span class="udm-tl-date">${formatDate(mock.lastOrderDate.toISOString())}</span>
                                                <p class="udm-tl-text"><i class="fa fa-bag-shopping"></i> Son sipariş verildi - ${formatCurrency(mock.avgBasket)}</p>
                                            </div>
                                        </div>` : ''}
                                        ${user.lastLoginDate ? `
                                        <div class="udm-tl-item">
                                            <div class="udm-tl-dot" style="background:#22C55E"></div>
                                            <div class="udm-tl-body">
                                                <span class="udm-tl-date">${formattedLastLoginDate}</span>
                                                <p class="udm-tl-text"><i class="fa fa-right-to-bracket"></i> Son giriş yapıldı</p>
                                            </div>
                                        </div>` : ''}
                                        ${mock.orderCount > 5 ? `
                                        <div class="udm-tl-item">
                                            <div class="udm-tl-dot" style="background:#F59E0B"></div>
                                            <div class="udm-tl-body">
                                                <span class="udm-tl-date">Milestone</span>
                                                <p class="udm-tl-text"><i class="fa fa-trophy"></i> ${mock.orderCount} sipariş tamamlandı!</p>
                                            </div>
                                        </div>` : ''}
                                        ${user.verification ? `
                                        <div class="udm-tl-item">
                                            <div class="udm-tl-dot" style="background:#8B5CF6"></div>
                                            <div class="udm-tl-body">
                                                <span class="udm-tl-date">Hesap</span>
                                                <p class="udm-tl-text"><i class="fa fa-circle-check"></i> E-posta doğrulaması tamamlandı</p>
                                            </div>
                                        </div>` : ''}
                                        <div class="udm-tl-item">
                                            <div class="udm-tl-dot" style="background:#06B6D4"></div>
                                            <div class="udm-tl-body">
                                                <span class="udm-tl-date">${formattedCreateDate}</span>
                                                <p class="udm-tl-text"><i class="fa fa-user-plus"></i> Hesap oluşturuldu</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Aksiyonlar Tab -->
                                <div class="udm-tab-pane" id="udm-tab-actions">
                                    <div class="udm-actions-grid">
                                        <button class="udm-action-card btn-deactivate" data-user-id="${user.id}">
                                            <div class="udm-action-icon" style="background:#FEE2E2; color:#DC2626;"><i class="fa fa-ban"></i></div>
                                            <div class="udm-action-text">
                                                <strong>Pasif Yap</strong>
                                                <span>Hesabı geçici olarak dondur</span>
                                            </div>
                                        </button>
                                        <button class="udm-action-card btn-discount" data-user-id="${user.id}">
                                            <div class="udm-action-icon" style="background:#EDE9FE; color:#7C3AED;"><i class="fa fa-percent"></i></div>
                                            <div class="udm-action-text">
                                                <strong>İndirim Tanımla</strong>
                                                <span>Özel indirim kuponu oluştur</span>
                                            </div>
                                        </button>
                                        <button class="udm-action-card btn-notify" data-user-id="${user.id}">
                                            <div class="udm-action-icon" style="background:#CFFAFE; color:#0891B2;"><i class="fa fa-envelope"></i></div>
                                            <div class="udm-action-text">
                                                <strong>Bildirim Gönder</strong>
                                                <span>E-posta veya push bildirim</span>
                                            </div>
                                        </button>
                                        <button class="udm-action-card btn-vip-toggle ${mock.isVip ? 'active' : ''}" data-user-id="${user.id}">
                                            <div class="udm-action-icon" style="background:#FEF3C7; color:#D97706;"><i class="fa fa-crown"></i></div>
                                            <div class="udm-action-text">
                                                <strong>${mock.isVip ? 'VIP Kaldır' : 'VIP Etiketle'}</strong>
                                                <span>${mock.isVip ? 'VIP ayrıcalıklarını kaldır' : 'Özel ayrıcalıklar tanımla'}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>`;

                    $('.user-details-modal').remove();
                    $('body').append(userDetailsHTML);
                    $('.user-details-modal').fadeIn(300);

                    // Tab switching
                    $('.udm-tab').click(function() {
                        const tab = $(this).data('tab');
                        $('.udm-tab').removeClass('active');
                        $(this).addClass('active');
                        $('.udm-tab-pane').removeClass('active');
                        $(`#udm-tab-${tab}`).addClass('active');
                    });

                    $('.udm-close').click(function() {
                        $('.user-details-modal').fadeOut(300, function() { $(this).remove(); });
                    });

                    $('.user-details-modal').click(function(e) {
                        if ($(e.target).hasClass('user-details-modal')) {
                            $('.user-details-modal').fadeOut(300, function() { $(this).remove(); });
                        }
                    });
                } else {
                    showToast('error', 'Hata', 'Kullanıcı detayı alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'Kullanıcı detayı alınırken hata oluştu!');
            }
        });
    }

    // Kullanıcı detay görüntüleme butonu (tablo)
    $(document).on('click', '.btn-view-user', function(e) {
        e.stopPropagation();
        const userId = $(this).data('user-id');
        getUserDetails(userId);
    });

    // Kullanıcı satırına tıklama olayı
    $(document).on('click', '.user-row', function(e) {
        // Aksiyon butonlarına tıklanmadıysa detay aç
        if ($(e.target).closest('.user-actions-cell').length) return;
        const userId = $(this).data('user-id');
        getUserDetails(userId);
    });

    // İndirim butonu (tablo ve modal)
    $(document).on('click', '.btn-discount-user, .btn-discount', function(e) {
        e.stopPropagation();
        const userId = $(this).data('user-id');
        Swal.fire({
            title: 'İndirim Tanımla',
            input: 'number',
            inputLabel: 'İndirim yüzdesi (%)',
            inputPlaceholder: 'Örn: 15',
            inputAttributes: { min: 1, max: 100 },
            showCancelButton: true,
            confirmButtonText: 'Uygula',
            cancelButtonText: 'İptal',
            confirmButtonColor: '#8B5CF6'
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                showToast('success', 'Başarılı', `%${result.value} indirim kullanıcıya tanımlandı.`);
            }
        });
    });

    // VIP butonu (tablo)
    $(document).on('click', '.btn-vip-user', function(e) {
        e.stopPropagation();
        const userId = $(this).data('user-id');
        const btn = $(this);
        const isVip = btn.hasClass('active');
        btn.toggleClass('active');
        if (mockUserOrderData[userId]) {
            mockUserOrderData[userId].isVip = !isVip;
        }
        showToast('success', 'Başarılı', isVip ? 'VIP etiketi kaldırıldı.' : 'Kullanıcı VIP olarak etiketlendi.');
    });

    // Pasif yapma butonu (modal)
    $(document).on('click', '.btn-deactivate', function(e) {
        e.stopPropagation();
        Swal.fire({
            title: 'Kullanıcıyı Pasif Yap',
            text: 'Bu kullanıcıyı pasif hale getirmek istediğinize emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, Pasif Yap',
            cancelButtonText: 'İptal',
            confirmButtonColor: '#EF4444'
        }).then((result) => {
            if (result.isConfirmed) {
                showToast('success', 'Başarılı', 'Kullanıcı pasif hale getirildi.');
            }
        });
    });

    // Bildirim gönder butonu (modal)
    $(document).on('click', '.btn-notify', function(e) {
        e.stopPropagation();
        Swal.fire({
            title: 'Bildirim Gönder',
            input: 'textarea',
            inputLabel: 'Mesajınız',
            inputPlaceholder: 'Kullanıcıya gönderilecek mesaj...',
            showCancelButton: true,
            confirmButtonText: 'Gönder',
            cancelButtonText: 'İptal',
            confirmButtonColor: '#06B6D4'
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                showToast('success', 'Başarılı', 'Bildirim başarıyla gönderildi.');
            }
        });
    });

    // VIP toggle butonu (modal)
    $(document).on('click', '.btn-vip-toggle', function(e) {
        e.stopPropagation();
        const userId = $(this).data('user-id');
        const btn = $(this);
        const isVip = btn.hasClass('active');
        btn.toggleClass('active');
        btn.html(isVip ? '<i class="fa fa-crown"></i> VIP Etiketle' : '<i class="fa fa-crown"></i> VIP Kaldır');
        if (mockUserOrderData[userId]) {
            mockUserOrderData[userId].isVip = !isVip;
        }
        showToast('success', 'Başarılı', isVip ? 'VIP etiketi kaldırıldı.' : 'Kullanıcı VIP olarak etiketlendi.');
    });




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



    // Menüler tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-menus-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        fetchMenus();
    });



    // Menüleri göster
    function displayMenus(response) {

        $('#menusTableBody').empty();

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



    function fetchMenus() {
        $.ajax({
            url: `${baseUrl}mealCategories/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                paginationTemplate("menus-container", "prevMenuPage", "nextMenuPage", "menuPageInfo", "menuTotalItemsInfo", "pagination-menus-table");

                // Menüleri göster
                displayMenus(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                
                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }
                
                showToast('error', 'Hata', errorMessage ? errorMessage : "Menüler alınırken hata oluştu!");
            }
        });
    }



    // Menüleri getiren fonksiyon
    function getMenus(page = 1) {

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
                <div class="menus-table-wrapper px-7">
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
            </div>
        </div>`;
        
        // Menüleri dashboard'a ekle
        $('.dashboard-content').append(menusHTML);

        fetchMenus();
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
            url: `${baseUrl}mealCategories/setDeleteOrRestore?mealCategoryId=${menuId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
            url: `${baseUrl}mealCategories/getForAdmin?mealCategoryId=${menuId}`,
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
                
                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
            url: `${baseUrl}mealCategories/getForAdmin?mealCategoryId=${menuId}`,
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
                
                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
            url: `${baseUrl}mealCategories/update?mealCategoryId=${menuId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
                        <img src="../../icons/default-menu-image-placeholder.png" alt="default-menu-image" class="menu-create-image" id="previewImage">
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
            url: `${baseUrl}mealCategories/add`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
                    url: `${baseUrl}mealCategories/delete?mealCategoryId=${menuId}`,
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

                        if (xhr.status === 401) {
                            // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                            handleLogout(errorMessage);
                            return;
                        }

                        showToast('error', 'Hata', errorMessage ? errorMessage : 'Menü silinirken hata oluştu!');
                    }
                });
            }
        });
    });



    // Ürünler sayfasında önceki/sonraki sayfa değişim işlemlerini yöneten ortak fonksiyon
    function changeProductPage(direction) {
        if (
            (direction === "prev" && currentPage > 1) ||
            (direction === "next" && currentPage < totalPages)
        ) {
            currentPage += direction === "prev" ? -1 : 1;

            const params = new URLSearchParams(window.location.search);
            const menuId = params.get('menuId');

            let request;
            let showGoToMenuButton;
            let paginationTable;

            if (menuId === null) {
                request = `${baseUrl}products/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToMenuButton = true;
                paginationTable = "pagination-products-table";
            } else {
                request = `${baseUrl}products/getAllForAdminByMealCategoryId?mealCategoryId=${menuId}&pageNumber=${currentPage}&pageSize=${pageItems}`;
                showGoToMenuButton = false;
                paginationTable = "pagination-productsByMenu-table";
            }

            fetchProducts(request, showGoToMenuButton, paginationTable);
        }
    }



    // Ürünler sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevProductPage', function() {
        changeProductPage("prev");
    });



    // Ürünler sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextProductPage', function() {
        changeProductPage("next");
    });



    // Menüdeki ürünler tablosunda "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-productsByMenu-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        const params = new URLSearchParams(window.location.search);
        const menuId = params.get('menuId');

        pageItems = $(this).text();

        const request = `${baseUrl}products/getAllForAdminByMealCategoryId?mealCategoryId=${menuId}&pageNumber=${currentPage}&pageSize=${pageItems}`
        
        fetchProducts(request, false, "pagination-productsByMenu-table");
    });



    // Ürünler tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-products-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        const request = `${baseUrl}products/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;

        fetchProducts(request, true, "pagination-products-table");
    });



    // Ürünleri göster
    function displayProducts(response, showGoToMenuButton) {
        
        $('#productsTableBody').empty();

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



    // Ürün verilerini çekiyoruz
    function fetchProducts(request, showGoToMenuButton, paginationTable) {
        $.ajax({
            url: request,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                paginationTemplate("products-container", "prevProductPage", "nextProductPage", "productPageInfo", "productTotalItemsInfo", `${paginationTable}`);

                // Ürünleri göster
                displayProducts(response, showGoToMenuButton);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Ürünler alınırken hata oluştu!");
            }
        });
    }



    // Ürünleri getiren ortak fonksiyon
    function renderProductsList(options = {}) {
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
                <div class="products-table-wrapper px-7"> 
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
            </div>
        </div>`;

        // Ürünleri dashboard'a ekle
        $('.dashboard-content').append(html);
    }


    // Menüye göre ürünleri getiren fonksiyon
    function getProductsByMenu(menuId, menuName) {
        currentPage = 1;

        renderProductsList({ title: menuName, showGoToMenuButton: false })

        const request = `${baseUrl}products/getAllForAdminByMealCategoryId?mealCategoryId=${menuId}&pageNumber=${currentPage}&pageSize=${pageItems}`
        
        fetchProducts(request, false, "pagination-productsByMenu-table");
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



    // Ürünleri getiren fonksiyon
    function getAllProducts() {
        currentPage = 1;

        renderProductsList({ title: 'Ürün Listesi', showGoToMenuButton: true });

        const request = `${baseUrl}products/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;

        fetchProducts(request, true, "pagination-products-table");
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
            url: `${baseUrl}products/getForAdmin?productId=${productId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
            url: `${baseUrl}products/getForAdmin?productId=${productId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
            url: `${baseUrl}products/update?productId=${productId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
                        <img src="../../icons/default-menu-image-placeholder.png" alt="default-product-image" class="product-create-image" id="previewImage">
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

                    if (xhr.status === 401) {
                        // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                        handleLogout(errorMessage);
                        return;
                    }

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
            url: `${baseUrl}api/products/add`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
                    url: `${baseUrl}products/delete?productId=${productId}`,
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
                        
                        if (xhr.status === 401) {
                            // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                            handleLogout(errorMessage);
                            return;
                        }

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
            url: `${baseUrl}products/setDeleteOrRestore?productId=${productId}`,
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
                
                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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



    // Şehirler tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-cities-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        fetchCities();
    });



    // Şehirleri göster
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



    function fetchCities(){
        $.ajax({
            url: `${baseUrl}cities?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                paginationTemplate("cities-container", "prevCityPage", "nextCityPage", "cityPageInfo", "cityTotalItemsInfo", "pagination-cities-table");

                // Şehirleri göster
                displayCities(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'Şehirler alınırken hata oluştu!');
            }
        });
    }



    // Şehirleri getiren fonksiyon
    function getCities(page = 1) {
        
        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();
                
        currentPage = page;

        // Şehirler için HTML yapısı
        let citiesHTML = `
        <div class="cities-container">
            <div class="cities-header">
                <h2>Şehir Listesi</h2>
                <div class="branch-controls">
                    <button class="btn-head-office">
                        <i class="fa-solid fa-landmark"></i>
                        Genel Merkez
                    </button>
                    <button class="btn-all-branches">
                        <i class="fa-solid fa-building"></i>
                        Tüm Şubeler
                    </button>
                </div>
            </div>
            <div class="cities-body">
                <div class="cities-table-wrapper px-7">
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
            </div>
        </div>`;
        
        // Şehirleri dashboard'a ekle
        $('.dashboard-content').append(citiesHTML);

        fetchCities();
    }
    


    // Navbar'daki "Şehir ve Şubeler" seçeneğine tıklandığında
    $('.sidenav a:contains("Şehir ve Şubeler")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'cities' }, 'Şehirler', '?page=cities'); 

        getCities();
    });





    function getBranchRequestData() {
        const params = new URLSearchParams(window.location.search);
        const cityId = params.get('cityId');
    
        let request;
        let showGoToCityButton;
        let showGoToReservationsButton;
    
        if (cityId === null) {
            request = `${baseUrl}branches/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;
    
            const page = params.get('page');
    
            if (page === 'branchesForReservation') {
                showGoToCityButton = false;
                showGoToReservationsButton = true;
            } else {
                showGoToCityButton = true;
                showGoToReservationsButton = false;
            }
        } else {
            request = `${baseUrl}branches/getAllForAdminByCityId?cityId=${cityId}&pageNumber=${currentPage}&pageSize=${pageItems}`;
            showGoToCityButton = false;
            showGoToReservationsButton = false;
        }
    
        return { request, showGoToCityButton, showGoToReservationsButton };
    }
    


    // Şubeler sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevBranchPage', function() {
        if (currentPage > 1) {
            currentPage--;

            const { request, showGoToCityButton, showGoToReservationsButton } = 
                getBranchRequestData(currentPage, pageItems, baseUrl);

            fetchBranches(request, showGoToCityButton, showGoToReservationsButton);
        }
    });
    

    
    // Şubeler sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextBranchPage', function() {
        if (currentPage < totalPages) {
            currentPage++;

            const { request, showGoToCityButton, showGoToReservationsButton } = 
                getBranchRequestData(currentPage, pageItems, baseUrl);

            fetchBranches(request, showGoToCityButton, showGoToReservationsButton);
        }
    });



    // Rezervasyonlar için listelenen şubeler tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-branchesForReservations-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        const request = `${baseUrl}branches/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;

        fetchBranches(request, false, true, "pagination-branchesForReservations-table");
    });



    // Şehir listesinde "Şubeleri Gör" tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-branchesByCity-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();
        const params = new URLSearchParams(window.location.search);
        const cityId = params.get('cityId');

        const request = `${baseUrl}branches/getAllForAdminByCityId?cityId=${cityId}&pageNumber=${currentPage}&pageSize=${pageItems}`;

        fetchBranches(request, false, false, "pagination-branchesByCity-table");
    });



    // Şehir listesinde "Tüm Şubeler" tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-branches-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        const request = `${baseUrl}branches/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;

        fetchBranches(request, true, false, "pagination-branches-table");
    });



    // Şubeleri göster
    function displayBranches(response, showGoToCityButton, showGoToReservationsButton) {
        
        $('#branchesTableBody').empty();

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



    // Şube verilerini çekiyoruz
    function fetchBranches(request, showGoToCityButton, showGoToReservationsButton, paginationTable) {
        $.ajax({
            url: request,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                paginationTemplate("branches-container", "prevBranchPage", "nextBranchPage", "branchPageInfo", "branchTotalItemsInfo", `${paginationTable}`);

                // Şubeleri göster
                displayBranches(response, showGoToCityButton, showGoToReservationsButton);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Şubeler alınırken hata oluştu!");
            }
        });
    }



    // Şubeleri getiren ortak fonksiyon
    function renderBranchesList(options = {}) {
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
                <div class="branches-table-wrapper px-7">
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
            </div>
        </div>`;

        // Şubeleri dashboard'a ekle
        $('.dashboard-content').append(html);
    }



    // Şehirlerin şubelerini getiren fonksiyon
    function getBranchesByCity(cityId, cityName) {
        currentPage = 1;

        renderBranchesList({ title: cityName, showGoToCityButton: false, showGoToReservationsButton: false })

        const request = `${baseUrl}branches/getAllForAdminByCityId?cityId=${cityId}&pageNumber=${currentPage}&pageSize=${pageItems}`;

        fetchBranches(request, false, false, "pagination-branchesByCity-table");
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
        currentPage = 1;

        renderBranchesList({ title: 'Şube Listesi', showGoToCityButton: true, showGoToReservationsButton: false });

        const request = `${baseUrl}branches/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;

        fetchBranches(request, true, false, "pagination-branches-table");
    }



    // Şehir listesindeki "Tüm Şubeler" butonuna tıklandığında
    $(document).on('click', '.btn-all-branches', function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'branches' }, 'Şubeler', '?page=branches'); 

        getAllBranches();
    });    





    function branchChart(data) {

        var ctx = $('#branchPerformance')[0].getContext('2d');
        var branchChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 25,
                            // Grafik altındaki başlıkların stili
                            font: {
                                weight: 'bold',  
                                size: 14         
                            },
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            // Y eksenindeki sayıların stili
                            font: {
                                weight: 'bold', 
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            // X eksenindeki sayıların stili
                            font: {
                                weight: 'bold', 
                                size: 12
                            }
                        }
                    }
                }
            }
        });


        branchChart.data.labels = monthNames; 

        let branchSalesDtos = data.branchSalesDtos;

        // Şubeleri grafiğe ekle
        branchChart.data.datasets = branchSalesDtos.map((branch, index) => {
                
            let salesByMonth = monthNames.map(monthName => {
                let monthData = branch.sales.find(s => s.monthName === monthName);
                return monthData ? monthData.sales : 0;
            });

            return {
                label: branch.name,
                data: salesByMonth,
                borderColor: getColor(index),
                fill: false
            };
        });

        // Grafiği güncelle
        branchChart.update();

        function getColor(index) {
            const colors = ["#FFD700", "#000000", "#A9A9A9", "#808080", "#FF5733", "#33FF57"];
            return colors[index % colors.length];
        }
    };



    const BranchStatusEnum = {
        Opened: 1,
        AwaitingApproval: 2,
        Planning: 3,
        Installation: 4
    };


    // Şubelerin status enum değerine göre CSS sınıfları
    const branchStatusClassMap = {
        [BranchStatusEnum.Opened]: "status-opened",
        [BranchStatusEnum.AwaitingApproval]: "status-permission",
        [BranchStatusEnum.Planning]: "status-planning",
        [BranchStatusEnum.Installation]: "status-setup"
    };


    function pendingBranches(pendingBranchDtos){
        $('#pending-shops').empty();

        let branchHTML = '';

        if (pendingBranchDtos.length > 0) {
            
            // Şubeleri ekle
            pendingBranchDtos.forEach(branch => {

                const date = new Date(branch.estimatedOpeningDate);
                const formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

                branchHTML += `
                    <div class="shop-item pending-shop">
                        <div class="shop-item-header">
                            <div class="status-dot pending"></div>
                            <span class="shop-name">${branch.name}</span>
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        
                        <div class="shop-status ${branchStatusClassMap[branch.status]}">${branch.statusName}</div>
                        <div class="expected-date">Tahmini açılış: ${formattedDate}</div>
                    </div>
                `;
            })
        } else {
            branchHTML = `
                <div class="no-branches">
                    <i class="fas fa-info-circle"></i>
                    <span>Henüz bekleyen şube bulunmamaktadır.</span>
                </div>`;
        }

        $('#pending-shops').html(branchHTML);
    }



    function activeBranches(salesBranchDtos, nonSalesBranchDtos){
        
        $('#active-sales-shops').empty();

        let salesBranchHTML = '';

        // Şubeleri ekle
        if (salesBranchDtos.length > 0) {
            salesBranchDtos.forEach(branch => {
                salesBranchHTML += `
                    <div class="shop-item active-shop">
                        <div class="shop-item-header">
                            <div class="status-dot active"></div>
                            <span class="shop-name">${branch.name}</span>
                        </div>
                    </div>`;
            })
        } else {
            salesBranchHTML = `
                <div class="no-branches">
                    <i class="fas fa-info-circle"></i>
                    <span>Henüz satış yapan şube bulunmamaktadır.</span>
                </div>`;
        }

        


        $('#active-non-sales-shops').empty();

        let nonSalesBranchHTML = '';

        // Şubeleri ekle
        if (nonSalesBranchDtos.length > 0) {
            nonSalesBranchDtos.forEach(branch => {
                nonSalesBranchHTML += `
                    <div class="shop-item non-sales-shop">
                        <div class="shop-item-header">
                            <div class="status-dot non-sales"></div>
                            <span class="shop-name">${branch.name}</span>
                        </div>
                    </div>`;
            })
        } else {

            if (salesBranchDtos.length > 0){
                nonSalesBranchHTML = `
                    <div class="no-branches">
                        <i class="fas fa-info-circle"></i>
                        <span>Tüm şubelerde satış yapılmaktadır.</span>
                    </div>`;

            } else {
                salesBranchHTML = `
                <div class="no-branches">
                    <i class="fas fa-info-circle"></i>
                    <span>Henüz aktif şube bulunmamaktadır.</span>
                </div>`;


                nonSalesBranchHTML = `
                    <div class="no-branches">
                        <i class="fas fa-info-circle"></i>
                        <span>Henüz aktif şube bulunmamaktadır.</span>
                    </div>`;
            }
        }


        $('#active-sales-shops').html(salesBranchHTML);
        $('#active-non-sales-shops').html(nonSalesBranchHTML);
    }



    function sidebarBranches(data){

        let activeBranchDto = data.activeBranchDto;
        let salesBranchDtos = activeBranchDto.salesBranchDtos;
        let nonSalesBranchDtos = activeBranchDto.nonSalesBranchDtos;

        let pendingBranchDtos = data.pendingBranchDtos;

        $('.sidebar-branches').empty();

        let pendingBranchCount = pendingBranchDtos.length;

        let sidebarHtml = `
            <div class="tab-navigation">
                <button class="tab-button active" data-tab="active" style="transform: scale(1);">
                    <i class="fas fa-building"></i>
                    Aktif Şubeler
                </button>
                <button class="tab-button" data-tab="pending" style="transform: scale(1);">
                    <i class="fas fa-clock"></i>
                    Bekleyen <span id="pending-count">(${pendingBranchCount})</span>
                </button>
            </div>

            
            <div class="tab-content">
                    
                <!-- Aktif Şubeler Panel -->
                <div class="tab-panel active" id="active-panel">

                    <div class="panel-header">
                        <h3>Satış Yapan Şubeler</h3>
                        <span class="badge badge-green" id="active-count">${salesBranchDtos.length} Aktif</span>
                    </div>
                
                    <div class="shop-list" id="active-sales-shops">
                    </div>

                    <div class="panel-header" style="margin-top: 16px">
                        <h3>Satış Yapmamış Şubeler</h3>
                        <span class="badge badge-purple" id="active-count">${nonSalesBranchDtos.length} Aktif</span>
                    </div>

                    <div class="shop-list" id="active-non-sales-shops">
                    </div>
                </div>


                <!-- Bekleyen Şubeler Panel -->
                <div class="tab-panel" id="pending-panel">
                
                    <div class="panel-header">
                        <h3>Kurulum Aşamasında</h3>
                        <span class="badge badge-yellow" id="pending-badge">${pendingBranchCount} Şube</span>
                    </div>
                
                    <div class="shop-list" id="pending-shops">
                    </div>
                </div>
            </div>`;

        $('.sidebar-branches').html(sidebarHtml);

        pendingBranches(pendingBranchDtos);
        activeBranches(salesBranchDtos, nonSalesBranchDtos);
    }



    $(document).on('click', '.tab-button', function() {
        const targetTab = $(this).data('tab');

        $('.tab-button').removeClass('active');
        $('.tab-panel').removeClass('active');
        

        $(this).addClass('active');
        
        $(`#${targetTab}-panel`).addClass('active');
        
        
        $(this).css('transform', 'scale(0.98)');
        setTimeout(() => {
            $(this).css('transform', 'scale(1)');
        }, 100);
    });
    


    $(document).on('mouseenter', '.shop-item', function() {
        $(this).css({
            'transform': 'translateY(-2px)',
            'box-shadow': '0 4px 12px rgba(0,0,0,0.15)'
        });
    });


    $(document).on('mouseleave', '.shop-item', function() {
        $(this).css({
            'transform': 'translateY(0)',
            'box-shadow': 'none'
        });
    });



    let firstInstagramInfo = null;
    let firstFacebookInfo = null;
    let firstTwitterInfo = null;
    let firstGoogleInfo = null;

    let firstWeekdayStartInfo = null;
    let firstWeekdayEndInfo = null;
    let firstWeekendStartInfo = null;
    let firstWeekendEndInfo = null;
    let firstSpecialNoteInfo = null;

    let firstPhoneInfo = null;
    let firstEmailInfo = null;
    let firstAddressInfo = null;



    // Genel Merkezi göster
    function displayHeadOffice(response) {
        
        const data = response.data;
        const headOfficeDto = data.headOfficeDto;

        firstInstagramInfo = headOfficeDto.instagram;
        firstFacebookInfo = headOfficeDto.facebook;
        firstTwitterInfo = headOfficeDto.twitter;
        firstGoogleInfo = headOfficeDto.gmail;

        firstWeekdayStartInfo = headOfficeDto.midWeekWorkingHours.split('-')[0].trim();
        firstWeekdayEndInfo = headOfficeDto.midWeekWorkingHours.split('-')[1].trim();
        firstWeekendStartInfo = headOfficeDto.weekendWorkingHours.split('-')[0].trim();
        firstWeekendEndInfo = headOfficeDto.weekendWorkingHours.split('-')[1].trim();
        firstSpecialNoteInfo = headOfficeDto.specialNote;

        firstPhoneInfo = headOfficeDto.phone;
        firstEmailInfo = headOfficeDto.email;
        firstAddressInfo = headOfficeDto.address;

        let headOfficeHTML = `
            <div class="head-office-cards">
                <div class="stat-card order-card">
                    <div class="stat-card-icon">
                        <img src="../../icons/shopping-cart.png" alt="siparişler">
                    </div>
                    
                    <div class="stat-card-content">
                        <p class="stat-card-label">Toplam Siparişler</p>
                        <p class="stat-card-value">${data.orderCount}</p>
                    </div>
                </div>

                <div class="stat-card reservation-card">
                    <div class="stat-card-icon">
                        <img src="../../icons/restaurant-table.png" alt="rezervasyonlar">
                    </div>
                    
                    <div class="stat-card-content">
                        <p class="stat-card-label">Toplam Rezervasyonlar</p>
                        <p class="stat-card-value">${data.reservationCount}</p>
                    </div>
                </div>

                <div class="stat-card sales-card">
                    <div class="stat-card-icon">
                        <img src="../../icons/money.png" alt="rezervasyonlar">
                    </div>
                    
                    <div class="stat-card-content">
                        <p class="stat-card-label">Toplam Satışlar</p>
                        <p class="stat-card-value">
                            <i class="fa-solid fa-turkish-lira-sign"></i>${data.totalSales}
                        </p>
                    </div>
                </div>
            </div>


            <div class="branch-wrapper">
                <div class="branch-chart">
                    <h3>Şubelere göre satışlar</h3>
                    <div class="chart-info">
                        <i class="fa-solid fa-chart-line"></i> 
                        <span>Son 12 Ay</span>
                    </div>
                    <canvas id="branchPerformance">
                        Tarayıcınız canvas öğesini desteklemiyor.
                    </canvas>
                </div>

                <div class="sidebar-branches">
                </div>
            </div>


            <div class="company-settings">
                <h3 class="company-settings__title">Şirket ayarları - footer bilgileri</h3>
                
                <div class="company-settings__form">

                    <h4 class="company-settings__subtitle">
                        <i class="fa-solid fa-share-nodes"></i></i>Sosyal Medya
                    </h4>
                    <div class="company-settings__box">
                        <div class="company-settings__field">
                            <label for="company-instagram" class="form-label">Instagram</label>
                            <input id="company-instagram" type="url" placeholder="Instagram profil linki" value="${firstInstagramInfo}">
                        </div>
                        
                        <div class="company-settings__field">
                            <label for="company-facebook" class="form-label">Facebook</label>
                            <input id="company-facebook" type="url" placeholder="Facebook sayfa linki" value="${firstFacebookInfo}">
                        </div>
                        
                        <div class="company-settings__field">
                            <label for="company-x" class="form-label">X</label>
                            <input id="company-x" type="url" placeholder="X sayfa linki" value="${firstTwitterInfo}">
                        </div>
                        
                        <div class="company-settings__field">
                            <label for="company-google" class="form-label">Google</label>
                            <input id="company-google" type="url" placeholder="Google business linki" value="${firstGoogleInfo}">
                        </div>
                    </div>


                    <h4 class="company-settings__subtitle">
                        <i class="fa-regular fa-clock"></i>Çalışma Saatleri
                    </h4>
                    <div class="company-settings__box">
                        <div class="company-settings__field">
                            <label for="weekdayStart" class="form-label">Hafta içi başlangıç</label>
                            <input type="time" id="weekdayStart" value="${firstWeekdayStartInfo}">
                        </div>
                        
                        <div class="company-settings__field">
                            <label for="weekdayEnd" class="form-label">Hafta içi bitiş</label>
                            <input type="time" id="weekdayEnd" value="${firstWeekdayEndInfo}">
                        </div>
                        
                        <div class="company-settings__field">
                            <label for="weekendStart" class="form-label">Hafta sonu başlangıç</label>
                            <input type="time" id="weekendStart" value="${firstWeekendStartInfo}">
                        </div>
                        
                        <div class="company-settings__field">
                            <label for="weekendEnd" class="form-label">Hafta sonu bitiş</label>
                            <input type="time" id="weekendEnd" value="${firstWeekendEndInfo}">
                        </div>

                        <div class="company-settings__field">
                            <label for="company-hours-note" class="form-label">Özet not</label>
                            <input id="company-hours-note" type="text" placeholder="Çalışma saatleri için not" value="${firstSpecialNoteInfo}">
                        </div>
                    </div>


                    <h4 class="company-settings__subtitle">
                        <i class="fa-regular fa-file-lines"></i>Diğer Bilgiler
                    </h4>
                    <div class="company-settings__box">
                        <div class="company-settings__field">
                            <label for="company-phone" class="form-label">Ana telefon</label>
                            <input id="company-phone" type="tel" placeholder="Ana telefon numarası" value="${firstPhoneInfo}">
                        </div>
                        
                        <div class="company-settings__field">
                            <label for="company-email" class="form-label">Kurumsal e-posta</label>
                            <input id="company-email" type="email" placeholder="info@sirketiniz.com" value="${firstEmailInfo}">
                        </div>
                            
                        <div class="company-settings__field">
                            <label for="company-address" class="form-label">Şirket adresi</label>
                            <textarea id="company-address" placeholder="Tam adres bilgisi">${firstAddressInfo}</textarea>
                        </div>
                        
                        <div class="company-settings__button">
                            <button class="btn-undo">
                                Geri Al
                            </button>
                            <button class="btn-update-branch-settings">
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            

            <!--
            <div class="head-office-personnel">
                <table class="head-office-personnel__table">
                    <thead>
                        <tr>
                            <th class="head-office-personnel-name-col">Personel</th>
                            <th class="head-office-personnel-job-col">Görevi</th>
                        </tr>
                    </thead>
                    <tbody id="headOfficeTableBody"></tbody>
                </table>
            </div>
            -->
        `;
        
        // İçeriği güncelle
        $('.head-office-body').html(headOfficeHTML);
        branchChart(data);
        sidebarBranches(data.branchOverviewDto);
    }


    

    function fetchAllBranchStatistics() {
        $.ajax({
            url: `${baseUrl}BranchStatistics`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('.head-office-body').empty();

                displayHeadOffice(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Şube istatistikleri alınırken hata oluştu!");
            }
        });
    }



    // Genel Merkezde "Geri Al" butonuna tıklandığında
    $(document).on('click', '.company-settings__button .btn-undo', function(e){
        e.preventDefault();
        e.stopPropagation();
        
        const form = $(this).closest('.company-settings__form');

        form.find('#company-instagram').val(firstInstagramInfo);
        form.find('#company-facebook').val(firstFacebookInfo);
        form.find('#company-x').val(firstTwitterInfo);
        form.find('#company-google').val(firstGoogleInfo);

        form.find('#weekdayStart').val(firstWeekdayStartInfo);
        form.find('#weekdayEnd').val(firstWeekdayEndInfo);
        form.find('#weekendStart').val(firstWeekendStartInfo);
        form.find('#weekendEnd').val(firstWeekendEndInfo);
        form.find('#company-hours-note').val(firstSpecialNoteInfo);

        form.find('#company-phone').val(firstPhoneInfo);
        form.find('#company-email').val(firstEmailInfo);
        form.find('#company-address').val(firstAddressInfo);
    });



    // Genel Merkezde "Güncelle" butonuna tıklandığında
    $(document).on('click', '.btn-update-branch-settings', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const form = $(this).closest('.company-settings__form');

        const instagram = form.find('#company-instagram').val();
        const facebook = form.find('#company-facebook').val();
        const twitter = form.find('#company-x').val();
        const google = form.find('#company-google').val();

        const weekdayStart = form.find('#weekdayStart').val();
        const weekdayEnd = form.find('#weekdayEnd').val();
        const weekendStart = form.find('#weekendStart').val();
        const weekendEnd = form.find('#weekendEnd').val();
        const specialNote = form.find('#company-hours-note').val();

        const phone = form.find('#company-phone').val();
        const email = form.find('#company-email').val();
        const address = form.find('#company-address').val();

        
        if (phone.trim() === '') {
            showToast('error', 'Hata', 'Lütfen ana telefon numarasını giriniz!');
            return;
        }
        
        
        if (email.trim() === '') {
            showToast('error', 'Hata', 'Lütfen kurumsal e-posta bilgisini giriniz!');
            return;
        }
        
        
        if (address.trim() === '') {
            showToast('error', 'Hata', 'Lütfen şirket adresini giriniz!');
            return;
        }

        
        $.ajax({
            url: `${baseUrl}headOffices`,
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                address: address,
                email: email,
                phone: phone,
                specialNote: specialNote,
                facebook: facebook,
                instagram: instagram,
                twitter: twitter,
                gmail: google,
                midWeekWorkingHours: `${weekdayStart} - ${weekdayEnd}`,
                weekendWorkingHours: `${weekendStart} - ${weekendEnd}`,
            }),
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Şirket ayarları başarıyla güncellendi!');

                    firstInstagramInfo = instagram;
                    firstFacebookInfo = facebook;
                    firstTwitterInfo = twitter;
                    firstGoogleInfo = google;

                    firstWeekdayStartInfo = weekdayStart;
                    firstWeekdayEndInfo = weekdayEnd;
                    firstWeekendStartInfo = weekendStart;
                    firstWeekendEndInfo = weekendEnd;
                    firstSpecialNoteInfo = specialNote;

                    firstPhoneInfo = phone;
                    firstEmailInfo = email;
                    firstAddressInfo = address;
                    
                } else {
                    showToast('error', 'Hata', 'Şirket ayarları güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'Şirket ayarları güncellenirken hata oluştu!');
            }
        });
    });



    // Genel Merkezi getiren fonksiyon
    function getHeadOffice() {

        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();
                
        // Genel Merkez için HTML yapısı
        let headOfficeSectionHTML = `
        <div class="head-office-container">
            <div class="head-office-header">
                <h2>Genel Merkez</h2>
            </div>
            <div class="head-office-body">
                
            </div>
        </div>`;

        // Genel Merkezi dashboard'a ekle
        $('.dashboard-content').append(headOfficeSectionHTML);

        fetchAllBranchStatistics();
    }




    // Şehir listesindeki "Genel Merkez" butonuna tıklandığında
    $(document).on('click', '.btn-head-office', function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'headOffice' }, 'Genel Merkez', '?page=headOffice'); 

        getHeadOffice();
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
            url: `${baseUrl}branches/getForAdmin?branchId=${branchId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
            url: `${baseUrl}branches/getForAdmin?branchId=${branchId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
            url: `${baseUrl}branches/update?branchId=${branchId}`,
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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
                    url: `${baseUrl}branches/delete?branchId=${branchId}`,
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

                        if (xhr.status === 401) {
                            // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                            handleLogout(errorMessage);
                            return;
                        }

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
                    
                    if (xhr.status === 401) {
                        // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                        handleLogout(errorMessage);
                        return;
                    }

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
            url: `${baseUrl}branches/add`,
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

                    // "page" parametresinin değeri
                    const pageValue = params.get("page");

                    if (pageValue == "headOffice"){
                        getBranchesForHeadOffice();
                    }
                    else if (cityName === null){
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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Şube eklenirken hata oluştu!");
            }
        });
    });




    function getAllBranchesForReservations() {
        currentPage = 1;

        renderBranchesList({ title: 'Şube Seçiniz...', showGoToCityButton: false, showGoToReservationsButton: true })
        
        const request = `${baseUrl}branches/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;
        
        fetchBranches(request, false, true, "pagination-branchesForReservations-table");
    }


    // Navbar'daki "Rezervasyonlar" seçeneğine tıklandığında
    $('.sidenav a:contains("Rezervasyonlar")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'branchesForReservation' }, 'Şubeler', '?page=branchesForReservation'); 

        getAllBranchesForReservations();
    });





    // Rezervasyonlar sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevReservationPage', function() {
        if (currentPage > 1) {
            currentPage--;
            
            applyReservationFilters();
        }
    });
    


    // Rezervasyonlar sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextReservationPage', function() {
        if (currentPage < totalPages) {
            currentPage++;

            applyReservationFilters();
        }
    });



    // Rezervasyon tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-reservations-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        applyReservationFilters();
    });



    // Rezervasyonları göster
    function displayReservations(response) {

        $('#reservationsTableBody').empty();

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
                    <td colspan="5" class="empty-table-row">Rezervasyon bulunmamaktadır.</td>
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



    function fetchReservations(branchId) {
        // Bugünün tarihi
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        $.ajax({
            url: `${baseUrl}reservations/getAdminDashboardReservationData?pageNumber=${currentPage}&pageSize=${pageItems}&branchId=${branchId}&DateRangeFilter.StartDate=${todayStr}&DateRangeFilter.EndDate=${todayStr}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                paginationTemplate("reservations-container.subdivision", "prevReservationPage", "nextReservationPage", "reservationPageInfo", "reservationTotalItemsInfo", "pagination-reservations-table");
                
                $('#filter-start-date').val(todayStr);
                $('#filter-end-date').val(todayStr);

                tables = response.tableResponse.data;

                displayTables();

                updateTableList();
                
                // Rezervasyonları göster
                displayReservations(response.reservationResponse);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'Rezervasyonlar alınırken hata oluştu!');
            }
        });
    }



    // Rezervasyonlar sayfasının taslağını getiren fonksiyon
    function getReservationTemplate(branchId, branchName, page = 1) {
        
        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();
                
        currentPage = page;
        
        // Rezervasyonlar için temel HTML yapısı
        let reservationsHTML = `
        <div class="reservations-container">
            <div class="reservations-header">
                <h2>${branchName}</h2>
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
                            <input id="customer-filter-name" type="text" placeholder="Müşteri adı ara...">
                            <span class="user">
                                <i class="fa-solid fa-user"></i>
                            </span>
                        </div>
                    </div>

                    <div class="reservation-box">
                        <div class="input-wrapper">
                            <div class="dropdown" id="tablesDropdown">
                                <div class="dropdown-toggle" id="tableSelectedId" data-selected-id="">Masalarda ara...</div>
                                
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
                <div class="reservations-table-wrapper px-7">
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
        </div>
        `;

        // Rezervasyon taslağını dashboard'a ekle
        $('.dashboard-content').append(reservationsHTML);

        fetchReservations(branchId);
    }



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



    // Reservasyon listesi için belirtilen kriterlere göre (isim, masa, başlangıç tarihi, bitiş tarihi) filtreleme yapıyoruz
    function searchReservations(name, tableId, startDate, endDate) {

        const params = new URLSearchParams(window.location.search);
        const branchId = params.get('branchId');

        let request = `${baseUrl}reservations/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}&branchId=${branchId}&DateRangeFilter.StartDate=${startDate}&DateRangeFilter.EndDate=${endDate}`;

        // Sadece dolu parametreleri ekliyoruz
        if (name && name.trim() !== "") request += `&fullName=${name}`;
        if (tableId != null) request += `&tableId=${tableId}`;
        

        $.ajax({
            url: request,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                displayReservations(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Rezervasyonlar alınırken hata oluştu!");
            }
        });
    }



    // Input ve dropdown'lardan filtre değerlerini alıp "Rezervasyonlar" listesini filtreliyoruz
    function applyReservationFilters() {
        const name = $('#customer-filter-name').val().trim();
    
        // Dropdown'lardan seçili değerleri alıyoruz
        const selectedTableId = $('#tableSelectedId').attr('data-selected-id') || null;
        const selectedStartDate = $('#filter-start-date').val() || null;
        const selectedEndDate = $('#filter-end-date').val() || null;
    
        searchReservations(name, selectedTableId, selectedStartDate, selectedEndDate);
    }



    // Rezervasyon listesinde "Müşteri Adı Ara" input'unda debounce ile arama
    $(document).on('input', '#customer-filter-name', function () {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            applyReservationFilters();
        }, 700);
    });



    // Rezervasyon listesinde "Masalarda Ara" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#tablesDropdown .dropdown-option', function() {

        selectDropdownOption("#tablesDropdown", this, "table-id");

        applyReservationFilters();
    });



    // Rezervasyonlar sayfasındaki "Masalarda Ara" option'ına tıklandığında
    $(document).on('click', '#tablesDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#tablesDropdown");
    });



    // Rezervasyon listesinde başlangıç veya bitiş tarihi seçildiğinde
    $(document).on('change', '#filter-start-date, #filter-end-date', function () {
        applyReservationFilters();
    });
    


    // Rezervasyon filtreleme seçeneklerinden "Takvim" ikonuna veya input'una tıklandığında takvim listesinin görüntülenmesi için...
    $(document).on('click', '.calendar, .custom-date', function(e) {
        e.stopPropagation();

        // Eğer tıklanan zaten input ise direkt onu kullan
        const input = $(this).hasClass('custom-date') 
            ? this 
            : $(this).siblings('.custom-date')[0];

            
        if (input && typeof input.showPicker === 'function') {
            input.showPicker();
        } else {
            input?.focus();
        }
    });




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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'Rezervasyon detayı alınırken hata oluştu!');
            }
        });
    }


    
    // Rezervasyon satırına tıklama olayı
    $(document).on('click', '.reservation-row', function() {
        const reservationId = $(this).data('reservation-id');

        getReservationDetails(reservationId);
    });

    

    // Dışarı tıklanınca ilgili menüleri kapat
    $(document).on("click", function (e) {

        const $tablesDropdown = $("#tablesDropdown");

        // Eğer tıklanan yer Rezervasyonlar sayfasındaki "Masalarda Ara..." listesi veya içindeki seçenekler değilse
        if (!$tablesDropdown.is(e.target) && $tablesDropdown.has(e.target).length === 0) {
            $tablesDropdown.find(".dropdown-menu").removeClass("active");
            $tablesDropdown.find(".dropdown-toggle").css("border-color", "#dedbdb"); 
        }


        const $statusDropdown = $("#statusDropdown");
        const $rolesDropdown = $("#rolesDropdown");
        const $branchesDropdown = $("#branchesDropdown");
        const $yearsDropdown = $("#yearsDropdown");
        const $financeYearsDropdown = $("#financeYearsDropdown");
        const $financePaymentStatusDropdown = $("#financePaymentStatusDropdown");
        const $paginationDropdown = $("#paginationDropdown");
        const $priorityLevelDropdown = $("#priorityLevelDropdown");
        const $taskStatusDropdown = $("#taskStatusDropdown");

        // Eğer tıklanan yer ilgili dropdown’un kendisi veya içindeki bir eleman değilse,
        // o dropdown kapatılır (menü kapanır, ok simgesi eski haline döner ve border rengi sıfırlanır).        
        [
            $statusDropdown, 
            $rolesDropdown, 
            $branchesDropdown, 
            $yearsDropdown, 
            $financeYearsDropdown, 
            $financePaymentStatusDropdown,
            $paginationDropdown,
            $priorityLevelDropdown,
            $taskStatusDropdown
        ]
            .forEach($dd => {
            if (!$dd.is(e.target) && $dd.has(e.target).length === 0) {
                $dd.find(".dropdown-menu").removeClass("active");
                $dd.find("i").removeClass("rotated-180");
                $dd.find(".dropdown-toggle").css("border-color", "#dedbdb"); 
            }
        });



        // Eğer tıklanan yer .table-options kutusu (yani "Masaları Yönet" butonuna tıklandığında açılan kutu) veya içindeki seçenekler değilse
        if (!$(e.target).closest('.table-options, .btn-manage-table').length) {
            $('.table-options').removeClass('table-manage-show');
            $(".btn-manage-table i").removeClass("rotated-90");
        }
    });



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
        $('#tablesDropdown .dropdown-menu').empty();

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

        $('#tablesDropdown .dropdown-menu').html(tablesHTML);
    }



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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

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

                        if (xhr.status === 401) {
                            // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                            handleLogout(errorMessage);
                            return;
                        }

                        showToast('error', 'Hata', errorMessage ? errorMessage : 'Masa silinirken hata oluştu!');
                    }
                });
            }
        });
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
            <div class="pages-body px-7">
                <a href="../admin/pages/home-preview.html" class="page-box" target="_blank">
                    <div class="page-img">
                        <img src="../../images/home-admin.jpg" alt="anasayfa"/>
                    </div>
                    <div class="page-action">
                        <button class="btn-home">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </a>
                <a href="#" class="page-box">
                    <div class="page-img">
                        <img src="../../images/about-admin.jpg" alt="hakkımızda"/>
                    </div>
                    <div class="page-action">
                        <button class="btn-home">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </a>
                <a href="#" class="page-box">
                    <div class="page-img">
                        <img src="../../images/menu-admin.jpg" alt="menü"/>
                    </div>
                    <div class="page-action">
                        <button class="btn-home">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </a>
                <a href="#" class="page-box">
                    <div class="page-img">
                        <img src="../../images/gallery-admin.jpg" alt="galeri"/>
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




    // Gönderilen dropdown içinden bir seçenek seçildiğinde, seçilen değeri dropdown kutusunda gösterir, ilgili id bilgisini saklar ve menüyü kapatır.
    function selectDropdownOption(dropdownSelector, optionElement, dataSelector) {
        const dropdown = $(dropdownSelector);
        const dropdownToggle = dropdown.find(".dropdown-toggle");
    
        const label = $(optionElement).text();
        const selectedId = $(optionElement).data(dataSelector);
    

        dropdownToggle.text(label);
        dropdownToggle.css("color", "#000");
        dropdownToggle.attr('data-selected-id', selectedId); // seçilen nesnenin id bilgisini saklıyoruz
    

        dropdown.find(".dropdown-menu").removeClass("active");
        dropdownToggle.css("border-color", "#dedbdb");
        dropdown.find('i').removeClass('rotated-180');
    }



    // Gönderilen dropdown kutusuna tıklandığında menüyü açıp kapatır, border rengini değiştirir ve ikonun yönünü günceller.
    function toggleDropdown(dropdownSelector) {

        const dropdown = $(dropdownSelector);
        const toggle = dropdown.find(".dropdown-toggle");
        const menu = dropdown.find(".dropdown-menu");

       // Önce diğer açık dropdown'ları kapatıyoruz
       $(".dropdown").not(dropdown).each(function() {
            const otherDropdown = $(this);
            const toggle = otherDropdown.find(".dropdown-toggle");
            const menu = otherDropdown.find(".dropdown-menu");
        
            menu.removeClass("active");
            toggle.css("border-color", "#dedbdb");
            otherDropdown.find("i").removeClass("rotated-180");
        });

        menu.toggleClass("active");
    
        if (menu.hasClass("active")) {
            toggle.css("border-color", "#1E293B");
            dropdown.find('i').addClass('rotated-180');
        } else {
            toggle.css("border-color", "#dedbdb");
            dropdown.find('i').removeClass('rotated-180');
        }
    }



    // Çalışan sayfasında önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevEmployeePage', function() {
        if (currentPage > 1) {
            currentPage--;

            applyEmployeeFilters();
        }
    });
    

    
    // Çalışan sayfasında sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextEmployeePage', function() {
        if (currentPage < totalPages) {
            currentPage++;

            applyEmployeeFilters();
        }
    });



    // Çalışan tablosundaki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-employees-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        applyEmployeeFilters();
    });



    // "Tüm Durumlar" option'ı için gelen durumları ekle...
    function updateStatusList(workStatusDtos){
        let $menu = $('#statusDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let statusHTML = '';

        if (workStatusDtos.length > 0) {

            // Durumları ekle
            workStatusDtos.forEach(status => {
                statusHTML += `
                    <div class="dropdown-option" data-work-status-id="${status.id}">${status.name}</div>
                `;
            })
        } 

        $menu.append(statusHTML);
    }


    // Çalışanlar sayfasındaki "Tüm Durumlar" option'ına tıklandığında
    $(document).on('click', '#statusDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#statusDropdown");
    });


    // Çalışanlar sayfasındaki "Tüm Durumlar" option'ının ikonuna tıklandığında
    $(document).on('click', '#statusDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#statusDropdown");
    });


    // "Tüm Durumlar" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#statusDropdown .dropdown-option', function() {

        selectDropdownOption("#statusDropdown", this, "work-status-id");

        applyEmployeeFilters();
    });




    // "Tüm Roller" option'ı için gelen rolleri ekle...
    function updateRoleList(operationClaimListDtos){
        let $menu = $('#rolesDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let rolesHTML = '';

        if (operationClaimListDtos.length > 0) {

            // Rolleri ekle
            operationClaimListDtos.forEach(role => {
                rolesHTML += `
                    <div class="dropdown-option" data-role-id="${role.id}">${role.name}</div>
                `;
            })
        } 

        $menu.append(rolesHTML);
    }


    // Çalışanlar sayfasındaki "Tüm Roller" option'ına tıklandığında
    $(document).on('click', '#rolesDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#rolesDropdown");
    });


    // Çalışanlar sayfasındaki "Tüm Roller" option'ının ikonuna tıklandığında
    $(document).on('click', '#rolesDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#rolesDropdown");
    });


    // "Tüm Roller" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#rolesDropdown .dropdown-option', function() {
        
        selectDropdownOption("#rolesDropdown", this, "role-id");

        applyEmployeeFilters();
    });




    // "Tüm Şubeler" option'ı için gelen şubeleri ekle...
    function updateBranchList(branchDtos){
        let $menu = $('#branchesDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let branchesHTML = '';

        if (branchDtos.length > 0) {

            // Şubeleri ekle
            branchDtos.forEach(branch => {
                branchesHTML += `
                    <div class="dropdown-option" data-branch-id="${branch.id}">${branch.name}</div>
                `;
            })
        } 

        $menu.append(branchesHTML);
    }


    // Çalışanlar sayfasındaki "Tüm Şubeler" option'ına tıklandığında
    $(document).on('click', '#branchesDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#branchesDropdown");
    });


    // Çalışanlar sayfasındaki "Tüm Şubeler" option'ının ikonuna tıklandığında
    $(document).on('click', '#branchesDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#branchesDropdown");
    });


    // "Tüm Şubeler" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#branchesDropdown .dropdown-option', function() {

        selectDropdownOption("#branchesDropdown", this, "branch-id");

        applyEmployeeFilters();
    });
    


    // Çalışanlar sayfasındaki filtreleme seçenekleri için verileri çekiyoruz
    function fetchEmployeeFilterOptions() {
        $.ajax({
            url: `${baseUrl}EmployeeStatistics/GetEmployeeFilterOptions`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                const filterOptions = response.data;

                let workStatusDtos = filterOptions.workStatusDtos;
                let operationClaimListDtos = filterOptions.operationClaimListDtos;
                let branchDtos = filterOptions.branchDtos;

                updateStatusList(workStatusDtos);
                updateRoleList(operationClaimListDtos);
                updateBranchList(branchDtos);

            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışan istatistikleri alınırken hata oluştu!");
            }
        });
    }



    function fetchEmployees() {
        $.ajax({
            url: `${baseUrl}employees/getAllForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                firstemployeesTableHTML = response;

                displayEmployees(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışanlar alınırken hata oluştu!");
            }
        });
    }


    
    // Çalışanlar listesini ilk haline getirmek için kullanılır
    function clearEmployeesTable(){
        $('#employeesTableBody').empty();

        // Tabloyu güncelle
        displayEmployees(firstemployeesTableHTML);
    }

    

    let firstemployeesTableHTML = null;
    
    function displayEmployees(response) {

        $('#employeesTableBody').empty();

        let employeesTableHTML = '';

        // Çalışanları tabloya ekle
        if (response.data.length > 0) {
            response.data.forEach(employee => {

                // Tarihi formatla (gün.ay.yıl şeklinde)
                const date = new Date(employee.hireDate);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;

                employeesTableHTML += `
                    <tr class="employee-row" data-employee-id="${employee.id}">
                        <td>
                            <div class="user-card">
                                <div class="user-avatar-table">
                                    ${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}
                                </div>
                                <div class="user-info-table">
                                    <div class="user-name">${employee.firstName} ${employee.lastName}</div>
                                    <div class="user-email">${employee.email}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="role-badge role-${employee.positionName.toLowerCase()}">${employee.positionDisplayName}</span>
                        </td>
                        <td>${employee.branchName}</td>
                        <td>${formattedDate}</td>
                        <td>₺${Number(employee.salary).toLocaleString('tr-TR')}</td>
                        <td>
                            <span class="status-badge status-${employee.workStatusName.toLowerCase()}">${employee.workStatusDisplayName}</span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn btn-view" title="Görüntüle" data-employee-id="${employee.id}" data-employee-name="${employee.name}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                
                                <button class="action-btn btn-edit" title="Düzenle" data-employee-id="${employee.id}" data-employee-name="${employee.name}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                
                                <button class="action-btn btn-delete" title="Sil" data-employee-id="${employee.id}" data-employee-name="${employee.name}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
            });
        } else {
            // Çalışan yoksa bilgi mesajı göster
            employeesTableHTML = `
                <tr>
                    <td colspan="7" class="empty-table-row">Çalışan bulunmamaktadır.</td>
                </tr>`;
        }
        
        // Tabloyu güncelle
        $('#employeesTableBody').html(employeesTableHTML);

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#employeePageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#employeeTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevEmployeePage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextEmployeePage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }



    // Çalışanları göster
    function displayEmployeeStatistics(response) {
        $('.employees-body').empty();

        const data = response.data;
        const employeeListDtos = data.employeeListDtos;


        let employeeHTML = `
            <div class="employee-cards px-7">
                <div class="count-box employee-card">
                    <div class="count-box-content">
                        <p class="count-box-value">${data.employeeCount}</p>
                        <p class="count-box-label">Toplam Çalışan</p>
                    </div>
                    
                    <div class="count-box-icon">
                        <img src="../../icons/user.png" alt="Toplam Çalışan">
                    </div>
                </div>

                <div class="count-box active-employee-card">
                    <div class="count-box-content">
                        <p class="count-box-value">${data.activeEmployeeCount}</p>
                        <p class="count-box-label">Aktif Çalışan</p>
                    </div>

                    <div class="count-box-icon">
                        <img src="../../icons/user-check.png" alt="Aktif Çalışan">
                    </div>
                </div>

                <div class="count-box chef-card">
                    <div class="count-box-content">
                        <p class="count-box-value">${data.chefCount}</p>
                        <p class="count-box-label">Şefler</p>
                    </div>

                    <div class="count-box-icon">
                        <img src="../../icons/chef-hat.png" alt="Şefler">
                    </div>
                </div>

                <div class="count-box waiter-card">
                    <div class="count-box-content">
                        <p class="count-box-value">${data.waiterCount}</p>
                        <p class="count-box-label">Garsonlar</p>
                    </div>

                    <div class="count-box-icon">
                        <img src="../../icons/hand-platter.png" alt="Garsonlar">
                    </div>
                </div>
            </div>

            <div class="filter-section px-7">
                <div class="filter-box filter-box--search">
                    <div class="input-wrapper">
                        <input id="employee-filter-name" type="text" placeholder="Çalışan ara...">
                        <span class="employee-search">
                            <i class="fa-solid fa-search" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>

                <div class="filter-box">
                    <div class="input-wrapper">
                        <div class="dropdown" id="statusDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>

                            <div class="dropdown-toggle" id="statusSelectedId" data-selected-id="">Tüm Durumlar</div>
                            
                            <div class="dropdown-menu">
                                <div class="dropdown-option" data-work-status-id="">Tüm Durumlar</div>    
                            </div>
                        </div>        
                    </div>
                </div>

                <div class="filter-box">
                    <div class="input-wrapper">
                        <div class="dropdown" id="rolesDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                            
                            <div class="dropdown-toggle" id="rolesSelectedId" data-selected-id="">Tüm Roller</div>
                            
                            <div class="dropdown-menu">
                                <div class="dropdown-option" data-role-id="">Tüm Roller</div>    
                            </div>
                        </div>        
                    </div>
                </div>

                <div class="filter-box">
                    <div class="input-wrapper">
                        <div class="dropdown" id="branchesDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                            
                            <div class="dropdown-toggle" id="branchesSelectedId" data-selected-id="">Tüm Şubeler</div>
                            
                            <div class="dropdown-menu">
                                <div class="dropdown-option" data-branch-id="">Tüm Şubeler</div>    
                            </div>
                        </div>        
                    </div>
                </div>
            </div>

            <div class="employees-table-wrapper px-7">
                <table class="employees-table">
                    <thead>
                        <tr>
                            <th>Çalışan</th>
                            <th>Pozisyon</th>
                            <th>Şube</th>
                            <th>İşe Başlama</th>
                            <th>Maaş</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>

                    <tbody id="employeesTableBody">
                    </tbody>
                </table>
            </div>
        `;
        
        // İçeriği güncelle
        $('.employees-body').html(employeeHTML);

        fetchEmployeeFilterOptions();

        paginationTemplate("employees-container", "prevEmployeePage", "nextEmployeePage", "employeePageInfo", "employeeTotalItemsInfo", "pagination-employees-table");

        firstemployeesTableHTML = employeeListDtos;

        displayEmployees(employeeListDtos);
    }



    // Çalışanlar sayfasındaki istatistik verilerini getiriyoruz
    function fetchAllEmployeeStatistics() {
        $.ajax({
            url: `${baseUrl}EmployeeStatistics/GetStatistics?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                displayEmployeeStatistics(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışan istatistikleri alınırken hata oluştu!");
            }
        });
    }



    // Çalışanları getiren fonksiyon
    function getEmployees(page = 1) {

        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();

        currentPage = page;
                
        // Çalışanlar için HTML yapısı
        let employeeSectionHTML = `
        <div class="employees-container">
            <div class="employees-header">
                <h2>Çalışanlar</h2>
            </div>
            <div class="employees-body">
                
            </div>
        </div>`;

        // Dashboard'a ekle
        $('.dashboard-content').append(employeeSectionHTML);

        fetchAllEmployeeStatistics();
    }



    // Navbar'daki "Çalışanlar" seçeneğine tıklandığında
    $('.sidenav a:contains("Çalışanlar")').click(function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'employees' }, 'Çalışanlar', '?page=employees'); 

        getEmployees();
    });



    // Çalışanlar listesi için belirtilen kriterlere (isim, durum, rol, şube) göre filtreleme yapıyoruz
    function searchEmployees(name, statusId, roleId, branchId) {

        let url = `${baseUrl}Employees/getFilteredEmployeesForAdmin?pageNumber=${currentPage}&pageSize=${pageItems}`;

        // Sadece dolu parametreleri ekliyoruz
        if (name && name.trim() !== "") url += `&fullName=${name}`;
        if (statusId != null) url += `&workStatus=${statusId}`;
        
        if (roleId != null) url += `&operationClaimId=${roleId}`;
        if (branchId != null) url += `&branchId=${branchId}`;

        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                displayEmployees(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışanlar alınırken hata oluştu!");
            }
        });
    }


    // Input ve dropdown'lardan filtre değerlerini alıp "Çalışanlar" listesini filtreliyoruz
    function applyEmployeeFilters() {
        const name = $('#employee-filter-name').val().trim();
    
        // Dropdown'lardan seçili değerleri alıyoruz
        const selectedStatusId = $('#statusSelectedId').attr('data-selected-id') || null;
        const selectedRoleId = $('#rolesSelectedId').attr('data-selected-id') || null;
        const selectedBranchId = $('#branchesSelectedId').attr('data-selected-id') || null;
    
        searchEmployees(name, selectedStatusId, selectedRoleId, selectedBranchId);
    }



    let timeout;

    // Çalışanlar listesinde "Çalışan Ara" input'unda debounce ile arama
    $(document).on('input', '#employee-filter-name', function () {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            applyEmployeeFilters();
        }, 700);
    });



    // Çalışanlar listesinde "Çalışan Ara" input'unun search butonuna tıklandığında arama
    $(document).on('click', '.employee-search', function () {
        applyEmployeeFilters();
    });






    // Çalışan detayında "Vardiyalar" başlığına tıklandığında
    $(document).on('click', '#shifts', function(e) {
        e.preventDefault();

        generateShiftDayHtml();
        generatePermissionHtml();
        fetchYears();
        generateTimeLineHtml(permissionListDtos);
    });



    const PermissionLeaveTypeEnum = {
        AnnualLeave: 1,
        ExcuseLeave: 2,
        UnpaidLeave: 3,
        SickLeave: 4,
        MaternityLeave: 5,
        PaternityLeave: 6,
        MarriageLeave: 7,
        BereavementLeave: 8
    };


    // İzinlerin leaveTypeId değerine göre CSS sınıfları
    const leaveTypeClassMap = {
        [PermissionLeaveTypeEnum.AnnualLeave]: "leave-annual",
        [PermissionLeaveTypeEnum.ExcuseLeave]: "leave-excuse",
        [PermissionLeaveTypeEnum.UnpaidLeave]: "leave-unpaid",
        [PermissionLeaveTypeEnum.SickLeave]: "leave-sick",
        [PermissionLeaveTypeEnum.MaternityLeave]: "leave-maternity",
        [PermissionLeaveTypeEnum.PaternityLeave]: "leave-paternity",
        [PermissionLeaveTypeEnum.MarriageLeave]: "leave-marriage",
        [PermissionLeaveTypeEnum.BereavementLeave]: "leave-bereavement"
    };


    const PermissionStatusEnum = {
        Pending: 1,
        Approved: 2,
        Rejected: 3
    };


    // İzinlerin status enum değerine göre CSS sınıfları
    const leaveStatusClassMap = {
        [PermissionStatusEnum.Pending]: "status-pending",
        [PermissionStatusEnum.Approved]: "status-approved",
        [PermissionStatusEnum.Rejected]: "status-rejected"
    };



    function calculateLeaveDays(startDateStr, endDateStr, isHalfDay = false) {
        
        if (isHalfDay) {
            return "0.5 gün";
        }

        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
    
        const diffTime = end - start;
    
        // Milisaniyeyi güne çeviriyoruz (1 gün = 1000*60*60*24)
        let diffDays = diffTime / (1000 * 60 * 60 * 24);
    
        // Başlangıç günü dahil olsun diye +1 ekliyoruz
        diffDays = diffDays + 1;
    
        return `${diffDays} gün`;
    }
    


    function formatLeaveDateRange(startDateStr, endDateStr) {
        
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
    
        const startDay = start.getDate();
        const startMonth = monthNames[start.getMonth()];
        const startYear = start.getFullYear();
    
        const endDay = end.getDate();
        const endMonth = monthNames[end.getMonth()];
        const endYear = end.getFullYear();
    
        // Eğer alınan iznin başlangıç ve bitiş tarihleri aynı ise
        if (
            startDay === endDay &&
            startMonth === endMonth &&
            startYear === endYear
        ) {
            return `${startDay} ${startMonth} ${startYear}`;
        }
    
        // Eğer alınan iznin başlangıç ve bitiş tarihleri farklı ise
        if (startYear === endYear && startMonth === endMonth) {
            return `${startDay}-${endDay} ${startMonth} ${startYear}`;
        }
    
        // Eğer alınan izinde ay ya da yıl farklıysa yani: 28 Ağu 2025 - 02 Eyl 2025 gibi
        return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
    }
    
    

    function generateTimeLineHtml(){
        let timelineHtml = '';

        if (permissionListDtos.length > 0) {

            permissionListDtos.forEach(permission => {

                let className = leaveTypeClassMap[permission.leaveTypeId];
                let formattedDate = formatLeaveDateRange(permission.startDate, permission.endDate);
                let duration = calculateLeaveDays(permission.startDate, permission.endDate);

                timelineHtml += `
                    <div class="timeline-item ${className}" data-type="${className}" style="display: block;">
                        <div class="timeline-card">
                            <div class="timeline-header">
                                <div class="timeline-date">${formattedDate}</div>
                                <div class="timeline-type ${className}">${permission.leaveTypeName}</div>
                            </div>
                            <div class="timeline-info">
                                <div class="timeline-duration">${duration}</div>
                                <div class="timeline-status ${leaveStatusClassMap[permission.status]}">${permission.statusName}</div>
                            </div>
                            <div class="timeline-description">${permission.description ?? ''}</div>
                        </div>
                    </div>
                `;
            });
        } else {
            timelineHtml += `
                <div class="no-permission">
                    <i class="fas fa-calendar-times"></i>
                    <span>İzin kaydı bulunamadı.</span>
                </div>
            `;
        }


        $('.timeline').html(timelineHtml);
    }



    // Çalışan izin geçmişi verilerini çekiyoruz
    function fetchEmployeePermissions(employeeId, yearId, leaveTypeId) {
        let request = `${baseUrl}Employees/${employeeId}/Permissions?`;
        
        if (leaveTypeId != null) request += `&leaveTypeId=${leaveTypeId}`;
        if (yearId != null) request += `&yearId=${yearId}`;
        
        $.ajax({
            url: request,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                $('.timeline').empty();

                generateTimeLineHtml(response.data)
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'İzin geçmişi alınırken hata oluştu!');
            }
        });
    }



    // Çalışan detayındaki izin geçmişini leaveType durumuna göre filtreleme
    $(document).on('click', '.filter-tab', function() {

        $(".filter-tab ").removeClass("active");
        $(this).addClass("active");

        const leaveTypeId = $(this).data('leave-type');
        const yearId = $('#yearsSelectedId').attr('data-selected-id') || null;

        const params = new URLSearchParams(window.location.search);
        const employeeId = params.get('id');

        fetchEmployeePermissions(employeeId, yearId, leaveTypeId);
    });



    // Çalışan detayındaki izin geçmişinde "Yıl" option'ı için gelen yılları ekle...
    function updateYearsList(yearDtos){
        let $menu = $('#yearsDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let yearHTML = '';

        if (yearDtos.length > 0) {

            // Yılları ekle
            yearDtos.forEach(year => {
                yearHTML += `
                    <div class="dropdown-option" data-year-id="${year.id}">${year.name}</div>
                `;
            })
        } 

        $menu.append(yearHTML);
    }



    // Çalışan detayındaki izin geçmişinde "Yıl" option'ına tıklandığında
    $(document).on('click', '#yearsDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#yearsDropdown");
    });



    // Çalışan detayındaki izin geçmişinde "Yıl" option'ının ikonuna tıklandığında
    $(document).on('click', '#yearsDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#yearsDropdown");
    });



    // "Yıl" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#yearsDropdown .dropdown-option', function() {

        selectDropdownOption("#yearsDropdown", this, "year-id");

        $("#yearsDropdown .dropdown-toggle").text(`${$(this).text()} Yılı`);


        const leaveTypeId = $(".filter-tab.active").attr('data-leave-type') || null;
        const yearId = $('#yearsSelectedId').attr('data-selected-id');

        const params = new URLSearchParams(window.location.search);
        const employeeId = params.get('id');

        fetchEmployeePermissions(employeeId, yearId, leaveTypeId);
    });



    // Çalışan detayındaki izin geçmişinde "Yıl" option'ı için yılları çekiyoruz
    function fetchYears() {
        $.ajax({
            url: `${baseUrl}Years`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                updateYearsList(response.data);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Yıllar alınırken hata oluştu!");
            }
        });
    }


    
    function generatePermissionHtml(){
        $('.permission-container').empty();

        let year = new Date().getFullYear();

        let permissionHtml = `
            <div class="permission-header chart-title">
                <h2>İzin Geçmişi</h2>

                <div class="permission-filter-year">
                    <div class="input-wrapper">
                        <div class="dropdown" id="yearsDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                            <div class="dropdown-toggle" id="yearsSelectedId" data-selected-id="">${year} Yılı</div>
                            
                            <div class="dropdown-menu">  
                            </div>
                        </div>        
                    </div>
                </div>
            </div>

            <div class="permission-body">
                <div class="filter-tabs">
                    <div class="filter-tab active" data-leave-type="">Tümü</div>
                    <div class="filter-tab" data-leave-type="${PermissionLeaveTypeEnum.AnnualLeave}">Yıllık İzin</div>
                    <div class="filter-tab" data-leave-type="${PermissionLeaveTypeEnum.SickLeave}">Hastalık</div>
                    <div class="filter-tab" data-leave-type="${PermissionLeaveTypeEnum.ExcuseLeave}">Mazeret</div>
                </div>
            </div>

            <div class="timeline">
            </div>
        `;


        $('.permission-container').html(permissionHtml);
    }



    // Çalışan detay sayfasındaki vardiyaları oluşturuyoruz
    function generateShiftDayHtml(){
        
        $('.tab-content').empty();

        let scheduleHtml = `
            <div class="schedule-container">
                <div class="schedule-header chart-title">
                    <h2>Çalışma Programı</h2>

                    <!--
                    <div class="swap-info-box">
                        <i class="fa-solid fa-pencil"></i>
                        <span>Günleri düzenlemek için üzerine gelin ve düzenleme butonuna tıklayın.</span>
                    </div>
                    -->
                </div>
                
                <div class="schedule-grid">
                </div>
            </div>
            
            <div class="permission-container">
            </div>
        `;

        $('.tab-content').html(scheduleHtml);


        let shiftDayHtml = '';

        shiftDayDtos.forEach(shiftDay => {

            let className = null;
            let displayText = null;
            const dayName = days[shiftDay.shiftId];

            if (shiftDay.isHoliday){
                className = "off";
                displayText = "Tatil"

            } else if (shiftDay.isLeave) {
                className = "off";
                displayText = "İzinli"

            } else {
                className = "working";

                // saniye kısmını kaldırıyoruz
                const start = shiftDay.startTime.substring(0, 5);
                const end = shiftDay.endTime.substring(0, 5);

                displayText = `${start}-${end}`;
            }

            shiftDayHtml += `
                <div class="schedule-day ${className}">
                    <button class="edit-btn">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <strong>${dayName}</strong>
                    ${displayText}
                </div>
                `;            
        });

        $('.schedule-grid').html(shiftDayHtml);
    }






    // Çalışan detayında "Finansal" başlığına tıklandığında
    $(document).on('click', '#finance', function(e) {
        e.preventDefault();

        applyEmployeeSalaryFilters(false);
    });

    

    const PaymentStatusEnum = {
        Pending: 1,
        Approved: 2,
        Paid: 3,
        Rejected: 4,
        Cancelled: 5,
        Failed: 6
    };


    // Ödeme enum değerine göre CSS sınıfları
    const paymentStatusClassMap = {
        [PaymentStatusEnum.Pending]: "payment-pending",
        [PaymentStatusEnum.Approved]: "payment-approved",
        [PaymentStatusEnum.Paid]: "payment-paid",
        [PaymentStatusEnum.Rejected]: "payment-rejected",
        [PaymentStatusEnum.Cancelled]: "payment-cancelled",
        [PaymentStatusEnum.Failed]: "payment-failed",
    };
    


    // Çalışan detayında maaş satırına tıklama olayı
    $(document).on("click", ".salary-row", function () {
        const $detailsRow = $(this).next(".salary-details-row"); 
    
        $detailsRow.toggleClass("hidden");
    
        $(this).find("i").toggleClass("fa-angle-down fa-angle-up");
    });



    // Çalışan detayındaki maaşlar tablosunu oluşturuyoruz...
    function displaySalaryTable(response){

        $('#salariesTableBody').empty();

        let salaryTableHTML = '';

        // Maaşları tabloya ekle
        if (response.data.length > 0) {
            response.data.forEach(salary => {

                let employeeBonusListDtos = salary.employeeBonusListDtos;
                let employeeDeductionListDtos = salary.employeeDeductionListDtos;

                const bonusType = {
                    Performance: 1,
                    Shift: 2,
                    Weekend: 3,
                    Overtime: 4,
                    Holiday: 5,
                    Sales: 6,
                    ProjectCompletion: 7,
                    Referral: 8,
                    Special: 9
                };

                // Şubelerin status enum değerine göre CSS sınıfları
                const bonusTypeSvgMap = {
                    [bonusType.Performance]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up-icon lucide-trending-up">
                        <path d="M16 7h6v6"/>
                        <path d="m22 7-8.5 8.5-5-5L2 17"/>
                    </svg>`,

                    [bonusType.Shift]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2"/>
                        <circle cx="12" cy="12" r="10"/>
                    </svg>`,
                    
                    [bonusType.Weekend]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar">
                        <path d="M8 2v4"/>
                        <path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/>
                        <path d="M3 10h18"/>
                    </svg>`,
                    
                    [bonusType.Overtime]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-timer-icon lucide-timer">
                        <line x1="10" x2="14" y1="2" y2="2"/>
                        <line x1="12" x2="15" y1="14" y2="11"/>
                        <circle cx="12" cy="14" r="8"/>
                    </svg>`,

                    [bonusType.Holiday]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun">
                        <circle cx="12" cy="12" r="4"/>
                        <path d="M12 2v2"/><path d="M12 20v2"/>
                        <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
                        <path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/>
                        <path d="m19.07 4.93-1.41 1.41"/>
                    </svg>`,

                    [bonusType.Sales]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4fe388" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag-icon lucide-shopping-bag">
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                        <path d="M3.103 6.034h17.794"/>
                        <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>
                    </svg>`,

                    [bonusType.ProjectCompletion]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10d15a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>`,

                    [bonusType.Referral]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round-icon lucide-users-round">
                        <path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/>
                        <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
                    </svg>`,

                    [bonusType.Special]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gift-icon lucide-gift">
                        <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/>
                        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
                        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
                    </svg>`
                };


                let bonusItemHtml = '';
                if (employeeBonusListDtos.length > 0) {

                    employeeBonusListDtos.forEach(bonus => {

                        bonusItemHtml += `
                            <div class="salary-bonuses__item">
                                <div class="salary-bonuses__item-icon">
                                    ${bonusTypeSvgMap[bonus.bonusType]}                             
                                    <span class="salary-bonuses__item-label">${bonus.bonusTypeName}</span>
                                    
                                    <div class="payment-status">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9cadaf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" 
                                            class="lucide lucide-info-icon lucide-info payment-icon">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 16v-4"/>
                                            <path d="M12 8h.01"/>
                                        </svg>

                                        <div class="payment-status__info ${paymentStatusClassMap[bonus.paymentStatus]}">
                                            <i class="fa-solid fa-circle"></i>
                                            <span>
                                                Durum: ${bonus.paymentStatusName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                
                                <div class="salary-bonuses__item-value positive-amount">
                                    ₺${Number(bonus.amount).toLocaleString('tr-TR')}
                                </div>
                            </div>
                        `;
                    });
                } else {
                    bonusItemHtml = `
                        <div class="empty-table-row">
                            <span>Herhangi bir prim bulunmuyor.</span>
                        </div>
                    `;
                }

                let bonusTableHtml = `
                    <div class="salary-bonuses__title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e4a907" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy-icon lucide-trophy">
                            <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/>
                            <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/>
                            <path d="M18 9h1.5a1 1 0 0 0 0-5H18"/>
                            <path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/>
                            <path d="M6 9H4.5a1 1 0 0 1 0-5H6"/>
                        </svg>                       
                        
                        <span class="salary-bonuses__title-text">
                            Primler
                        </span>
                    </div>
                    
                    <div class="salary-bonuses__list">
                        ${bonusItemHtml}
                    </div>
                `;


                const deductionType = {
                    SocialSecurity: 1,
                    IncomeTax: 2,
                    UnemploymentInsurance: 3,
                    UnionFee: 4,
                    PrivateHealthInsurance: 5,
                    Other: 6
                };


                const deductionTypeSvgMap = {
                    [deductionType.SocialSecurity]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-icon lucide-shield">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                    </svg>`,
                    
                    [deductionType.IncomeTax]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e1010" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote-icon lucide-banknote">
                        <rect width="20" height="12" x="2" y="6" rx="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <path d="M6 12h.01M18 12h.01"/>
                    </svg>`,
                
                    [deductionType.UnemploymentInsurance]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-icon lucide-briefcase">
                        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        <rect width="20" height="14" x="2" y="6" rx="2"/>
                    </svg>`,
                
                    [deductionType.UnionFee]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake-icon lucide-handshake">
                        <path d="m11 17 2 2a1 1 0 1 0 3-3"/>
                        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/>
                        <path d="m21 3 1 11h-2"/>
                        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>
                    </svg>`,
                
                    [deductionType.PrivateHealthInsurance]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart">
                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                    </svg>`,
                
                    [deductionType.Other]: 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-minus-icon lucide-folder-minus"><path d="M9 13h6"/>
                        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
                    </svg>`
                };


                let deductionItemHtml = '';
                if (employeeDeductionListDtos.length > 0) {

                    employeeDeductionListDtos.forEach(deduction => {

                        deductionItemHtml += `
                            <div class="salary-deductions__item">
                                <div class="salary-deductions__item-icon">
                                    ${deductionTypeSvgMap[deduction.deductionType]}                             
                                    <span class="salary-deductions__item-label">${deduction.deductionTypeName}</span>

                                    <div class="payment-status">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9cadaf" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" 
                                            class="lucide lucide-info-icon lucide-info payment-icon">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 16v-4"/>
                                            <path d="M12 8h.01"/>
                                        </svg>

                                        <div class="payment-status__info ${paymentStatusClassMap[deduction.paymentStatus]}">
                                            <i class="fa-solid fa-circle"></i>
                                            <span>
                                                Durum: ${deduction.paymentStatusName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="salary-deductions__item-value negative-amount">
                                    ₺${Number(deduction.amount).toLocaleString('tr-TR')}
                                </div>
                            </div>
                        `;
                    });
                } else {
                    deductionItemHtml = `
                        <div class="empty-table-row">
                            <span>Herhangi bir kesinti bulunmuyor.</span>
                        </div>
                    `;
                }


                let deductionTableHtml = `
                    <div class="salary-deductions__title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt-text-icon lucide-receipt-text">
                            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                            <path d="M14 8H8"/>
                            <path d="M16 12H8"/><path d="M13 16H8"/>
                        </svg>                        
                        
                        <span class="salary-deductions__title-text">
                            Kesintiler
                        </span>
                    </div>
                    
                    <div class="salary-deductions__list">
                        ${deductionItemHtml}
                    </div>
                `;
                


                salaryTableHTML += `
                    <tr class="salary-row" data-salary-id="${salary.id}">
                        <td class="salary-toggle-btn">
                            <button>
                                <i class="fa-solid fa-angle-down"></i>
                            </button>
                        </td>
                        <td class="month-cell">${salary.month} ${salary.year}</td>
                        <td>₺${Number(salary.baseSalary).toLocaleString('tr-TR')}</td>
                        <td class="positive-amount">
                            ${salary.bonuses > 0 
                                ? `₺${Number(salary.bonuses).toLocaleString('tr-TR')}` 
                                : `—`}
                        </td>
                        <td class="positive-amount">
                            ${salary.additionalPayments > 0 
                                ? `₺${Number(salary.additionalPayments).toLocaleString('tr-TR')}` 
                                : `—`}
                        </td>
                        <td class="negative-amount">
                            ${salary.deductions > 0 
                                ? `₺${Number(salary.deductions).toLocaleString('tr-TR')}` 
                                : `—`}
                        </td>
                        <td>₺${Number(salary.netSalary).toLocaleString('tr-TR')}</td>
                        <td>
                            <span class="status-badge ${paymentStatusClassMap[salary.paymentStatus]}">${salary.paymentStatusName}</span>
                        </td>
                    </tr>
                    
                    <tr class="salary-details-row hidden">
                        <td colspan="8">
                            <div class="salary-details">
                                <div class="salary-bonuses">
                                    ${bonusTableHtml}
                                </div>    

                                <div class="salary-payments">
                                    <div class="salary-payments__title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0cbb0f" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign-icon lucide-dollar-sign">
                                            <line x1="12" x2="12" y1="2" y2="22"/>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                        </svg>                                        
                                        
                                        <span class="salary-payments__title-text">
                                            Yan Ödemeler
                                        </span>
                                    </div>
                                    
                                    <div class="salary-payments__list">
                                        <div class="salary-payments__item">
                                            <div class="salary-payments__item-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cooking-pot-icon lucide-cooking-pot">
                                                    <path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>
                                                    <path d="m4 8 16-4"/>
                                                    <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/>
                                                </svg>
                                                
                                                <span class="salary-payments__item-label">Yemek Yardımı</span>
                                            </div>
                                            
                                            <div class="salary-payments__item-value">
                                                ₺${Number(salary.mealAllowance).toLocaleString('tr-TR')}
                                            </div>
                                        </div>

                                        <div class="salary-payments__item">
                                            <div class="salary-payments__item-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car-icon lucide-car">
                                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                                                    <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
                                                </svg>
                                                
                                                <span class="salary-payments__item-label">Ulaşım Yardımı</span>
                                            </div>
                                            
                                            <div class="salary-payments__item-value">
                                                ₺${Number(salary.transportAllowance).toLocaleString('tr-TR')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="salary-deductions">
                                    ${deductionTableHtml}
                                </div>
                            </div>
                        </td>
                    </tr>
                `;

            });
        } else {
            // Maaş yoksa bilgi mesajı göster
            salaryTableHTML = `
                <tr>
                    <td colspan="8" class="empty-table-row">Maaş kaydı bulunmamaktadır.</td>
                </tr>`;
        }


        // Tabloyu güncelle
        $('#salariesTableBody').html(salaryTableHTML);

        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#salaryPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#salaryTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevSalaryPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextSalaryPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }




    // "Tüm Yıllar" option'ı için gelen yılları ekle...
    function updateYearList(yearDtos){
        let $menu = $('#financeYearsDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let yearsHTML = '';

        if (yearDtos.length > 0) {

            // Yılları ekle
            yearDtos.forEach(year => {
                yearsHTML += `
                    <div class="dropdown-option" data-year-id="${year.id}">${year.name}</div>
                `;
            })
        } 

        $menu.append(yearsHTML);
    }


    // Çalışan detayındaki "Tüm Yıllar" option'ına tıklandığında
    $(document).on('click', '#financeYearsDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#financeYearsDropdown");
    });



    // Çalışan detayındaki "Tüm Yıllar" option'ının ikonuna tıklandığında
    $(document).on('click', '#financeYearsDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#financeYearsDropdown");
    });


    // "Tüm Yıllar" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#financeYearsDropdown .dropdown-option', function() {

        selectDropdownOption("#financeYearsDropdown", this, "year-id");

        applyEmployeeSalaryFilters(true);
    });




    // "Tüm Durumlar" (Ödeme Durumları) option'ı için gelen durumları ekle...
    function updatePaymentStatusList(paymentStatusDtos){
        let $menu = $('#financePaymentStatusDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let paymentStatusHTML = '';

        if (paymentStatusDtos.length > 0) {

            // Durumları ekle
            paymentStatusDtos.forEach(paymentStatus => {
                paymentStatusHTML += `
                    <div class="dropdown-option" data-payment-status-id="${paymentStatus.id}">${paymentStatus.name}</div>
                `;
            })
        } 

        $menu.append(paymentStatusHTML);
    }


    // Çalışan detayındaki "Tüm Durumlar" (Ödeme Durumları) option'ına tıklandığında
    $(document).on('click', '#financePaymentStatusDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#financePaymentStatusDropdown");
    });


    // Çalışan detayındaki "Tüm Durumlar" (Ödeme Durumları) option'ının ikonuna tıklandığında
    $(document).on('click', '#financePaymentStatusDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#financePaymentStatusDropdown");
    });



    // "Tüm Durumlar" (Ödeme Durumları) option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#financePaymentStatusDropdown .dropdown-option', function() {

        selectDropdownOption("#financePaymentStatusDropdown", this, "payment-status-id");

        applyEmployeeSalaryFilters(true);
    });



    // Çalışan detayındaki maaş listesi için filtreleme seçeneklerini çekiyoruz
    function fetchEmployeeSalaryFilterOptions() {
        const params = new URLSearchParams(window.location.search);
        const employeeId = params.get('id');
        
        $.ajax({
            url: `${baseUrl}Employees/${employeeId}/Salaries/filters`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                const filterOptions = response.data;

                let yearListDtos = filterOptions.yearListDtos;
                let paymentStatusDtos = filterOptions.paymentStatusDtos;

                updateYearList(yearListDtos);
                updatePaymentStatusList(paymentStatusDtos);

            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışanın maaşları alınırken hata oluştu!");
            }
        });
    }



    // Çalışan detayındaki "Aylık Finansal Detaylar" bölümünün taslağını oluşturuyoruz...
    function generateSalaryHtml(){
        
        $('.salary-container').empty();

        let salaryHtml = `
            <div class="salary-header chart-title">
                <h2>Aylık Finansal Detaylar</h2>
            </div>

            <div class="filter-group px-7"> 
                <div class="filter-box">
                    <div class="input-wrapper">
                        <div class="dropdown" id="financeYearsDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                            
                            <div class="dropdown-toggle" id="financeYearsSelectedId" data-selected-id="">Tüm Yıllar</div>
                            
                            <div class="dropdown-menu">
                                <div class="dropdown-option" data-year-id="">Tüm Yıllar</div>    
                            </div>
                        </div>        
                    </div>
                </div>

                <div class="filter-box">
                    <div class="input-wrapper">
                        <div class="dropdown" id="financePaymentStatusDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                            
                            <div class="dropdown-toggle" id="financePaymentStatusSelectedId" data-selected-id="">Tüm Durumlar</div>
                            
                            <div class="dropdown-menu">
                                <div class="dropdown-option" data-payment-status-id="">Tüm Durumlar</div>    
                            </div>
                        </div>        
                    </div>
                </div>
            </div>

            <div class="salary-section px-7">
                <table class="salary-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Dönem</th>
                            <th>Temel Maaş</th>
                            <th>Primler</th>
                            <th>Yan Ödemeler</th>
                            <th>Kesintiler</th>
                            <th>Net Maaş</th>
                            <th>Durum</th>
                        </tr>
                    </thead>

                    <tbody id="salariesTableBody">
                    </tbody>
                </table>
            </div>
        `;


        $('.salary-container').html(salaryHtml);
    }



    // Çalışan detayındaki "Sosyal Haklar ve Yan Ödemeler" bölümünün taslağını oluşturuyoruz...
    function generateFinanceHtml(lastSalary){

        $('.tab-content').empty();


        let sgkDeduction = lastSalary.employeeDeductionListDtos.find(d => d.deductionType === 1);
        let healthInsuranceValue = sgkDeduction ? `₺${Number(sgkDeduction.amount).toLocaleString('tr-TR')}/ay` : "Yok";

        // Yan ödemeleri de ekliyoruz...
        let mealAllowanceValue = lastSalary.mealAllowance && lastSalary.mealAllowance > 0 
            ? `₺${Number(lastSalary.mealAllowance).toLocaleString('tr-TR')}/ay`
            : "Yok";

        let transportAllowanceValue = lastSalary.transportAllowance && lastSalary.transportAllowance > 0 
            ? `₺${Number(lastSalary.transportAllowance).toLocaleString('tr-TR')}/ay`
            : "Yok";

        let educationAllowanceValue = lastSalary.educationAllowance && lastSalary.educationAllowance > 0 
            ? `₺${Number(lastSalary.educationAllowance).toLocaleString('tr-TR')}/ay`
            : "Yok";


        let financeHtml = `
            <div class="benefits-container">
                <div class="benefits-header chart-title">
                    <h2>Sosyal Haklar ve Yan Ödemeler</h2>
                </div>

                <div class="benefits-section px-7">
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <div class="benefit-icon">
                                <img src="../../icons/hospital.png" alt="hospital" class="benefit-img">
                            </div>
                            <div class="benefit-text">
                                <div class="benefit-name">Sağlık Sigortası</div>
                                <div class="benefit-value">${healthInsuranceValue}</div>
                            </div>
                        </div>

                        <div class="benefit-item">
                            <div class="benefit-icon">
                                <img src="../../icons/meal.png" alt="meal" class="benefit-img">
                            </div>
                            <div class="benefit-text">
                                <div class="benefit-name">Yemek Kartı</div>
                                <div class="benefit-value">${mealAllowanceValue}</div>
                            </div>
                        </div>

                        <div class="benefit-item">
                            <div class="benefit-icon">
                                <img src="../../icons/bus.png" alt="bus" class="benefit-img">
                            </div>
                            <div class="benefit-text">
                                <div class="benefit-name">Ulaşım Desteği</div>
                                <div class="benefit-value">${transportAllowanceValue}</div>
                            </div>
                        </div>

                        <div class="benefit-item">
                            <div class="benefit-icon">
                                <img src="../../icons/graduation.png" alt="graduation" class="benefit-img">
                            </div>
                            <div class="benefit-text">
                                <div class="benefit-name">Eğitim Desteği</div>
                                <div class="benefit-value">${educationAllowanceValue}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="salary-container">
            </div>
        `;

        $('.tab-content').html(financeHtml);
    }


    // Çalışan detayında maaşlar için belirtilen kriterlere (yıl, ödeme durumu) göre filtreleme yapıyoruz
    function searchEmployeeSalaries(employeeId, yearId, paymentStatusId, isFiltered) {
        currentPage = 1;
        
        let url = `${baseUrl}Employees/${employeeId}/Salaries?pageNumber=${currentPage}&pageSize=${pageItems}`;

        // Sadece dolu parametreleri ekliyoruz
        if (yearId != null) url += `&yearId=${yearId}`;
        if (paymentStatusId != null) url += `&paymentStatus=${paymentStatusId}`;

        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                if (!isFiltered){
                    generateFinanceHtml(response.data[0]);
                    generateSalaryHtml();
                    fetchEmployeeSalaryFilterOptions();
                    paginationTemplate("salary-container", "prevSalaryPage", "nextSalaryPage", "salaryPageInfo", "salaryTotalItemsInfo", "pagination-salaries-table");
                }

                displaySalaryTable(response);
                
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışanın maaşları alınırken hata oluştu!");
            }
        });
    }
    

    // Dropdown'lardan filtre değerlerini alıp "Çalışan Maaş" listesini filtreliyoruz
    function applyEmployeeSalaryFilters(isFiltered) {
    
        // Dropdown'lardan seçili değerleri alıyoruz
        const selectedYearId = $('#financeYearsSelectedId').attr('data-selected-id') || null;
        const selectedPaymentStatusId = $('#financePaymentStatusSelectedId').attr('data-selected-id') || null;

        const params = new URLSearchParams(window.location.search);
        const employeeId = params.get('id');
    
        searchEmployeeSalaries(employeeId, selectedYearId, selectedPaymentStatusId, isFiltered);
    }



    // Çalışanın maaşlar bölümünde önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevSalaryPage', function() {
        if (currentPage > 1) {
            currentPage--;

            applyEmployeeSalaryFilters(true);
        }
    });
    

    
    // Çalışanın maaşlar bölümünde sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextSalaryPage', function() {
        if (currentPage < totalPages) {
            currentPage++;

            applyEmployeeSalaryFilters(true);
        }
    });



    // Çalışanın maaşlar bölümündeki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-salaries-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        applyEmployeeSalaryFilters(true);
    });






    // Çalışan detayında "Görevler" başlığına tıklandığında
    $(document).on('click', '#tasks', function(e) {
        e.preventDefault();

        fetchEmployeeTaskOverview();
    });



    function fetchEmployeeTaskOverview(){
        const params = new URLSearchParams(window.location.search);
        const employeeId = params.get('id');

        $.ajax({
            url: `${baseUrl}Employees/${employeeId}/Tasks/Overview?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                const data = response.data;

                generateTaskStatsHtml(data.statistics.data);
                generateTaskFiltersHtml();
                updatePriorityLevelList(data.filterOptions.data.priorityLevelDtos);
                updateTaskStatusList(data.filterOptions.data.taskStatusDtos);
                paginationTemplate("task-container", "prevTaskPage", "nextTaskPage", "taskPageInfo", "taskTotalItemsInfo", "pagination-tasks-table");
                displayTaskList(data.tasks);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışanın görev istatistikleri alınırken hata oluştu!");
            }
        });
    }

    

    // Dropdown'lardan filtre değerlerini alıp "Çalışan Görevleri" listesini filtreliyoruz
    function applyEmployeeTaskFilters(isFiltered) {
    
        // Dropdown'lardan seçili değerleri alıyoruz
        const selectedPriorityLevelId = $('#priorityLevelSelectedId').attr('data-selected-id') || null;
        const selectedTaskStatusId = $('#taskStatusSelectedId').attr('data-selected-id') || null;

        const params = new URLSearchParams(window.location.search);
        const employeeId = params.get('id');
    
        searchEmployeeTasks(employeeId, selectedPriorityLevelId, selectedTaskStatusId, isFiltered);
    }



    // Çalışan detayında görevler için belirtilen kriterlere (öncelik seviyesi, görev durumu) göre filtreleme yapıyoruz
    function searchEmployeeTasks(employeeId, priorityLevelId, taskStatusId, isFiltered) {
        currentPage = 1;
        
        let url = `${baseUrl}Employees/${employeeId}/Tasks?pageNumber=${currentPage}&pageSize=${pageItems}`;

        // Sadece dolu parametreleri ekliyoruz
        if (priorityLevelId != null) url += `&priorityLevel=${priorityLevelId}`;
        if (taskStatusId != null) url += `&taskStatus=${taskStatusId}`;

        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                if (!isFiltered){
                    generateTaskHtml();
                    // DOM güncellemesi tamamlandıktan sonra filtreleri çek
                    setTimeout(() => {
                        fetchEmployeeTaskFilterOptions();
                    }, 0);
                }
                
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışan istatistikleri alınırken hata oluştu!");
            }
        });
    }



    function fetchEmployeeTaskStatistics(){
        const params = new URLSearchParams(window.location.search);
        const employeeId = params.get('id');

        $.ajax({
            url: `${baseUrl}Employees/${employeeId}/Tasks/Statistics`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {

                generateTaskStatsHtml(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışanın görev istatistikleri alınırken hata oluştu!");
            }
        });
    }



    function generateTaskStatsHtml(stats){
        $('.tab-content').empty();

        let taskHtml = `
            <div class="task-stats-container">
                <div class="task-stats-header chart-title">
                    <h2>Genel Bakış</h2>
                </div>

                <div class="task-stats-section px-7">
                    <div class="task-stat-item total">
                        <div class="task-stat-number">${stats.totalTaskCount}</div>
                        <div class="task-stat-label">Toplam Görev</div>
                    </div>
                    <div class="task-stat-item completed">
                        <div class="task-stat-number">${stats.completedTaskCount}</div>
                        <div class="task-stat-label">Tamamlanan</div>
                    </div>
                    <div class="task-stat-item ongoing">
                        <div class="task-stat-number">${stats.inProgressTaskCount}</div>
                        <div class="task-stat-label">Devam Eden</div>
                    </div>
                    <div class="task-stat-item pending">
                        <div class="task-stat-number">${stats.pendingTaskCount}</div>
                        <div class="task-stat-label">Bekleyen</div>
                    </div>
                </div>
            </div>

            <div class="task-container">
            </div>
        `;

        $('.tab-content').html(taskHtml);
    }




    function generateTaskFiltersHtml(){
        $('.task-container').empty();

        let taskHtml = `
            <div class="task-header chart-title">
                <h2>Görev Listesi</h2>
            </div>

            <div class="filter-group px-7"> 
                <div class="filter-box">
                    <div class="input-wrapper">
                        <div class="dropdown" id="priorityLevelDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                            
                            <div class="dropdown-toggle" id="priorityLevelSelectedId" data-selected-id="">Tüm Öncelikler</div>
                            
                            <div class="dropdown-menu">
                                <div class="dropdown-option" data-priority-level-id="">Tüm Öncelikler</div>    
                            </div>
                        </div>        
                    </div>
                </div>

                <div class="filter-box">
                    <div class="input-wrapper">
                        <div class="dropdown" id="taskStatusDropdown">
                            <i class="fa-solid fa-caret-down" aria-hidden="true"></i>
                            
                            <div class="dropdown-toggle" id="taskStatusSelectedId" data-selected-id="">Tüm Durumlar</div>
                            
                            <div class="dropdown-menu">
                                <div class="dropdown-option" data-task-status-id="">Tüm Durumlar</div>    
                            </div>
                        </div>        
                    </div>
                </div>
            </div>

            <div class="task-list px-7">
            </div>
        `;

        $('.task-container').html(taskHtml);
    }



    // Çalışan detayındaki görevler listesi için filtreleme seçeneklerini çekiyoruz
    function fetchEmployeeTaskFilterOptions() {
        $.ajax({
            url: `${baseUrl}EmployeeStatistics/GetEmployeeTaskFilterOptions`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                const filterOptions = response.data;

                const priorityLevelDtos = filterOptions.priorityLevelDtos;

                updatePriorityLevelList(priorityLevelDtos);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : "Çalışanın görevleri alınırken hata oluştu!");
            }
        });
    }



    // "Tüm Öncelikler" option'ı için gelen öncelikleri ekle...
    function updatePriorityLevelList(priorityLevelDtos){
        let $menu = $('#priorityLevelDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let priorityLevelHTML = '';

        if (priorityLevelDtos.length > 0) {

            // Öncelikleri ekle
            priorityLevelDtos.forEach(priorityLevel => {
                priorityLevelHTML += `
                    <div class="dropdown-option" data-priority-level-id="${priorityLevel.id}">${priorityLevel.name}</div>
                `;
            })
        } 

        $menu.append(priorityLevelHTML);
    }



    // Çalışan detayındaki "Tüm Öncelikler" option'ına tıklandığında
    $(document).on('click', '#priorityLevelDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#priorityLevelDropdown");
    });



    // Çalışan detayındaki "Tüm Öncelikler" option'ının ikonuna tıklandığında
    $(document).on('click', '#priorityLevelDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#priorityLevelDropdown");
    });


    // "Tüm Öncelikler" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#priorityLevelDropdown .dropdown-option', function() {

        selectDropdownOption("#priorityLevelDropdown", this, "priority-level-id");

        applyEmployeeTaskFilters(true);
    });



    // "Tüm Durumlar" (Görev Durumları) option'ı için gelen durumları ekle...
    function updateTaskStatusList(taskStatusDtos){
        let $menu = $('#taskStatusDropdown .dropdown-menu');

        // İlk eleman hariç diğerlerini siliyoruz
        $menu.children().not(':first').remove();

        let taskStatusHTML = '';

        if (taskStatusDtos.length > 0) {

            // Durumları ekle
            taskStatusDtos.forEach(taskStatus => {
                taskStatusHTML += `
                    <div class="dropdown-option" data-task-status-id="${taskStatus.id}">${taskStatus.name}</div>
                `;
            })
        } 

        $menu.append(taskStatusHTML);
    }



    // Çalışan detayındaki "Tüm Durumlar" (Görev Durumları) option'ına tıklandığında
    $(document).on('click', '#taskStatusDropdown .dropdown-toggle', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#taskStatusDropdown");
    });



    // Çalışan detayındaki "Tüm Durumlar" (Görev Durumları) option'ının ikonuna tıklandığında
    $(document).on('click', '#taskStatusDropdown i', function(e) {
        e.stopPropagation(); 

        toggleDropdown("#taskStatusDropdown");
    });


    // "Tüm Durumlar" (Görev Durumları) option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#taskStatusDropdown .dropdown-option', function() {

        selectDropdownOption("#taskStatusDropdown", this, "priority-level-id");

        applyEmployeeTaskFilters(true);
    });



    const PriorityLevelEnum = {
        Low: 1,
        Medium: 2,
        High: 3,
        Urgent: 4
    };


    // Öncelik seviyelerinin enum değerine göre CSS sınıfları
    const priorityLevelClassMap = {
        [PriorityLevelEnum.Low]: "priority-low",
        [PriorityLevelEnum.Medium]: "priority-medium",
        [PriorityLevelEnum.High]: "priority-high",
        [PriorityLevelEnum.Urgent]: "priority-urgent"
    };


    const TaskStatusEnum = {
        Pending: 1,
        InProgress: 2,
        Completed: 3,
        Cancelled: 4
    };


    // Görevlerin status enum değerine göre CSS sınıfları
    const taskStatusClassMap = {
        [TaskStatusEnum.Pending]: "status-pending",
        [TaskStatusEnum.InProgress]: "status-inProgress",
        [TaskStatusEnum.Completed]: "status-completed",
        [TaskStatusEnum.Cancelled]: "status-cancelled"
    };



    function displayTaskList(response){

        $('.task-list').empty();
        
        let taskItemsHtml = '';

        // Görevleri tabloya ekle
        if (response.data.length > 0){
            response.data.forEach(task => {

                const startDate = new Date(task.startDate);
                const formattedStartDate = `${startDate.getDate().toString().padStart(2, '0')}.${(startDate.getMonth() + 1).toString().padStart(2, '0')}.${startDate.getFullYear()}`;

                const endDate = new Date(task.endDate);
                const formattedEndDate = `${endDate.getDate().toString().padStart(2, '0')}.${(endDate.getMonth() + 1).toString().padStart(2, '0')}.${endDate.getFullYear()}`;

                const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

                taskItemsHtml += `
                    <div class="task-card">
                        <div class="task-header">
                            <div class="task-title-section">
                                <div class="task-title">${task.name}</div>
                                <div class="task-description">${task.description}</div>
                            </div>

                            <div class="task-badges">
                                <span class="priority-badge ${priorityLevelClassMap[task.priorityLevel]}"">${task.priorityLevelName}</span>
                                <span class="status-badge ${taskStatusClassMap[task.taskStatus]}">${task.taskStatusName}</span>
                            </div>
                        </div>
                        
                        <div class="task-details">
                            <div class="detail-item">
                                <span class="detail-label">Başlangıç</span>
                                <span class="detail-value">${formattedStartDate}</span>
                            </div>

                            <div class="detail-item">
                                <span class="detail-label">Bitiş</span>
                                <span class="detail-value">${formattedEndDate}</span>
                            </div>

                            <div class="detail-item">
                                <span class="detail-label">Atayan</span>
                                <span class="detail-value">${task.assignedByFullName}</span>
                            </div>

                            <div class="detail-item">
                                <span class="detail-label">Süre</span>
                                <span class="detail-value">${dayDiff} gün</span>
                            </div>
                        </div>

                        <div class="progress-section">
                            <div class="progress-header">
                                <span class="progress-label">İlerleme Durumu</span>
                                <span class="progress-percent">${task.progressPercentage}%</span>
                            </div>

                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${task.progressPercentage}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {

            // Görev yoksa kullanıcıya bilgi mesajı göster
            taskItemsHtml = `
                <div class="no-task">
                    <i class="fas fa-tasks"></i>
                    <span>Görev kaydı bulunamadı.</span>
                </div>
            `;
        }
        
       // Tabloyu güncelle
       $('.task-list').html(taskItemsHtml);

       totalPages = response.totalPages;
       totalItems = response.totalItems;

       // Sayfa bilgisini güncelle
       $('#taskPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
       $('#taskTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

       // Sayfalama butonlarının durumunu güncelle
       $('#prevTaskPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
       $('#nextTaskPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }




    // Çalışanın görevler bölümünde önceki sayfa butonuna tıklama olayı
    $(document).on('click', '#prevTaskPage', function() {
        if (currentPage > 1) {
            currentPage--;

            applyEmployeeTaskFilters(true);
        }
    });
    

    
    // Çalışanın görevler bölümünde sonraki sayfa butonuna tıklama olayı
    $(document).on('click', '#nextTaskPage', function() {
        if (currentPage < totalPages) {
            currentPage++;

            applyEmployeeTaskFilters(true);
        }
    });



    // Çalışanın görevler bölümündeki "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '.pagination-tasks-table#paginationDropdown .dropdown-option', function() {
        
        selectDropdownOption("#paginationDropdown", this, "pagination-id");

        pageItems = $(this).text();

        applyEmployeeTaskFilters(true);
    });





    // Çalışan detay sayfasındaki sekme (tab) geçişlerini yöneten fonksiyon
    $(document).on('click', '.tab-btn', function() {

        $(".tab-btn").removeClass("active");
        $(this).addClass("active");
    });




    // Çalışan detayı için verileri çekiyoruz
    function fetchEmployeeDetails(employeeId) {
        $('.employees-body').empty();
        
        $.ajax({
            url: `${baseUrl}employees/getForAdmin/${employeeId}?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                
                if (response.success && response.data) {
                    const employee = response.data;
                    const employeeName = `${employee.firstName} ${employee.lastName}`;
                    shiftDayDtos = employee.shiftDayDtos;
                    permissionListDtos = employee.permissionListDtos;

                    // İşe Alım ve İşten Ayrılma tarihlerini formatla (12 Eylül 2024 şeklinde)
                    const hireDate = new Date(employee.hireDate);
                    const leaveDate = new Date(employee.leaveDate);

                    const hireDay = hireDate.getDate();
                    const hireMonth = monthNames[hireDate.getMonth()];
                    const hireYear = hireDate.getFullYear();
                   
                    const leaveDay = leaveDate.getDate();
                    const leaveMonth = monthNames[leaveDate.getMonth()];
                    const leaveYear = leaveDate.getFullYear();
                    
                    const formattedHireDate = `${hireDay} ${hireMonth} ${hireYear}`;
                    const formattedLeaveDate = `${leaveDay} ${leaveMonth} ${leaveYear}`;

                    // Doğum tarihini formatla
                    const birthDate = new Date(employee.birthDate);
                    const formattedBirthDate = `${birthDate.getDate().toString().padStart(2, '0')}.${(birthDate.getMonth() + 1).toString().padStart(2, '0')}.${birthDate.getFullYear()}`;
                    
                    let employeeDetailHTML = `
                        <div class="main-grid px-7">
                            <div class="profile-card">
                                <div class="profile-header">
                                    <div class="profile-photo">
                                        ${
                                            employee.imagePath === null 
                                            ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`
                                            : `<img src="${employee.imagePath}" alt="${employeeName}">`
                                        }
                                    </div>
                                    <div class="profile-name">${employeeName}</div>
                                    <div class="profile-position">${employee.positionDisplayName}</div>
                                </div>
                                <div class="profile-body">
                                    <div class="profile-item">
                                        <i class="fas fa-envelope profile-item-icon"></i>
                                        <div class="profile-item-content">
                                            <div class="profile-item-label">E-posta</div>
                                            <div class="profile-item-value">${employee.email}</div>
                                        </div>
                                    </div>
                                    <div class="profile-item">
                                        <i class="fas fa-phone profile-item-icon"></i>
                                        <div class="profile-item-content">
                                            <div class="profile-item-label">Telefon</div>
                                            <div class="profile-item-value">${employee.phone}</div>
                                        </div>
                                    </div>
                                    <div class="profile-item">
                                        <i class="fas fa-map-marker-alt profile-item-icon"></i>
                                        <div class="profile-item-content">
                                            <div class="profile-item-label">Şube</div>
                                            <div class="profile-item-value">${employee.branchName}</div>
                                        </div>
                                    </div>
                                    <div class="profile-item">
                                        <i class="fas fa-calendar profile-item-icon"></i>
                                        <div class="profile-item-content">
                                            <div class="profile-item-label">İşe Başlama</div>
                                            <div class="profile-item-value">${formattedHireDate}</div>
                                        </div>
                                    </div>
                                    <div class="profile-item">
                                        <i class="fas fa-money-bill profile-item-icon"></i>
                                        <div class="profile-item-content">
                                            <div class="profile-item-label">Maaş</div>
                                            <div class="profile-item-value">₺${Number(employee.salary).toLocaleString('tr-TR')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div class="details-section">
                                <div class="detail-card">
                                    <div class="detail-header">
                                        <h3 class="detail-title">
                                            <i class="fas fa-user"></i>
                                            Kişisel Bilgiler
                                        </h3>
                                    </div>
                                    <div class="detail-body">
                                        <div class="detail-grid">
                                            <div class="detail-item">
                                                <div class="detail-label">Ad Soyad</div>
                                                <div class="detail-value">${employeeName}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Doğum Tarihi</div>
                                                <div class="detail-value">${formattedBirthDate}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">TC Kimlik No</div>
                                                <div class="detail-value">${employee.nationalId}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Eğitim Durumu</div>
                                                <div class="detail-value">${employee.educationLevel}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Cinsiyet</div>
                                                <div class="detail-value">${employee.gender}</div>
                                            </div>
                                            ${
                                                employee.militaryStatus === null 
                                                ? ``
                                                : `<div class="detail-item">
                                                        <div class="detail-label">Askerlik Durumu</div>
                                                        <div class="detail-value">${employee.militaryStatus}</div>
                                                    </div>`
                                            }
                                            <div class="detail-item">
                                                <div class="detail-label">Medeni Durum</div>
                                                <div class="detail-value">${employee.maritalStatus}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Adres</div>
                                                <div class="detail-value">${employee.address}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="detail-card">
                                    <div class="detail-header">
                                        <h3 class="detail-title">
                                            <i class="fas fa-briefcase"></i>
                                            İş Bilgileri
                                        </h3>
                                    </div>
                                    <div class="detail-body">
                                        <div class="detail-grid">
                                            <div class="detail-item">
                                                <div class="detail-label">Pozisyon</div>
                                                <div class="detail-value">
                                                    <span class="role-badge role-${employee.positionName.toLowerCase()}">${employee.positionDisplayName}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Durum</div>
                                                <div class="detail-value">
                                                    <span class="status-badge status-${employee.workStatusName.toLowerCase()}">${employee.workStatusDisplayName}</span>
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Çalışma Tipi</div>
                                                <div class="detail-value">${employee.employmentType}</div>
                                            </div>
                                             <div class="detail-item">
                                                <div class="detail-label">Yöneticisi</div>
                                                <div class="detail-value">${employee.manager}</div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">İşten Ayrılma Tarihi</div>
                                                <div class="detail-value">
                                                ${
                                                    employee.leaveDate === null 
                                                    ? `Hâlâ çalışıyor`
                                                    : formattedLeaveDate
                                                }
                                                </div>
                                            </div>
                                            <div class="detail-item">
                                                <div class="detail-label">Deneyim Süresi</div>
                                                <div class="detail-value">${employee.experienceDuration}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!---
                                <div class="detail-card">
                                    <div class="detail-header">
                                        <h3 class="detail-title">
                                            <i class="fa-solid fa-clock"></i>
                                            Çalışma Süresi & Devamlılık
                                        </h3>
                                    </div>
                                    <div class="detail-body">
                                        <div class="performance-grid">
                                            <div class="performance-item">
                                                <div class="performance-number">4</div>
                                                <div class="performance-label">Yıllık izin kullanımı (Gün)</div>
                                            </div>
                                            <div class="performance-item">
                                                <div class="performance-number">5</div>
                                                <div class="performance-label">Fazla mesai toplamı (Saat)</div>
                                            </div>
                                            <div class="performance-item">
                                                <div class="performance-number">2</div>
                                                <div class="performance-label">Devamsızlık / rapor günleri</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                --->
                            </div>
                        </div>

                        <div class="tab-container px-7">
                            <div class="tab-nav">
                                <button class="tab-btn active" id="shifts">
                                    <i class="fa-solid fa-clock"></i>
                                    Vardiyalar
                                </button>

                                <button class="tab-btn" id="finance">
                                    <i class="fa-solid fa-coins"></i>
                                    Finansal
                                </button>

                                <button class="tab-btn" id="tasks">
                                    <i class="fa-solid fa-circle-check"></i>
                                    Görevler
                                </button>
                            </div>

                            <div class="tab-content">
                            </div>
                        </div>
                    `;
                    
                    // İçeriği güncelle
                    $('.employees-body').html(employeeDetailHTML);

                    generateShiftDayHtml();
                    generatePermissionHtml();
                    fetchYears();
                    generateTimeLineHtml();
                    
                } else {
                    showToast('error', 'Hata', 'Çalışan detayı alınırken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                if (xhr.status === 401) {
                    // Token geçersiz veya süresi dolmuş. Otomatik çıkış yapılıyor.
                    handleLogout(errorMessage);
                    return;
                }

                showToast('error', 'Hata', errorMessage ? errorMessage : 'Çalışan detayı alınırken hata oluştu!');
            }
        });
    }



    // Çalışan detayında "Çalışanlar" başlığına tıklandığında
    $(document).on('click', '#employees-link', function(e) {
        e.preventDefault();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'employees' }, 'Çalışanlar', '?page=employees'); 

        getEmployees();
    });



    // Çalışan detayını getiren fonksiyon
    function getEmployeeDetails(employeeId, employeeName) {

        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();

        // Çalışanlar için HTML yapısı
        let employeeSectionHTML = `
        <div class="employees-container">
            <div class="employees-header">
                <div class="header-content">
                    <a href="#" id="employees-link">
                        <h2>Çalışanlar</h2>
                    </a>
                    <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
                    <span>${employeeName}</span>
                </div>
            </div>
            <div class="employees-body">
                
            </div>
        </div>`;
            
        // dashboard'a ekle
        $('.dashboard-content').append(employeeSectionHTML);

        fetchEmployeeDetails(employeeId);
    }



    // Çalışan satırına tıklama olayı
    $(document).on('click', '.employee-row', function() {
        const employeeId = $(this).data('employee-id');
        const employeeName = $(this).find(".user-name").text();

        //URL'ye sahte bir adım ekliyoruz
        history.pushState(
            { page: 'employeeDetail', employeeId: employeeId, employeeName: employeeName }, 
            'Çalışan Detayı', 
            `?page=employeeDetail&id=${employeeId}`
        );
       
        getEmployeeDetails(employeeId, employeeName);
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

        }else if (page === 'branchesForReservation') {
            history.replaceState({ page: 'branchesForReservation' }, 'Şubeler', '?page=branchesForReservation');
            
            getAllBranchesForReservations();

        }else if (page === 'reservationsByBranch') {
            const branchId = localStorage.getItem('selectedBranchId');
            const branchName = localStorage.getItem('selectedBranchName');

            history.replaceState({ page: 'reservationsByBranch' }, 'Rezervasyonlar', `?page=reservationsByBranch&branchId=${branchId}`);

            getReservationTemplate(branchId, branchName, 1);

        }else if (page === 'pages') {
            history.replaceState({ page: 'pages' }, 'Sayfalar', '?page=pages'); 

            getPages();

        }else if (page === 'headOffice') {
            history.replaceState({ page: 'headOffice' }, 'Genel Merkez', '?page=headOffice'); 

            getHeadOffice();

        }else if (page === 'employees') {
            history.replaceState({ page: 'employees' }, 'Çalışanlar', '?page=employees'); 

            getEmployees();

        }else if (page === 'employeeDetail') {
            const state = history.state;

            const employeeId = state.employeeId;
            const employeeName = state.employeeName;

            history.replaceState(
                { page: 'employeeDetail', employeeId: employeeId, employeeName: employeeName }, 
                'Çalışan Detayı', 
                `?page=employeeDetail&id=${employeeId}`
            );
           
            getEmployeeDetails(employeeId, employeeName);
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

                case 'pages':
                    getPages();
                    break;

                case 'headOffice':
                    getHeadOffice();
                    break;
                
                case 'employees':
                    getEmployees();
                    break;

                case 'employeeDetail':

                    const state = history.state;

                    const employeeId = state?.employeeId;
                    const employeeName = state?.employeeName;

                    if (employeeId) {
                        getEmployeeDetails(employeeId, employeeName);
                    } else {
                        getEmployees();
                    }
                    break;

                case 'dashboard':
                    resetDashboard();
                    getStatistics();
                    break;
                
                default:
                    // Eğer hiç tanımlamadığımız bir page değeri gelirse token'ı silip ve login sayfasına yönlendiriyoruz.
                    handleLogout();
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

        //URL'ye sahte bir adım ekliyoruz
        history.pushState({ page: 'dashboard' }, 'Anasayfa', '?page=dashboard'); 
    });

    // Dashboard'u ilk haline getiren fonksiyon
    function resetDashboard() {
        // Mevcut chart instance'larını temizle
        if (ordersChartInstance) { ordersChartInstance.destroy(); ordersChartInstance = null; }
        if (reservationsChartInstance) { reservationsChartInstance.destroy(); reservationsChartInstance = null; }
        if (categoriesChartInstance) { categoriesChartInstance.destroy(); categoriesChartInstance = null; }

        // Dashboard içeriğini temizle
        $('.dashboard-content').empty();

        // Yeni dashboard HTML yapısını oluştur
        let dashboardHTML = `
            <!-- Hoş Geldin Bölümü -->
			<div class="welcome-section">
				<div class="welcome-text">
					<h2>Hoş Geldiniz</h2>
					<p>İşte restoranınızın güncel durumu</p>
				</div>
				<div class="welcome-date">
					<i class="fa-regular fa-calendar"></i>
					<span id="currentDate"></span>
				</div>
			</div>

			<!-- İstatistik Kartları -->
			<div class="dash-stats-grid">
				<div class="dash-card users" style="--accent-color: #06B6D4;">
					<div class="dash-card-icon">
						<i class="fa fa-users"></i>
					</div>
					<div class="dash-card-info">
						<span class="dash-card-count" id="statUsers">0</span>
						<span class="dash-card-label">Kullanıcılar</span>
					</div>
				</div>

				<div class="dash-card orders" style="--accent-color: #10b95c;">
					<div class="dash-card-icon">
						<i class="fa fa-shopping-bag"></i>
					</div>
					<div class="dash-card-info">
						<span class="dash-card-count" id="statOrders">0</span>
						<span class="dash-card-label">Siparişler</span>
					</div>
				</div>

				<div class="dash-card reservations" style="--accent-color: #f5be0b;">
					<div class="dash-card-icon">
						<img src="../../icons/home-restaurant-table.png" alt="Rezervasyonlar">
					</div>
					<div class="dash-card-info">
						<span class="dash-card-count" id="statReservations">0</span>
						<span class="dash-card-label">Rezervasyonlar</span>
					</div>
				</div>

				<div class="dash-card employees" style="--accent-color: #8B5CF6;">
					<div class="dash-card-icon">
						<i class="fa-solid fa-address-card"></i>
					</div>
					<div class="dash-card-info">
						<span class="dash-card-count" id="statEmployees">0</span>
						<span class="dash-card-label">Çalışanlar</span>
					</div>
				</div>
			</div>

			<!-- Grafikler Bölümü -->
			<div class="charts-grid">
				<div class="chart-card chart-large">
					<div class="chart-card-header">
						<h3>Aylık Sipariş Trendi</h3>
					</div>
					<div class="chart-card-body">
						<canvas id="ordersChart"></canvas>
					</div>
				</div>
				<div class="chart-card chart-small">
					<div class="chart-card-header">
						<h3>Rezervasyon Durumu</h3>
					</div>
					<div class="chart-card-body">
						<canvas id="reservationsChart"></canvas>
					</div>
				</div>
			</div>

			<!-- Alt Bölüm: Tablo + Grafik -->
			<div class="charts-grid">
				<div class="chart-card chart-large">
					<div class="chart-card-header">
						<h3>Son Siparişler</h3>
					</div>
					<div class="chart-card-body dashboard-table-body">
						<div class="dashboard-table-wrapper">
							<table class="dashboard-table">
								<thead>
									<tr>
										<th>Sipariş No</th>
										<th>Müşteri</th>
										<th>Tutar</th>
										<th>Durum</th>
										<th>Tarih</th>
									</tr>
								</thead>
								<tbody id="recentOrdersBody">
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="chart-card chart-small">
					<div class="chart-card-header">
						<h3>Popüler Menü Kategorileri</h3>
					</div>
					<div class="chart-card-body">
						<canvas id="categoriesChart"></canvas>
					</div>
				</div>
			</div>`;

        // Dashboard içeriğini güncelle
        $('.dashboard-content').append(dashboardHTML);
    }

    
    // Dash kartlarına tıklama - ilgili sidebar menüsüne yönlendir
    $(document).on('click', '.dash-card.users', function() {
        $('.sidenav a:contains("Kullanıcılar")').trigger('click');
    });
    
    
    $(document).on('click', '.dash-card.orders', function() {
        $('.sidenav a:contains("Siparişler")').trigger('click');
    });
    
    
    $(document).on('click', '.dash-card.reservations', function() {
        $('.sidenav a:contains("Rezervasyonlar")').trigger('click');
    });
    

    $(document).on('click', '.dash-card.employees', function() {
        $('.sidenav a:contains("Çalışanlar")').trigger('click');
    });
    
    
    $(document).on('click', '.sidenav-header', function() {
        $('.sidenav a:contains("Anasayfa")').trigger('click');
    });


    
});