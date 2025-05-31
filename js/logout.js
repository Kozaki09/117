function logout() {
    fetch('php/logout.php', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href= 'login.html';
        } else {
            console.error('Logout failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Logout request error:', error);
    });
}

window.logout = logout;