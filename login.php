<?php
if (isset($_SESSION['email']) || isset($_COOKIE['user_session'])) {
    header("Location: index.php");
    exit();
}

$status_message = isset($_GET['status']) ? $_GET['status'] : '';
?>

<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
<div class="container">
    <div id="login-form">
        <h2>Login</h2>
        <form action="auth.php" method="POST">
            <input type="hidden" name="action" value="login">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <?php 
            if ($status_message == 'login_failed') {
                echo "<h3 class='action_status' id='login_fail'>Invalid Credentials</h3>";    
            } elseif ($status_message == 'create_success') {
                echo "<h3 class='action_statis' id='create_success'>Account Created. Please Login</h3>";
            }
            ?>
            <button type="submit">Login</button>
        </form>
        <div class="toggle-link">
            <p>Don't have an account? <a href="#" onclick="toggleForm()">Create one</a></p>
        </div>
    </div>

    <div id="create-form" class="hidden">
        <h2>Create Account</h2>
        <form action="auth.php" method="POST">
            <input type="hidden" name="action" value="create">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required><?php 
            if ($status_message == 'create_failed') {
                echo "<h3 class='action_status' id='create_fail'>Email already in use</h3>";
            }
            ?>
            <button type="submit">Create Account</button>
        </form>
        <div class="toggle-link">
            <p>Already have an account? <a href="#" onclick="toggleForm()">Login</a></p>
        </div>
    </div>
</div>

<script>
    function toggleForm() {
        const loginForm = document.getElementById('login-form');
        const createForm = document.getElementById('create-form');

        if (loginForm.classList.contains('hidden')) {
            loginForm.classList.remove('hidden');
            createForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            createForm.classList.remove('hidden');
        }
    }
</script>


</body>
</html>