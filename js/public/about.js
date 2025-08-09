/*Şube Çalışanları (Şef)*/
$.ajax({
    url: "https://eatwellapi.somee.com/api/branchemployees/getall",
    dataType: "json",
    error:  function (jqXHR, textStatus, errorThrown) {
        console.log(`'Şube Çalışanları' alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);

        let result = jqXHR.responseJSON;

        for(let key in result) {
            console.log(key + ":", result[key]);
        }
    }
});


$.get( "https://eatwellapi.somee.com/api/branchemployees/getall", function( data ) {

    let incomingData = data.data;
    var box="";
    let boxLength = 0;

    for(let i=0; i < incomingData.length; i++){

        let branchEmployeeImage = incomingData[i].imagePath.replace("wwwroot","https://eatwellapi.somee.com/");
        let branchEmployeeFirstName = incomingData[i].firstName;
        let branchEmployeeLastName = incomingData[i].lastName;
        let branchEmployeeDescription = incomingData[i].description;
        let branchEmployeeDegree = incomingData[i].degree;
        
        if(branchEmployeeDegree == "chef" || branchEmployeeDegree == "Chef"){
            
            if(boxLength < 3){
                let element = `
                <div class="chef">
                    <img src="${branchEmployeeImage}" alt="${branchEmployeeFirstName} ${branchEmployeeLastName}">

                    <div class="chef-information">
                        <h2>Şef ${branchEmployeeFirstName} ${branchEmployeeLastName}</h2>
                        <p>${branchEmployeeDescription}</p>
                    </div>
                </div>`;
                
                box += element;
                boxLength++;
            }  
        }
    }
    document.querySelector(".chefs .box").innerHTML = box;
    console.log( "Şube Şefleri Getirildi");
});




/*Görüşler*/
$.ajax({
    url: "https://eatwellapi.somee.com/api/evaluations/getevaluationdetails",
    dataType: "json",
    error:  function (jqXHR, textStatus, errorThrown) {
        console.log(`'Görüşler' alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);

        let result = jqXHR.responseJSON;

        for(let key in result) {
            console.log(key + ":", result[key]);
        }
    }
});

$.get( "https://eatwellapi.somee.com/api/evaluations/getevaluationdetails", function( data ) {
    
    let incomingData = data.data;
    var box="";
    let boxLength = 0;

    for(let i=0; i < incomingData.length; i++){
        
        let evaluation = incomingData[i].message;
        let evaluationFirstName = incomingData[i].userFirstName;
        let evaluationLastName = incomingData[i].userLastName;


        if(boxLength < 3){
            let element = `
            <div class="testimonial">
                <div class="cloud">
                    <p>${evaluation}</p>

                    <div class="notch"></div>
                </div>

                <div class="person">
                    <img src="../icons/user.png" alt="">
                    <span>${evaluationFirstName} ${evaluationLastName}</span>
                </div>
            </div>`;

            box += element;
            boxLength++;
        } 
    }
    document.querySelector(".case").innerHTML = box;
});




