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



    const menuId = localStorage.getItem("selectedMenuId");
    let currentPage = 1; // Global tanım
    let totalPages = 1;  // Toplam sayfa sayısı
    let totalItems = 0;  // Toplam öge sayısı
    let pageItems = 10;  // Toplam görüntülenmek istenen öge sayısı



    function displayProducts(products){
        $('.product-grid').empty();

        let box = '';
        
        products.forEach(product => {
            box += `
            <div class="product-card">
                <span class="badge badge--popular">Popüler</span>
                
                <div class="card-image">
                    <img src= ${product.imagePath} alt= ${product.name}>
                </div>

                <div class="card-body">
                    <h3 class="card-name">${product.name}</h3>
                    <div class="card-divider"></div>
                    <div class="card-price">${product.price} ₺</div>
                </div>
            </div>`;
        });

        $('.product-grid').html(box);
    }



    function updatePagination(response){
        totalPages = response.totalPages;
        totalItems = response.totalItems;

        // Sayfa bilgisini güncelle
        $('#productPageInfo').text(`Sayfa ${currentPage} / ${totalPages}`);
        $('#productTotalItemsInfo').text(`Toplam Kayıt: ${totalItems}`);

        // Sayfalama butonlarının durumunu güncelle
        $('#prevProductPage').prop('disabled', !response.hasPrevious); // İlk sayfada geri butonu devre dışı
        $('#nextProductPage').prop('disabled', !response.hasNext); // Son sayfada ileri butonu devre dışı
    }



    function fetchMenu() {
        $.ajax({
            url: `https://eatwell-api.azurewebsites.net/api/mealcategories/${menuId}?pageNumber=${currentPage}&pageSize=${pageItems}`,
            type: 'GET',
            success: function(response) {
                displayProducts(response.data.products.data);

                updatePagination(response.data.products);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;

                showToast('error', 'Hata', errorMessage ? errorMessage : "Menü alınırken hata oluştu!");
            }
        });
    }

    fetchMenu();

});
