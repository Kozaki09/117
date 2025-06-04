fetch('api/get_session.php', {
    method: 'POST',
    credentials: 'include'
})
.then(response => response.json())
.then(data => {
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!data.loggedIn) {
        if (!isLoginPage) {
            window.location.href = 'login.html';
            return;
        }
    }
    if (data.loggedIn && isLoginPage) {
        window.location.href = 'index.html';
    }
    
        console.log(data, isLoginPage);
})
.catch(error => {
    console.error('Session check failed:', error);
    const isLoginPage = window.location.pathname.endsWith('login.html');
    if (!isLoginPage) {
        window.location.href = 'login.html';
    }
});