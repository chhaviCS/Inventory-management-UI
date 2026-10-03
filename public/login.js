const loginForm = document.getElementById("loginForm");
const alertBox = document.getElementById("alertBox");
const submitBtn = document.getElementById("submitBtn");

function showAlert(message, type = "error") {
    alertBox.textContent = message;
    alertBox.className = `alert ${type === "success" ? "alert-success" : "alert-error"}`;
    alertBox.style.display = "block";
}

function clearAlert() {
    alertBox.textContent = "";
    alertBox.style.display = "none";
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlert();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showAlert("Please enter both email and password.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Store token and user information
            localStorage.setItem("token", data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            showAlert("Login successful! Redirecting to inventory...", "success");

            // Redirect to existing inventory page
            setTimeout(() => {
                window.location.href = "/products-page";
            }, 1000);
        } else {
            showAlert(data.message || "Invalid credentials. Please try again.");
        }
    } catch (err) {
        console.error("Network error:", err);
        showAlert("Network error. Unable to connect to server.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Log In";
    }
});
