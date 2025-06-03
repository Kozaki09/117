<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user'])) {
        echo json_encode(['user' => $_SESSION['user']]);
    } else {
        echo json_encode(['user' => null]);
    }
}
