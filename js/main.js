$.ajax({
    url: "http://eatwellapi.somee.com/api/branchs/getall",
    dataType: "json",
    error:  function (jqXHR, textStatus, errorThrown) {
        console.log(`Veri alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);

        let result = jqXHR.responseJSON;

        for(let key in result) {
            console.log(key + ":", result[key]);
        }
    }
});

$.get( "http://eatwellapi.somee.com/api/branchs/getall", function( data) {
    
    let incomingData = data.data;

    for(let i=0; i < incomingData.length; i++){

        let branch = "";
        if(incomingData[i].id == 1){
            
            branch = incomingData[i];
            $('#footer-address').append(branch.address)
            $('#footer-email').append(branch.email)
            $('#footer-phone').append(branch.phone)
            $('.facebook').attr("href", branch.facebook);
            $('.instagram').attr("href", branch.instagram);
            $('.twitter').attr("href", branch.twitter);
            $('.google').attr("href", branch.gmail);
        }
    }

    console.log( "Veriler Getirildi");
});



// navbar - scroll
$(document).ready(function($) {

	"use strict";

    var scrollWindow = function() {
        $(window).scroll(function(){
            var $w = $(this),
                    st = $w.scrollTop(),
                    navbar = $('.site_navbar'),
                    sd = $('.js-scroll-wrap');

            if (st > 150) {
                if ( !navbar.hasClass('scrolled') ) {
                    navbar.addClass('scrolled');	
                }
            } 
            if (st < 150) {
                if ( navbar.hasClass('scrolled') ) {
                    navbar.removeClass('scrolled sleep');
                }
            } 
            if ( st > 350 ) {
                if ( !navbar.hasClass('awake') ) {
                    navbar.addClass('awake');	
                }
                
                if(sd.length > 0) {
                    sd.addClass('sleep');
                }
            }
            if ( st < 350 ) {
                if ( navbar.hasClass('awake') ) {
                    navbar.removeClass('awake');
                    navbar.addClass('sleep');
                }
                if(sd.length > 0) {
                    sd.removeClass('sleep');
                }
            }
        });
    };
    scrollWindow();

    
});



//scroll-up
let calcScrollValue = () =>{
    let scrollProgress = document.getElementById("progress");
    let progressValue = document.getElementById("progress-value");
    let pos = document.documentElement.scrollTop;
    let calcHeight = 
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);

    if(pos > 100){
        scrollProgress.style.display = "grid";
    }
    else{
        scrollProgress.style.display = "none";
    }

    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });

    scrollProgress.style.background = 
    `conic-gradient(#262323 ${scrollValue}%, #aaaaaa ${scrollValue}% )`;
}

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;


