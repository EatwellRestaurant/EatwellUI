$.ajax({
    url: "http://eatwellapi.somee.com/api/mealcategories/getall",
    dataType: "json",
    error:  function (jqXHR, textStatus, errorThrown) {
        console.log(`'Yemek kategorileri' alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);

        let result = jqXHR.responseJSON;

        for(let key in result) {
            console.log(key + ":", result[key]);
        }
    }
});


$.get( "http://eatwellapi.somee.com/api/mealcategories/getall", function( data ) {
    
    let incomingData = data.data;
    var box="";
    for(let i=0; i < incomingData.length; i++){
        
        let category_image = incomingData[i].imagePath.replace("wwwroot","http://eatwellapi.somee.com");
        let category_name = incomingData[i].name;
        let menuCategoryId = incomingData[i].id;

        let element = `
        <div class='menu-content'>
            <a href='menu-category.html?id=${menuCategoryId}+${category_name}' class='menu-image'>
                <img src='${category_image}' alt='${category_name}'>
                <div class='img-overlay flex'>
                    <span class='name'>${category_name}</span>
                </div>
            </a>
        </div>`;
            
        box+=element;
        if(document.querySelector(".row") != null){
            document.querySelector(".row").innerHTML = box;
        } 
    }
    console.log( "Menüler Getirildi" );
});







       





