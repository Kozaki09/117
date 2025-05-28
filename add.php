<?php
$conn = require_once '../db.php';

$amount = $_POST['amount'];
$date = $_POST['date'];
$type = $_POST['type'];

$sql = "INSERT INTO spendings (amount, date, type) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $amount, $date, $type);
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