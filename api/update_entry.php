<?php
header('Content-Type: application/json');
session_start();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$conn = require '../php/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$entry_id = $input['id'];
$date = $input['date'];
$type = $input['type'];
$desc = $input['desc'];
$amount = $input['amount'];

if (!$entry_id || !$date || !$type || !$desc || !is_numeric($amount)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid data']);
    exit;
}

$sql = "UPDATE spendings SET date = ?, type = ?, description = ?, amount = ? WHERE ID = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}
?>