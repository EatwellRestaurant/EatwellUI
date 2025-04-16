document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const togglePassword = document.querySelectorAll('.toggle-password');
    
    // Şifre görünürlüğünü değiştirme
    togglePassword.forEach(icon => {
        icon.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Form gönderimi
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // API'ye login isteği gönder
        fetch('http://eatwellrestaurantapi.somee.com/api/auths/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Giriş başarısız');
            }
            return response.json();
        })
        .then(data => {
            // Token'ı localStorage'a kaydet
            localStorage.setItem('token', data.data.token);
            
            // Token'ı decode et ve yetki bilgisini kontrol et
            const tokenPayload = JSON.parse(atob(data.data.token.split('.')[1]));
            
            // Role bilgisini al
            const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            
            // Eğer kullanıcının yetkisi admin ise
            if (userRole === 'Admin') {
                if (rememberMe) {
                    localStorage.setItem('adminRemembered', 'true');
                }
                window.location.href = 'adminpanel.html';
            } else {
                // Admin yetkisi yoksa
                localStorage.removeItem('token');
                alert('Bu sayfaya erişim yetkiniz bulunmamaktadır!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Kullanıcı adı veya şifre hatalı!');
        });
    });

    // Eğer daha önce "Beni hatırla" seçilmişse
    if (localStorage.getItem('adminRemembered') === 'true') {
        document.getElementById('rememberMe').checked = true;
    }
}); 