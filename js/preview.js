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
    const baseUrl = 'https://eatwell-api.azurewebsites.net/api/';


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
                $('#previewMenu').css('background-image', `url(${e.target.result})`);
            }
            
            // Dosyayı base64 formatında okuyoruz    
            reader.readAsDataURL(file); 
        }
    });



    // Ürünleri getiren fonksiyon
    function getProducts() {
        $.ajax({
            url: `${baseUrl}products/getSelectedProducts`,
            type: 'GET',
            success: function(response) {
                // Products içeriğini temizle
                $('.products').empty();

                let box = '';
                let productHtml = '';
                                
                // Ürünleri göster
                if (response.data.length > 0) {
                    response.data.forEach(product => {                        
                        
                        // Ürünler için HTML yapısı
                        productHtml = `
                        <div class="product">
                            <div class="col flex">
                                <i class="fa-solid fa-circle-xmark"></i>
                                <img src=${product.imagePath} alt=${product.name}>
                                <div class="food-information flex">
                                    <span class="food-name">${product.name}</span>
                                    <span class="food-price">${product.price} ₺</span>
                                </div>
                            </div>
                        </div>`;

                        box += productHtml;
                    });

                    box += `
                        <div class="product">
                            <div class="col flex">
                                <img src="../../../icons/selected-products.png" alt="ürün">
                                <div class="food-information flex">
                                    <span class="new-food">Yeni Ürün Seç</span>
                                    <div class="dropdown" id="customDropdown">
                                        <div class="dropdown-toggle" id="selectedId" data-selected-id="" style="border-color: rgb(255, 197, 21);">Seçiniz...</div>
                                    </div>
                                </div>
                            </div>
                        </div>`;                    



                    // Yalnızca seçilen iki ürünün birbirleriyle yer değiştirmesini sağlıyoruz.
                    let $firstSelected = null;

                    $('.products').on('click', '.product:not(.no-drag)', function () {
                        
                        // 1. tıklama. Yani seçim yapılıyor.
                        if (!$firstSelected) {
                            $firstSelected = $(this); // $(this) ile tıklanan öğe alınıp $firstSelected olarak kaydediliyor.
                            $firstSelected.addClass('selected'); // Görsel olarak seçildiğini göstermek için selected sınıfını ekliyoruz.
                            return;
                        }

                        // 2. kez aynı öğeye tıklandıysa seçim iptal ediliyor.
                        if ($firstSelected.is($(this))) {
                            $firstSelected.removeClass('selected');
                            $firstSelected = null;
                            return;
                        }

                        // 2. öğe seçildi. Yani yerleri değiştiriliyor.
                        const $secondSelected = $(this);
                        
                        const $clone1 = $firstSelected.clone(true); // Her iki öğe de .clone(true) ile tüm event handler'larıyla birlikte klonlanıyor.
                        const $clone2 = $secondSelected.clone(true);
                    
                        $firstSelected.replaceWith($clone2); //replaceWith ile birbirlerinin yerine geçmeleri sağlanıyor.
                        $secondSelected.replaceWith($clone1);
                    
                        $('.product').removeClass('selected');
                        $firstSelected = null;
                    });
                } 
                
                // Ürünleri dashboard'a ekle
                $('.products').append(box);
                $('.product:last-child').addClass('no-drag');

            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Ürünler alınırken hata oluştu!');
            }
        });
    }

    getProducts();
});


