<!-- <?php
session_start();

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

$page = $_GET['page'] ?? 'home';

$allowedPages = [
    'home' => 'index.html',
    'login' => 'login.html',
];

$isLoggedIn = checkLogin();

if(!$isLoggedIn) {
    readfile($allowedPages['login']);
    exit;
}

if ($page === 'login'){
    readfile($allowedPages['home']);
    exit;
}

if (isset($allowedPages[$page])) {
    readfile($allowedPages[$page]);
} else {
    // fallback to home page if unknown
    readfile($allowedPages['home']);
}
?> -->
