$(document).ready(function() {

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



    function displayMenus(menus) {
        $('.row').empty();

        let box = '';
        
        menus.forEach(menu => {
            box += `
            <div class='menu-card' data-id="${menu.id}">
                <a href='menu-category.html'>
                    <img src='${menu.imagePath}' alt='${menu.name}'>
                    <div class='menu-body'>
                        <span class='menu-name'>${menu.name}</span>
                        <span class='menu-arrow'>
                            <i class="fa-solid fa-arrow-right"></i>
                        </span>
                    </div>
                </a>
            </div>`;
        });

        $('.row').html(box);
    }



    $(document).on('click', '.menu-card', function () {
        const id = $(this).data('id');

        localStorage.setItem("selectedMenuId", id);
    });


    
    let currentPage = 1; // Global tanım
    let totalPages = 1;  // Toplam sayfa sayısı
    let totalItems = 0;  // Toplam öge sayısı
    let pageItems = 10;  // Toplam görüntülenmek istenen öge sayısı


    function updatePagination(response){
        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#menuPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#menuTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevMenuPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextMenuPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }



    // Pagination bölümündeki "Göster" option'ına veya ikonuna tıklandığında
    $(document).on('click', '#paginationDropdown .dropdown-toggle, #paginationDropdown i', function(e) {
        e.stopPropagation(); 

        const dropdown = $("#paginationDropdown");
        const toggle = dropdown.find(".dropdown-toggle");
        const menu = dropdown.find(".dropdown-menu");

        menu.toggleClass("active");
    
        if (menu.hasClass("active")) {
            toggle.css("border-color", "#858d99");
            dropdown.find('i').addClass('rotated-180');
        } else {
            toggle.css("border-color", "#dedbdb");
            dropdown.find('i').removeClass('rotated-180');
        }
    });



    // "Göster" option kutusunda bir seçenek seçildiğinde
    $(document).on('click', '#paginationDropdown .dropdown-option', function() {
        
        const $this = $(this);
        const dropdown = $("#paginationDropdown");
        const dropdownToggle = dropdown.find(".dropdown-toggle");

        const label = $this.text();
        const selectedId = $this.data("pagination-id");

        dropdownToggle.text(label)
            .css("color", "#000")
            .attr('data-selected-id', selectedId);

        dropdown.find(".dropdown-menu").removeClass("active");
        dropdownToggle.css("border-color", "#dedbdb");
        dropdown.find('i').removeClass('rotated-180');

        pageItems = label;

        fetchMenus();
    });


    // Dışarı tıklanınca pagination menüsünü kapat
    $(document).on("click", function (e) {

        const dropdown = $("#paginationDropdown");

        // Eğer tıklanan yer dropdown'ın içi değilse
        if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
            
            dropdown.find(".dropdown-menu").removeClass("active");
            dropdown.find(".dropdown-toggle").css("border-color", "#dedbdb");
            dropdown.find('i').removeClass('rotated-180');
        }
    });


    function fetchMenus() {
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/mealcategories/active/display?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            success: function(response) {
                displayMenus(response.data);

                updatePagination(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                showToast('error', 'Hata', errorMessage ? errorMessage : "Menüler alınırken hata oluştu!");
            }
        });
    }

    fetchMenus();
});








       





