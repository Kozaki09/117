<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
$conn = require 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$date = $input['date'] ?? '';
$type = $input['type'] ?? '';
$desc = $input['desc'] ?? '';
$amount = $input['amount'] ?? '';

if (!$date || !$type || !is_numeric($amount)) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid data']);
    exit;
}

$sql = "INSERT INTO spendings (date, type, description, amount) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssd", $date, $type, $desc, $amount);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
