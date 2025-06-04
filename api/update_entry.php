<?php
header('Content-Type: application/json');
session_start();

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
$type = $input['type'];
$desc = $input['desc'];
$amount = $input['amount'];

if (!$entry_id || !$type || !$desc || !is_numeric($amount)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid data']);
    exit;
}

$sql = "UPDATE spendings SET type = ?, description = ?, amount = ? WHERE ID = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdii", $type, $desc, $amount, $entry_id, $user_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(200);
        echo json_encode(['success' => false, 'message' => 'No changes were made.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>