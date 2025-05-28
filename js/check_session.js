fetch('php/check_session.php', {
    method: 'POST',
    credentials: 'include'
})
.then(response => response.json())
.then(data => {
    if (!data.loggedIn) {
        const isLoginPage = window.location.pathname.endsWith('login.html');

        if (!isLoginPage) {
            window.location.href = 'login.html';
            return;
        }
    }
})
.catch(error => {
    console.error('Session check failed:', error);
    const isLoginPage = window.location.pathname.endsWith('login.html');
    if (!isLoginPage) {
        window.location.href = 'login.html';
    } else {
        document.body.style.display = 'block';
    }
});

