const registerForm = document.getElementById("registerForm");
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

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlert();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        showAlert("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        showAlert("Password must be at least 6 characters long.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showAlert("Registration successful! Redirecting to login...", "success");
            registerForm.reset();
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        } else {
            showAlert(data.message || "Registration failed. Please try again.");
        }
    } catch (err) {
        console.error("Network error:", err);
        showAlert("Network error. Unable to connect to server.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Register";
    }
});
