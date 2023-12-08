const urlParams = new URLSearchParams(window.location.search);
const idName = urlParams.get('id');
const idNameSplit = idName.split(" ");
const id = idNameSplit[0];
let name = "";

for (let i = 1; i < idNameSplit.length; i++) {
    name += idNameSplit[i] + " ";
}

document.title = name;
document.querySelector("#header-name").innerHTML = name; 


function karakterCevir(kelime){
   let mesaj = kelime;
   const oldValue =  ["ö", "Ö", "ü", "Ü", "ç", "Ç", "İ", "ı", "Ğ", "ğ", "Ş", "ş", " " ];
   const newValue =  [ 'o', 'O', 'u', 'U', 'c', 'C', 'I', 'i', 'G', 'g', 'S', 's', "" ];

   console.log(oldValue.length)
   for (let i = 0; i < oldValue.length; i++)
   {
      mesaj = mesaj.replaceAll(oldValue[i], newValue[i]);
   }
   return mesaj;
}

let newName = karakterCevir(name).toLowerCase();

document.getElementById("menu").id = newName;
document.querySelector("#product-icon").src = "../icons/" + newName + ".png"; 


$.ajax({
    url: "https://localhost:7189/api/products/getproductsbymealcategoryid" + "?id=" + id,
    dataType: "json",
    error:  function (jqXHR, textStatus, errorThrown) {
        console.log(`'Ürünler' alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);

        let result = jqXHR.responseJSON;

        for(let key in result) {
            console.log(key + ":", result[key]);
        }
    }
    
});

$.get( "https://localhost:7189/api/products/getproductsbymealcategoryid" + "?id=" + id, function( data ) {

    let incomingData = data.data;
    var box="";
    for(let i=0; i < incomingData.length; i++){
        
        let product_image = incomingData[i].imagePath.replace("wwwroot","https://localhost:7189");
        let product_name = incomingData[i].name;
        let product_price = incomingData[i].price;

        let element = `
        <div class="product">
            <div class="col flex">
              <img src= ${product_image} alt= ${product_name}>
              <div class="food-information flex">
                <span class="food-name">${product_name}</span>
                <span class="food-price">${product_price}₺</span>
              </div>
            </div>
          </div>`;
            
        box+=element;
        if(document.querySelector(".products") != null){
            document.querySelector(".products").innerHTML = box;
        } 
    }
    console.log( "Ürünler Getirildi" );
});