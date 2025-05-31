<?php
session_start();
header('Content-Type: application/json');

define('AUTH_COOKIE_NAME', 'auth_token');

function checkLogin() {
    if (!isset($_SESSION['user_id'], $_SESSION['auth_token'])) {
        return false;
    }

    if (!isset($_COOKIE[AUTH_COOKIE_NAME])) {
        return false;
    }

    return hash_equals($_SESSION['auth_token'], $_COOKIE[AUTH_COOKIE_NAME]);
}

$response = ['loggedIn' => false];

if (checkLogin()) {
    $response['loggedIn'] = true;
    $response['user_id'] = $_SESSION['user_id'];
    $response['user'] = $_SESSION['user'] ?? null;
}

echo json_encode($response);
exit;
?>