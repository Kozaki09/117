<!-- Delete entry to the database -->
<?php
header('Content-Type: application/json');
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$conn = require '../php/db.php';     // Connect to database
$user_id = $_SESSION['user_id'];
$entry_id = $input['id'];            // ID of the entry to delete

// Prepare SQL statement to delete the entry if it belongs to the user
$sql = "DELETE FROM spendings WHERE ID = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $entry_id, $user_id);

// Execute and respond
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete entry']);
}
?>