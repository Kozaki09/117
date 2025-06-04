<!-- Adds new entry to the database -->
<?php
header('Content-Type: application/json');
session_start();

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
    exit;
}

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$conn = require '../php/db.php';
$input = json_decode(file_get_contents('php://input'), true);

// Check if input is valid JSON
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

// Extract data from input
$date = $input['date'];
$type = $input['type'];
$desc = $input['desc'];
$amount = $input['amount'];

// Validate input fields
if (!$date || !$type || !$desc || !is_numeric($amount)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid data']);
    exit;
}

// Prepare SQL query to insert the spending entry and bind
$sql ="INSERT INTO spendings (user_id, date, type, description, amount) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {       // Check if preparation failed
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

// Bind parameters and execute the query
$stmt->bind_param("isssd", $user_id, $date, $type, $desc, $amount);


if ($stmt->execute()) {     // Check if the execution was successful
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'No rows inserted']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}
// Close the statement and connection
$stmt->close();
$conn->close();
?>
