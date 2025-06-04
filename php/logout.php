<?php
session_start();

define('AUTH_COOKIE_NAME', 'auth_token');   // Define the auth token cookie name

session_unset();    // Clear all session variables
session_destroy();  // Destroy the session entirely

// Remove the PHP session cookie from the browser
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Remove the custom auth token cookie
if (isset($_COOKIE[AUTH_COOKIE_NAME])) {
    setcookie(AUTH_COOKIE_NAME, '', time() - 3600, '/');
}

// Return success response as JSON
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>