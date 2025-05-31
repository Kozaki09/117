<?php
session_start();

define('AUTH_COOKIE_NAME', 'auth_token');

session_unset();
session_destroy();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

if (isset($_COOKIE[AUTH_COOKIE_NAME])) {
    setcookie(AUTH_COOKIE_NAME, '', time() - 3600, '/');
}

header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>