
(function ($) {
    "use strict";

    $(document).ready(function() {
        // Butona tıklandığında
        $('.login100-form-btn').click(function(e) {
          e.preventDefault();  // Sayfanın yenilenmesini engeller
          
          // Giriş bilgilerini topla (örneğin, username ve password)
          var username = $('#username').val();  
          var password = $('#password').val();  
    
          let userForLoginDto = {
            email: username,
            password: password
          }

          // AJAX isteği gönder
          $.ajax({
            url: 'https://localhost:7189/api/Auths/Login',  // Giriş yapmak için backend URL
            contentType: "application/json",
            type: "post",
            dataType: "json",
            data: JSON.stringify(userForLoginDto),
            success: function(response) {
              if (response.success === true) {
                // Yanıt true ise admin paneline yönlendir
                window.location.href = '../../html/adminpanel.html';  // Admin panelinin URL'sini buraya ekle
              } else {
                // Yanıt false ise hata mesajı göster
                alert(response.data);
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                document.querySelector('#errorModal .modal-body').textContent = jqXHR.responseJSON.Message || 'Bilinmeyen bir hata oluştu.';
                var myModal = new bootstrap.Modal(document.getElementById('errorModal'));
                myModal.show();
            }
          });
        });
      });


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).addClass('active');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).removeClass('active');
            showPass = 0;
        }
        
    });


})(jQuery);