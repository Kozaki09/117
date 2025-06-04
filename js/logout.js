// Logs the user out by calling the backend logout endpoint
function logout() {
    fetch('php/logout.php', {
        method: 'POST',
        credentials: 'include'  // Send session cookies
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to login page on successful logout
            window.location.href= 'login.html';
        } else {
            // Log error message if logout fails
            console.error('Logout failed:', data.message);
        }
    })
    .catch(error => {
        // Handle network or server errors
        console.error('Logout request error:', error);
    });
}

// Expose logout function globally for button use, etc.
window.logout = logout;