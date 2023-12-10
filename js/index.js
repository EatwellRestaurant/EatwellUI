function getMealCategoryProducts(menuCategoryId) {
    return new Promise(function (resolve, reject) {
        $.get("http://eatwellapi.somee.com/api/products/getproductsbymealcategoryid?id=" + menuCategoryId, function (data) {
            let productIncomingData = data.data[1];
            resolve(productIncomingData);
            
        }).fail(function (jqXHR, textStatus, errorThrown) {
            reject(`'Ürünler' alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);
        });
    });
}



$.get( "http://eatwellapi.somee.com/api/mealcategories/getall", function( data ) {
    let mealCategoriesIncomingData = data.data;
    var box = "";
    let promises = mealCategoriesIncomingData.map(function (mealCategory) {
        let menuCategoryId = mealCategory.id;

        return getMealCategoryProducts(menuCategoryId);
    });

    Promise.all(promises)
        .then(function (productsData) {
            
            productsData.forEach(function (productIncomingData) {
                let productImage = productIncomingData.imagePath.replace("wwwroot", "http://eatwellapi.somee.com");
                let productName = productIncomingData.name;
                let productPrice = productIncomingData.price;

                let element = `
                    <div class="product">
                        <div class="col flex">
                            <img src=${productImage} alt=${productName}>
                            <div class="food-information flex">
                                <span class="food-name">${productName}</span>
                                <span class="food-price">${productPrice} ₺</span>
                            </div>
                        </div>
                    </div>`;

                box += element;
            });

            if (document.querySelector(".products") != null) {
                document.querySelector(".products").innerHTML = box;
            }
        })
        .catch(function (error) {
            console.error(error);
        });
    }
);



//Şube resimlerini getiriyoruz.
$.ajax({
    url: "http://eatwellapi.somee.com/api/branchimages/getall",
    dataType: "json",
    error:  function (jqXHR, textStatus, errorThrown) {
        console.log(`Veri alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);

        let result = jqXHR.responseJSON;

        for(let key in result) {
            console.log(key + ":", result[key]);
        }
    }
});


$.get( "http://eatwellapi.somee.com/api/branchimages/getall", function( data ) {

    let incomingData = [];

    for (let i = 0; i < data.data.length; i++) {    
        if(data.data[i].branchId == 1){
            incomingData.push(data.data[i]);
        }
    }

    var box="";
    for(let i=0; i < incomingData.length && i < 6; i++){
        
        let branch_image = incomingData[i].imagePath.replace("wwwroot","http://eatwellapi.somee.com/");

        let branch_title = incomingData[i].title;

        let element = `
        <div class="image">
            <div class="border flex">
                <img src="${branch_image}" alt="${branch_title}">
            </div>
        </div>`;
        box+=element;
    }
    document.querySelector(".images").innerHTML = box;
    console.log( "Şube Resimleri Getirildi" );
});






