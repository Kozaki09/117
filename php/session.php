<?php
session_start();    // Start the session
header('Content-Type: application/json');

define('AUTH_COOKIE_NAME', 'auth_token');

// Logs in the user and sets session + auth token cookie
function loginUser($user) {
    $_SESSION['user_id'] = $user['id']; // Store user ID in session
    $_SESSION['user'] = $user['user'];  // Store username in session

    $token = bin2hex(random_bytes(32));
    $_SESSION['auth_token'] = $token;

    // Set token as a secure HTTP-only cookie
    setcookie(AUTH_COOKIE_NAME, $token, [
        'expires' => time() + 3600,     // 1 hour expiration
        'path' => '/',
        'httponly' => true,                      // Not accessible via JavaScript
        'samesite' => 'Lax',                    // Restrict cross-site requests
        'secure' => !empty($_SERVER['HTTPS'])   // Restrict cross-site requests
    ]);
}

// Checks if the current session and token cookie are valid
function checkLogin() {
    if (!isset($_SESSION['user_id'], $_SESSION['auth_token'])) {
        return false;   // Missing session data
    }

    if (!isset($_COOKIE[AUTH_COOKIE_NAME])) {
        return false;      // Missing cookie
    }

    // Ensure session token and cookie token match
    return hash_equals($_SESSION['auth_token'], $_COOKIE[AUTH_COOKIE_NAME]);
}

// Logs out the user and clears session + cookies
function logoutUser() {
    session_unset();    // Clear session variables
    session_destroy();  // Destroy the session

    // Clear PHP session cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }

    // Clear auth token cookie
    if (isset($_COOKIE[AUTH_COOKIE_NAME])) {
        setcookie(AUTH_COOKIE_NAME, '', time() - 3600, '/');
    }

    echo json_encode(['success' => true]);  // Respond with success
    exit;
}
?>
