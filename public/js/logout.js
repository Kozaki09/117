async function logout() {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // Redirect to login page after successful logout
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
    }
}

window.logout = logout;