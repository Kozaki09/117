<?php
session_start();
header('Content-Type: application/json');

define('AUTH_COOKIE_NAME', 'auth_token');

function loginUser($user) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user'] = $user['user'];

    $token = bin2hex(random_bytes(32));
    $_SESSION['auth_token'] = $token;

    setcookie(AUTH_COOKIE_NAME, $token, [
        'expires' => time() + 3600, 
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']) 
    ]);
}

function checkLogin() {
    if (!isset($_SESSION['user_id'], $_SESSION['auth_token'])) {
        return false;
    }

    if (!isset($_COOKIE[AUTH_COOKIE_NAME])) {
        return false;
    }

    return hash_equals($_SESSION['auth_token'], $_COOKIE[AUTH_COOKIE_NAME]);
}

function logoutUser() {
    session_unset();
    session_destroy();

    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }

    if (isset($_COOKIE[AUTH_COOKIE_NAME])) {
        setcookie(AUTH_COOKIE_NAME, '', time() - 3600, '/');
    }

    echo json_encode(['success' => true]);
    exit;
}
?>
