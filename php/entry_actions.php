<?php
ini_set('display_errors', 1);       // Show all PHP errors (helpful during development)
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
$conn = require 'db.php';       // Connect to the database

$input = json_decode(file_get_contents('php://input'), true);

// Handle invalid or missing JSON input
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Extract values from input, use fallback defaults
$date = $input['date'] ?? '';
$type = $input['type'] ?? '';
$desc = $input['desc'] ?? '';
$amount = $input['amount'] ?? '';

// Validate required fields
if (!$date || !$type || !is_numeric($amount)) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid data']);
    exit;
}

// Prepare SQL insert statement
$sql = "INSERT INTO spendings (date, type, description, amount) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssd", $date, $type, $desc, $amount);

// Execute the query and return JSON response
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
