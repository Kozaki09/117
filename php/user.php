<?php
session_start();    // Start the session

// Handle only GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user'])) {     // If the user is logged in, return their username
        echo json_encode(['user' => $_SESSION['user']]);
    } else {
        echo json_encode(['user' => null]); // If not logged in, return null
    }
}
