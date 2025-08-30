$(document).ready(function() { 

    //Global değişkenler
    const baseUrl = 'https://eatwell-api.azurewebsites.net/api/';
    const pageContentIds = {
        HomeHero: 1 ,
        HomeAboutSection: 2, 
        HomeMenuSection: 3
    };

    
    // Sayfanın içeriğini getiren fonksiyon
    function getPageContents() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${baseUrl}pageContents?pageEnum=1`,
                type: 'GET',
                success: function(response) {
                    response.data.forEach(pageContent => {
                            
                        // Anasayfa - Hero
                        if (pageContent.id == pageContentIds.HomeHero) {
                            $('#homeImage').css('background-image', `url(${pageContent.imagePath})`);
                        }

                        // Anasayfa - About Section
                        else if (pageContent.id == pageContentIds.HomeAboutSection) {
                            let plainText = pageContent.description
                            .replace(/<[^>]*>/g, '') // HTML etiketlerini siliyoruz.
                            .replace(/\n\s*\n/g, '<br><br>'); // Boş satırları <br><br> ile değiştiriyoruz.
                    
                            $('.about-text').html(plainText); 
                            $('#aboutImage').attr('src', pageContent.imagePath);
                        }

                        // Anasayfa - Menu Section
                        else if (pageContent.id == pageContentIds.HomeMenuSection) {
                            $('#menuImage').css('background-image', `url(${pageContent.imagePath})`);
                        }
                    });

                    resolve();
                },
                error: function(xhr) {
                    const errorMessage = xhr.responseJSON?.Message;
                    showToast('error', 'Hata', errorMessage ? errorMessage : 'Sayfa içerikleri alınırken hata oluştu!');
                    reject(errorMessage);
                }
            });
        });
    }



    // Ürünleri getiren fonksiyon
    function getProducts() {
        return new Promise((resolve, reject) => {
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
                    
                    // Ürünleri dashboard'a ekle
                    $('.products').append(box);
                    resolve();
                },
                error: function(xhr) {
                    const errorMessage = xhr.responseJSON?.Message;
                    showToast('error', 'Hata', errorMessage ? errorMessage : 'Ürünler alınırken hata oluştu!');
                    reject(errorMessage);
                }
            });
        });
    }



    async function runMethods() {
        $('#overlay').css('display','flex');

        await getPageContents();
        
        await getProducts();
        
        $('#overlay').fadeOut(900);
    }
    
    runMethods();
});



