<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$conn = require '../php/db.php';

$sql = "SELECT * FROM spendings WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database query failed']);
}

$result = $stmt->get_result();
$entries = [];

while ($row = $result->fetch_assoc()) {
    $entries[] = $row;
}

echo json_encode($entries);
?>