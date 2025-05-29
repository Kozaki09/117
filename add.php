<?php
$conn = require_once 'php/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

$amount = $_POST['amount'];
$date = $_POST['date'];
$type = $_POST['type'];
$desc = $_POST['desc'];

$sql = "INSERT INTO spendings (user_id, date, type, description, amount) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isssd", $user_id, $date, $type, $desc, $amount);
$stmt->execute();


if ($stmt->affected_rows > 0) {
    $result = true;
} else {
    $result = false;
}

$stmt->close();
$conn->close();

return $result; 
?>