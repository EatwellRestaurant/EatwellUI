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
const fullName = document.getElementById("name-surname");
const email = document.getElementById("email");
const phoneNumber = document.getElementById("phone");
const branchName = document.getElementById("branch");
const datePicker = document.getElementById("datePicker");
const timePicker = document.getElementById("timePicker");
const guestNumber = document.getElementById("guest");
const messageArea = document.getElementById("message");
const getReservation = document.getElementById("reservation-btn");
const warn = document.getElementById("warn");


function hideWarn() {
    warn.style.display = "none";
};

// input value check
phoneNumber.addEventListener('input', function () {

    // Delete and show warning if input value contains non-numeric character

    if (/[^0-9 ]/g.test(phoneNumber.value)) {
        warn.classList.add("warn");
        warn.textContent = "Lütfen yalnızca sayısal karakter kullanın.";
        phoneNumber.value = phoneNumber.value.replace(/[^0-9 ]/g, '');
        setTimeout(hideWarn, 5000);
        warn.style.display = "inline";
    }
});





// Sending data to API with reservation button
getReservation.addEventListener("click", (e) => {

    // Splitting the full name information from the user into two as first and last name
    const nameArray = fullName.value.split(" ");
    let firstName = "";
    let lastName = "";
    for (let i=0; i < nameArray.length; i++) {
        if(i == nameArray.length - 1) {
            lastName = nameArray[i];
        }
        else {
        firstName += nameArray[i] + " ";
        }
    };

    // The guests and branch format are adjusted to the back-end
    let branchNumber = Number(branchName.value);
    let guestsNumber = Number(guestNumber.value);
    e.preventDefault()

    if(!phoneNumber.value.startsWith("0")){  
        phoneNumber.value = "0" + phoneNumber.value;
    }

    phoneNumber.value = phoneNumber.value.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');

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
            url: "https://localhost:7189/api/reservations/add",
            contentType: "application/json",
            type: "post",
            dataType: "json",
            data: model,
            success: response => {
                console.log(`Başarıyla tamamlandı!`);

                for(let key in response) {
                    console.log(key + ":", response[key]);
                }
            },
            error:  function (jqXHR, textStatus, errorThrown) {
                console.log(`Veri gönderilirken bir hata meydana geldi: ${textStatus} ${errorThrown}`);
                
                let result = jqXHR.responseJSON;

                for(let key in result) {
                    console.log(key + ":", result[key]);
                }
                
            }
        });

    });

});




    