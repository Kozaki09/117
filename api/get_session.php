
<?php
session_start();
header('Content-Type: application/json');

define('AUTH_COOKIE_NAME', 'auth_token');       // Name of the auth cookie

// Function to verify if the user is logged in and token matches
function checkLogin() {
    if (!isset($_SESSION['user_id'], $_SESSION['auth_token'])) {            // Check if session variables are set
        return false;
    }


    // Check if the auth token cookie exists
    if (!isset($_COOKIE[AUTH_COOKIE_NAME])) {
        return false;
    }

    // Compare session token with cookie token
    return hash_equals($_SESSION['auth_token'], $_COOKIE[AUTH_COOKIE_NAME]);
}

$response = ['loggedIn' => false];      // Default response

// If user is authenticated, include user info
if (checkLogin()) {
    $response['loggedIn'] = true;
    $response['user_id'] = $_SESSION['user_id'];
    $response['user'] = $_SESSION['user'] ?? null;
}

echo json_encode($response);
exit;
?>