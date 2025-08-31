
const baseUrl = 'https://eatwell-api.azurewebsites.net/api/';


// Toast container'ı oluştur
$('body').append('<div class="toast-container"></div>');

// Toast gösterme fonksiyonu
function showToast(type, title, message) {
    const icon = type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check';
    const toast = $(`
        <div class="toast ${type}">
            <i class="fa-solid ${icon}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        </div>
    `);

    $('.toast-container').append(toast);

    // 5 saniye sonra toast'ı kaldır
    setTimeout(() => {
        toast.addClass('hide');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}



function fetchAllBranchStatistics() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${baseUrl}headOffices`,
            type: 'GET',
            success: function(response) {
                const data = response.data;

                $('#footer-address').html(data.address);
                $('#footer-email').html(data.email);
                $('#footer-phone').html(data.phone);

                $('.weekday-hours').html(data.midWeekWorkingHours);
                $('.weekend-hours').html(data.weekendWorkingHours);
                $('.special-note').html(data.specialNote);

                $('.facebook').attr("href", data.facebook);
                $('.instagram').attr("href", data.instagram);
                $('.twitter').attr("href", data.twitter);
                $('.google').attr("href", data.gmail);

                resolve();
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.Message;
                showToast('error', 'Hata', errorMessage ? errorMessage : "Genel merkez bilgileri alınırken hata oluştu!");

                reject(errorMessage);
            }
        });
    });
}


async function runMethods() {
    await fetchAllBranchStatistics();
}

runMethods();



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

