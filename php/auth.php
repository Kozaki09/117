<!-- Handles loginUser() and logoutUser() functions -->
<?php
require_once 'session.php';

$conn = require_once 'db.php';  // Connect to database
$form_type = $_POST['action'];  // Check whether this is login, create, or logout

// --- LOGIN PROCESS ---
if ($form_type === 'login') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Fetch user by username
    $loginSql = "SELECT * FROM users WHERE user = ?";
    $stmt = $conn->prepare($loginSql);
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            loginUser($user);   // Set session & cookie

            header("Location: ../index.html"); // Redirect to main page
            exit();
        }
    }

    // If login fails
    header("Location: ../login.html?status=login_failed");
    exit();
} elseif ($form_type === 'create') {    // --- ACCOUNT CREATION PROCESS ---
    $username = $_POST['username'];
    $password = $_POST['password'];
    // Check if username already exists
    $checkSql = "SELECT * FROM users WHERE user = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {     // Redirect if username is taken
        header("Location: ../login.html?status=?username_exists");
    } else {       // Insert new user with hashed password
        $createSql = "INSERT INTO users (user, password) VALUES (?, ?)";
        $stmt = $conn->prepare($createSql);
        $stmt->bind_param("ss", $username, password_hash($password, PASSWORD_DEFAULT));
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $newUserId = $conn->insert_id;      // Fetch the newly created user
            $userSql = "SELECT * FROM users WHERE id = ?";
            $stmt = $conn->prepare($userSql);
            $stmt->bind_param("i", $newUserId);
            $stmt->execute();
            $newUser = $stmt->get_result()->fetch_assoc();

            loginUser($newUser);  // Auto-login after signup
            header("Location: ../login.html");
            exit();
        } else {
            header("Location: ../login.html?status=create_failed");
        }
    }
} elseif ($form_type === 'logout') {       // --- LOGOUT PROCESS ---
    logoutUser();
    header("Location: ../login.html");      // Clears session & cookie
    exit();
}
?>
