// Send a POST request to check if the user is logged in
fetch('api/get_session.php', {
    method: 'POST',
    credentials: 'include'  // Include cookies/session
})
.then(response => response.json())
.then(data => {
    const isLoginPage = window.location.pathname.endsWith('login.html');

    // If not logged in and not already on login page, redirect to login
    if (!data.loggedIn) {
        if (!isLoginPage) {
            window.location.href = 'login.html';
            return;
        }
    }   // If not logged in and not already on login page, redirect to login
    if (data.loggedIn && isLoginPage) {
        window.location.href = 'index.html';
    }
        // For debugging: log session status and current page
        console.log(data, isLoginPage);
})
.catch(error => {
    // On fetch failure, redirect to login (unless already there)
    console.error('Session check failed:', error);
    const isLoginPage = window.location.pathname.endsWith('login.html');
    if (!isLoginPage) {
        window.location.href = 'login.html';
    }
});