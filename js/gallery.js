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
    for(let i=0; i < incomingData.length; i++){
        
        let branch_image = incomingData[i].imagePath.replace("wwwroot","http://eatwellapi.somee.com");

        let branch_title = incomingData[i].title;
        let branch_description = incomingData[i].description;

        let element = `
        <div class='picture'>
            <div class='image-box'>
              <img src='${branch_image}' alt='${branch_title}'>

              <div class='transparent-box'>
                <div class='floor'>
                  <div class='description-title'>${branch_title}</div>
                  <div class='description-text'>${branch_description}</div>
                </div>
              </div>
            </div>
          </div>`;
            
        box+=element;
    }
    document.querySelector(".images").innerHTML = box;
    console.log( "Şube Resimleri Getirildi" );
});







       


