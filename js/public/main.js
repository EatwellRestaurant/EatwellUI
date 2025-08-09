$.ajax({
    url: "https://eatwellapi.somee.com/api/branchs/getall",
    dataType: "json",
    error:  function (jqXHR, textStatus, errorThrown) {
        console.log(`Veri alınırken bir hata oluştu: ${textStatus} ${errorThrown}`);

        let result = jqXHR.responseJSON;

        for(let key in result) {
            console.log(key + ":", result[key]);
        }
    }
});

$.get( "https://eatwellapi.somee.com/api/branchs/getall", function( data) {
    
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

	var navbar = $('.site_navbar');

    function handleSticky() {
        navbar.toggleClass('scrolled', $(window).scrollTop() > 0);
    }

    $(window).on('scroll', handleSticky);

    handleSticky(); 


    $('.navbar-toggler').on('click', function() {
        var navbar = $('.navbar-body');
        var siteNavbar = $('.site_navbar .container');
    
        if (!navbar.hasClass('menu-open')) {
            navbar.addClass('menu-open');

            // Eğer daha önce eklenmemişse ekliyoruz
            if (siteNavbar.find('.navbar-backdrop').length === 0) {
                siteNavbar.append('<div class="navbar-backdrop show"></div>');
            }
        }
    });


    $('.nav-link').on('click', function() {
        var navbar = $('.navbar-body');
        var siteNavbar = $('.site_navbar .container');
    
        if (navbar.hasClass('menu-open')) {
            navbar.removeClass('menu-open');

            // Eğer daha önce eklenmemişse ekliyoruz
            if (siteNavbar.find('.navbar-backdrop').length === 0) {
                siteNavbar.append('<div class="navbar-backdrop show"></div>');
            }else{
                siteNavbar.find('.navbar-backdrop').remove();
            }
        }
    });


    function checkScreenSize() {

        // Sayfa yüklendiğinde ve ekran boyutu 992px ve üzerindeyse sidenav'ı aç
        if ($(window).width() >= 992) {
            
            var navbar = $('.navbar-body');
            var siteNavbar = $('.site_navbar .container');
                
            if (navbar.hasClass('menu-open')) {
                navbar.removeClass('menu-open');
                siteNavbar.find('.navbar-backdrop').remove();
            }
        }
    }


    // Sayfa yüklendiğinde çalıştır
    checkScreenSize();
    

    // Ekran boyutu değiştiğinde tekrar kontrol et
    $(window).resize(function() {
        checkScreenSize();
    });
    
});


$(document).on('click', '.navbar-backdrop', function() { 
    var navbar = $('.navbar-body');
    var siteNavbar = $('.site_navbar .container');

    if (navbar.hasClass('menu-open')) {
        navbar.removeClass('menu-open');
        siteNavbar.find('.navbar-backdrop').remove();
    }
});



//scroll-up
let calcScrollValue = () =>{
    let scrollProgress = document.getElementById("progress");

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

