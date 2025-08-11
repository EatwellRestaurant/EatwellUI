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
    let firstHomeHeroImagePath = null;
    let firstHomeAboutSectionImagePath = null;
    let firstHomeAboutSectionText = null;
    let incomingProducts = '';
    let selectedProductIds = []; // Menüler bölümüne eklenmiş olan ürünlerin id değerlerini tuttuğumuz dizi 
    const pageContentIds = {
        HomeHero: 1 ,
        HomeAboutSection: 2, 
        HomeMenuSection: 3
    };
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    

    if (new Date(expiration) < new Date()){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userName');
        localStorage.removeItem('adminRemembered');
        
        window.location.href = '../admin-login.html';
    }
    

    // Token kontrolü
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



    // Sayfanın içeriğini (değiştirilebilen resimleri ve hakkımda metnini) getiren fonksiyon
    function getPageContents() {
        $.ajax({
            url: `${baseUrl}pageContents?page=1`,
            type: 'GET',
            success: function(response) {

                response.data.forEach(pageContent => {
                        
                    // Anasayfa - Hero
                    if (pageContent.id == pageContentIds.HomeHero) {
                        $('#previewHomeImage').css('background-image', `url(${pageContent.imagePath})`);
                        firstHomeHeroImagePath = pageContent.imagePath;
                    }
                    
                    // Anasayfa - About Section
                    if (pageContent.id == pageContentIds.HomeAboutSection) {
                        let plainText = pageContent.description.replace(/<[^>]*>/g, '');
                        $('.about-text').val(plainText);

                        firstHomeAboutSectionText = plainText;

                        $('#previewAboutImage').attr('src', pageContent.imagePath);
                        firstHomeAboutSectionImagePath = pageContent.imagePath;
                    }
                });
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Sayfa içerikleri alınırken hata oluştu!');
            }
        });
    }




    // Resim seçildiğinde önizleme gösterme (Anasayfadaki ilk karşılama resmi için)
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

            $('#previewHomeImage .image-editor-actions').css('display','flex');
        }
    });



    // Değiştirilen anasayfa hero resmini kaydetme (güncelleme)
    $(document).on('click', '#previewHomeImage .btn-save', function() {
        let btn = $(this);
        btn.find('.save-loader').css('display','inline-block');
        btn.find('i').css('display','none');
        
        const file = $('#homeImage')[0].files[0];
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('id', pageContentIds.HomeHero);
        
        $.ajax({
            url: `${baseUrl}pageContents`,
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Resim başarıyla güncellendi!');
                    
                    $('#previewHomeImage .image-editor-actions').css('display','none');
                    btn.find('.save-loader').css('display','none');
                    btn.find('i').css('display','inline-block');

                    firstHomeHeroImagePath = response.data;
                    
                } else {
                    showToast('error', 'Hata', 'Resim güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Resim güncellenirken hata oluştu!');
            }
        });
    });
    


    // Değiştirilen anasayfa hero resmini geri alma
    $(document).on('click', '#previewHomeImage .btn-undo', function(){
        $('#previewHomeImage').css('background-image', `url(${firstHomeHeroImagePath})`);
        
        // Aynı dosyayı tekrar seçebilmek için input'u sıfırlıyoruz.
        $('#homeImage').val('');

        $('#previewHomeImage .image-editor-actions').css('display','none');
    });



    // Resim seçildiğinde önizleme gösterme (Anasayfadaki hakkımızda resmi için)
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

            $('.about-image .image-editor-actions').css('display','flex');
        }
    });



    // Değiştirilen anasayfa hakkımızda resmini kaydetme (güncelleme)
    $(document).on('click', '.about-image .btn-save', function() {
        let btn = $(this);
        btn.find('.save-loader').css('display','inline-block');
        btn.find('i').css('display','none');
        
        const file = $('#aboutImage')[0].files[0];
        
        const formData = new FormData();
        formData.append('image', file);
        formData.append('id', pageContentIds.HomeAboutSection);
        
        $.ajax({
            url: `${baseUrl}pageContents`,
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Resim başarıyla güncellendi!');
                    
                    $('.about-image .image-editor-actions').css('display','none');
                    btn.find('.save-loader').css('display','none');
                    btn.find('i').css('display','inline-block');

                    firstHomeAboutSectionImagePath = response.data;
                    
                } else {
                    showToast('error', 'Hata', 'Resim güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Resim güncellenirken hata oluştu!');
                
                btn.find('.save-loader').css('display','none');
                btn.find('i').css('display','inline-block');
            }
        });
    });



    // Değiştirilen anasayfa hakkımızda resmini geri alma
    $(document).on('click', '.about-image .btn-undo', function(){
        $('#previewAboutImage').attr('src', `${firstHomeAboutSectionImagePath}`);
        
        // Aynı dosyayı tekrar seçebilmek için input'u sıfırlıyoruz.
        $('#aboutImage').val('');
        
        $('.about-image .image-editor-actions').css('display','none');
    });
    
    
    
    // Anasayfa hakkımızda metninde herhangi bir değişiklik yapıldığında
    $('.about-text').on('input', function () {
        $('.text-editor').css('display', 'block');
    });



    // Değiştirilen anasayfa hakkımızda metnini kaydetme (güncelleme)
    $(document).on('click', '.about-section-actions .btn-save', function() {
        let btn = $(this);
        btn.find('.save-loader').css('display','inline-block');
        btn.find('i').css('display','none');
        
        const formData = new FormData();
        formData.append('id', pageContentIds.HomeAboutSection);
        formData.append('description',$('.about-text').val());
        
        $.ajax({
            url: `${baseUrl}pageContents`,
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    showToast('success', 'Başarılı', 'Metin başarıyla güncellendi!');
                    
                    $('.text-editor').css('display','none');
                    btn.find('.save-loader').css('display','none');
                    btn.find('i').css('display','inline-block');
                    $('.about-image .image-editor').css('top', '475px');

                    firstHomeAboutSectionText = response.data;
                    
                } else {
                    showToast('error', 'Hata', 'Metin güncellenirken hata oluştu!');
                }
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Metin güncellenirken hata oluştu!');
                
                btn.find('.save-loader').css('display','none');
                btn.find('i').css('display','inline-block');
            }
        });
    });



    // Değiştirilen anasayfa hakkımızda metnini geri alma
    $(document).on('click', '.about-section-actions .btn-undo', function(){
        $('.about-text').val(firstHomeAboutSectionText); 
        
        $('.text-editor').css('display','none');

    });



    // Resim seçildiğinde önizleme gösterme (Anasayfadaki menü resmi için)
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
                        <div class="product" data-product-id="${product.id}">
                            <div class="col flex">
                                <button class="admin-btn-delete-product" data-product-id="${product.id}">
                                    <i class="fa-solid fa-circle-xmark"></i>
                                </button>
                                <img src=${product.imagePath} alt=${product.name}>
                                <div class="food-information flex">
                                    <span class="food-name">${product.name}</span>
                                    <span class="food-price">${product.price} ₺</span>
                                </div>
                            </div>
                        </div>`;

                        box += productHtml;
                    });
                } 
                
                box += `
                    <div class="product">
                        <div class="col flex">
                            <img src="../../../icons/selected-products.png" alt="ürün">
                            <div class="food-information flex">
                                <span class="new-food">Yeni Ürün Seç</span>
                                <div class="dropdown" id="customDropdown">
                                    <div class="dropdown-toggle" id="selectedId" data-selected-id="">Seçiniz...</div>
                                    <div class="dropdown-product"></div>
                                </div>
                            </div>
                        </div>
                    </div>`;                    


                // Yalnızca seçilen iki ürünün birbirleriyle yer değiştirmesini sağlıyoruz.
                let $firstSelected = null;

                $('.products').on('click', '.product:not(.no-drag)', function (e) {
                    // Eğer tıklanan element silme butonu ise işlemi durdur...
                    if ($(e.target).closest('.admin-btn-delete-product').length) {
                        return;
                    }

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



    $(document).on('click', '.product .admin-btn-delete-product', function(e) {
        e.stopPropagation();

        const product = $(this).closest('.product');
        const productId = product.data('product-id');
        const productPrice = product.find('.food-price').text();
        const productName = product.find('.food-name').text();
        const productImagePath = product.find('img').attr('src');

        selectedProductIds = selectedProductIds.filter(p => p !== productId);

        let productHTML = `
        <div class="dropdown-option" data-product-id="${productId}" data-product-price="${productPrice}" data-product-image-path="${productImagePath}">${productName}</div>
        `;
        
        $('.dropdown-product').append(productHTML);
        
        product.remove();
    });

    

    function getSelectableProductsHtml(){
        let productsHTML = '';

        // Ürünleri ekle
        incomingProducts.forEach(product => {

            // Eğer ilgili product.id, selectedProductIds listesinin içerisinde yoksa "Yeni Ürün Seç" listesine ekliyoruz.
            if (!selectedProductIds.includes(product.id)) {
                productsHTML += `
                <div class="dropdown-option" data-product-id="${product.id}" data-product-price="${product.price}" data-product-image-path="${product.imagePath}">${product.name}</div>
                `;
            }
        });

        return productsHTML;
    }

    
    
    function updateUnselectedProductList(){
        $.ajax({
            url: `${baseUrl}products/getAll`,
            type: 'GET',
            success: function(response) {
                incomingProducts = response.data;
                
                // "Yeni Ürün Seç" listesini temizle
                $('.dropdown-product').empty();

                let productsHTML = '';
                
                if (incomingProducts.length > 0) {

                    // Menüler bölümüne eklenmiş olan ürünlerin, "Yeni Ürün Seç" listesine eklenmemesi için id bilgilerini alıyoruz.
                    // .product:not(.no-drag) --> Listedeki son ögeyi bu seçime dahil etmiyoruz. 
                    $('.products .product:not(.no-drag)').each(function () {
                        selectedProductIds.push($(this).data('product-id'));
                    });

                    productsHTML = getSelectableProductsHtml();

                } else {
                    productsHTML = `
                    <h3 class="empty-list">Henüz ürün bulunmamaktadır.</h3>
                    `;
                }
                
                $('.dropdown-product').html(productsHTML);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : 'Ürünler alınırken hata oluştu!');
            }
        });
    }
    
    
    // "Yeni Ürün Seç" listesine tıklandığında listenin açılması...
    $(document).on('click', '.dropdown-toggle', function(e) {
        e.stopPropagation(); 
        
        const product = $("#customDropdown").find(".dropdown-product");
        product.toggleClass("active");
        
        if (product.hasClass("active")) {
            $(".dropdown-toggle").css("border-color", "#ffc515"); 
        } else {
            $(".dropdown-toggle").css("border-color", "#dedbdb"); 
        }
    });



    // "Yeni Ürün Seç" listesinde ürünlerin üzerine gelindiğinde resimlerinin görüntülenmesi için...
    $(document).on('mouseenter', '.dropdown-option', function () {
        const imagePath = $(this).data('productImagePath'); 
        const previewImage = $(".product.no-drag").find("img");
        previewImage.attr('src', imagePath);
    });



    // "Yeni Ürün Seç" listesinde bir seçenek (ürün) seçildiğinde listeyi kapat ve ürünü menüler bölümüne ekle.
    $(document).on('click', '.dropdown-option', function() {
        const label = $(this).text();
        const selectedId = $(this).data('product-id');
        const selectedImagePath = $(this).data('product-image-path');
        const selectedPrice = $(this).data('product-price');

        let productHtml = `
            <div class="product" data-product-id="${selectedId}">
                <div class="col flex">
                    <button class="admin-btn-delete-product" data-product-id="${selectedId}">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </button>
                    <img src=${selectedImagePath} alt=${label}>
                    <div class="food-information flex">
                        <span class="food-name">${label}</span>
                        <span class="food-price">${selectedPrice} ₺</span>
                    </div>
                </div>
            </div>`;

        
        let lastDraggableProduct = $('.products .product:not(.no-drag)').last();
        
        if (lastDraggableProduct.length == 0){
            // Eğer menüde hiç ürün yoksa direkt içeriğe ekliyoruz.
            $('.products .product').before(productHtml);

        }else{
            // Seçtiğimiz ürünü, menüdeki son ürünün sonuna ekliyoruz.
            lastDraggableProduct.after(productHtml);
        }

        


        // Yeni ürün eklemek için oluşturduğumuz div elemanının resmini eski haline getiriyoruz.
        const previewImage = $(".product.no-drag").find("img");
        previewImage.attr('src', '../../../icons/selected-products.png');


        // Eklenen ürünün id bilgisini selectedProductIds listesine ekliyoruz. 
        selectedProductIds.push(selectedId);
        // Eklenen ürünü, "Yeni Ürün Seç" listesinden kaldırıyoruz.
        $(this).remove();

        
        // dropdown'ı kapatıp rengini soluklaştırıyoruz.
        $("#customDropdown").find(".dropdown-product").removeClass("active");
        $(".dropdown-toggle").css("border-color", "#dedbdb"); 
    });


    
    // Dışarı tıklanınca ilgili menüleri kapat
    $(document).on("click", function (e) {

        // Eğer tıklanan yer "Yeni Ürün Seç" listesi veya içindeki seçenekler değilse
        if (!$("#customDropdown").is(e.target) && $("#customDropdown").has(e.target).length === 0) {
            $("#customDropdown").find(".dropdown-product").removeClass("active");
            $(".dropdown-toggle").css("border-color", "#dedbdb"); 


            // "Yeni Ürün Seç" listesinde eğer bir ürün seçilmezse küçük resmi eski haline getiriyoruz.
            const previewImage = $(".product.no-drag").find("img");
            const selectedId = $('#selectedId').data('selected-id');
            
            if (!selectedId) {
                // Seçili ürün yoksa varsayılan resmi yükle
                previewImage.attr('src', '../../../icons/selected-products.png');
            }
        }
    });


    // Backend'de üst üste atılan isteklerden dolayı hata almamak için updateUnselectedProductList() metodunu 1sn sonra çağırıyoruz. 
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function runMethods() {
        $('#overlay').css('display','flex');

        getPageContents();
        
        await delay(500);
        getProducts();
        
        await delay(500);
        updateUnselectedProductList();
        
        $('#overlay').fadeOut(900);
    }
    
    runMethods();

});


