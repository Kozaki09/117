<?php
require_once 'session.php';

$conn = require_once 'db.php';
$form_type = $_POST['action'];

if ($form_type === 'login') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $loginSql = "SELECT * FROM users WHERE user = ?";
    $stmt = $conn->prepare($loginSql);
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            loginUser($user);

            header("Location: ../index.html");
            exit();
        }
    }

    header("Location: ../login.html?status=login_failed");
    exit();
} elseif ($form_type === 'create') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $checkSql = "SELECT * FROM users WHERE user = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        header("Location: ../login.html?status=?username_exists");
    } else {
        $createSql = "INSERT INTO users (user, password) VALUES (?, ?)";
        $stmt = $conn->prepare($createSql);
        $stmt->bind_param("ss", $username, password_hash($password, PASSWORD_DEFAULT));
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $newUserId = $conn->insert_id;
            $userSql = "SELECT * FROM users WHERE id = ?";
            $stmt = $conn->prepare($userSql);
            $stmt->bind_param("i", $newUserId);
            $stmt->execute();
            $newUser = $stmt->get_result()->fetch_assoc();

            loginUser($newUser);  
            header("Location: ../login.html");
            exit();
        } else {
            header("Location: ../login.html?status=create_failed");
        }
    }
} elseif ($form_type === 'logout') {
    logoutUser();
    header("Location: ../login.html");
    exit();
}
?>
