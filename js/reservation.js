//datetime min-max
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

let element = document.getElementById("datePicker");
element.min = new Date().toISOString().split("T")[0];
element.max = new Date().addDays(30).toISOString().split("T")[0];



// Selection of form elements
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const phoneNumber = document.getElementById("phone");
const branchName = document.getElementById("branch");
const datePicker = document.getElementById("datePicker");
const timePicker = document.getElementById("timePicker");
const guestNumber = document.getElementById("guest");
const messageArea = document.getElementById("message");
const getReservation = document.getElementById("reservation-form");
const warnName = document.getElementById("warn-name");
const warnPhone = document.getElementById("warn-phone");


function hideWarn(idName) {
    idName.style.display = "none";
};


// input value check
phoneNumber.addEventListener('input', function () {

    // Delete and show warning if input value contains non-numeric character

    if (/[^0-9 ]/g.test(phoneNumber.value)) {
        warnPhone.classList.add("warn");
        warnPhone.textContent = "Lütfen yalnızca sayısal karakter kullanın.";
        phoneNumber.value = phoneNumber.value.replace(/[^0-9 ]/g, '');
        warnPhone.style.display = "inline";
        setTimeout(function() {
            hideWarn(warnPhone);
        }, 3000);
    }
    else {
        // Format the phone number as it is being typed
        let formattedNumber = phoneNumber.value.replace(/[^0-9]/g, '');
        if (formattedNumber.length >= 4) {
            formattedNumber = formattedNumber.slice(0, 4) + ' ' + formattedNumber.slice(4);
        }
        if (formattedNumber.length >= 8) {
            formattedNumber = formattedNumber.slice(0, 8) + ' ' + formattedNumber.slice(8);
        }
        if (formattedNumber.length >= 11) {
            formattedNumber = formattedNumber.slice(0, 11) + ' ' + formattedNumber.slice(11);
        }
        phoneNumber.value = formattedNumber;
    }
});



phoneNumber.addEventListener('keydown', function (event) {
    
    if (event.keyCode === 8) {
        let formattedNumber = phoneNumber.value;

        event.preventDefault();
        let currentValue = phoneNumber.value;
        let modifiedValue = currentValue.slice(0, -1);
        phoneNumber.value = modifiedValue;
    }
});



fullName.addEventListener('input', function () {

    if (/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g.test(fullName.value)) {

        warnName.classList.add("warn");
        warnName.textContent = "Lütfen yalnızca alfabetik karakterler kullanın.";
        fullName.value = fullName.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, '');
        warnName.style.display = "inline";
        setTimeout(function() {
            hideWarn(warnName);
        }, 3000);
    }
})



// Sending data to API with reservation button
getReservation.addEventListener("submit", (e) => {

    // Splitting the full name information from the user into two as first and last name
    const nameArray = fullName.value.split(" ");
    let firstName = "";
    let lastName = "";
    for (let i=0; i < nameArray.length; i++) {
        if(nameArray.length == 1){
            firstName += nameArray[i]
        }
        else{
            if(i == nameArray.length - 1) {
                lastName = nameArray[i];
            }
            else {
                firstName += nameArray[i] + " ";
            }
        }
    };

    // The guests and branch format are adjusted to the back-end
    let branchNumber = Number(branchName.value);
    let guestsNumber = Number(guestNumber.value);
    e.preventDefault()

    if(!phoneNumber.value.startsWith("0")){  
        phoneNumber.value = "0" + phoneNumber.value;
    }

    // phoneNumber.value = phoneNumber.value.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');

    // user information is converted to json format and sent to api
    
    $(document).ready(function () {
        let reservation = {
            "firstName": `${firstName}`,
            "lastName": `${lastName}`,
            "email": `${email.value}`,
            "phone": `${phoneNumber.value}`,
            "branchId": `${branchNumber}`,
            "reservationDate": `${datePicker.value}`,
            "reservationTime": `${timePicker.value}`,
            "personCount": `${guestsNumber}`,
            "note": `${messageArea.value}`
        };

        var model = JSON.stringify(reservation);
        
        $.ajax({
            url: "http://eatwellapi.somee.com/api/reservations/add",
            contentType: "application/json",
            type: "post",
            dataType: "json",
            data: model,
            success: response => {
                console.log(`Başarıyla tamamlandı!`);

                for(let key in response) {
                    console.log(key + ":", response[key]);
                }

                Swal.fire({
                    title: 'Rezervasyon Başarılı!',
                    text: 'Sizi ağırlamaktan mutluluk duyarız!',
                    icon: 'success',
                    confirmButtonText: 'Tamam',
                    customClass: {
                        title: 'swal-title-class',
                        confirmButton: 'swal-button-class'
                    }
                });
            },
            error:  function (jqXHR, textStatus, errorThrown) {
                console.log(`Veri gönderilirken bir hata meydana geldi: ${textStatus} ${errorThrown}`);
                
                let result = jqXHR.responseJSON;
                let resultMessage;

                for(let key in result) {
                    console.log(key + ":", result[key]);
                    if(key == "message"){
                        resultMessage = result[key];
                    }
                }

                Swal.fire({
                    title: 'Rezervasyon Oluşturulamadı!',
                    text: resultMessage + ".",
                    icon: 'error',
                    confirmButtonText: 'Tamam',
                    customClass: {
                        title: 'swal-title-class',
                        confirmButton: 'swal-button-class'
                    }
                });
            }
        });

    });

});




    