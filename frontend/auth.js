// Form validation and handling
document.addEventListener("DOMContentLoaded", () => {
  // Handle Sign Up Form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignUp);
  }

  // Handle Sign In Form
  const signinForm = document.getElementById("signin-form");
  if (signinForm) {
    signinForm.addEventListener("submit", handleSignIn);
  }
});

// Sign Up Handler
function handleSignUp(e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const atcoderId = document.getElementById("atcoder-id").value.trim();
  const codeforceId = document.getElementById("codeforces-id").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validation
  if (!name || !email || !atcoderId || !codeforceId || !password) {
    showAuthMessage("Please fill in all fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showAuthMessage("Passwords do not match", "error");
    return;
  }

  if (password.length < 6) {
    showAuthMessage("Password must be at least 6 characters", "error");
    return;
  }

  // Create user object
  const user = {
    name,
    email,
    atcoderId,
    codeforceId,
    createdAt: new Date().toISOString(),
  };

  // Store in localStorage (temporary - will be replaced with backend)
  localStorage.setItem("tournament-user", JSON.stringify(user));

  showAuthMessage("Account created successfully! Redirecting...", "success");

  // Redirect to landing page after 2 seconds
  setTimeout(() => {
    window.location.href = "landing.html";
  }, 2000);
}

// Sign In Handler
function handleSignIn(e) {
  e.preventDefault();

  // Get form values
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Validation
  if (!email || !password) {
    showAuthMessage("Please fill in all fields", "error");
    return;
  }

  // Check if user exists in localStorage
  const savedUser = localStorage.getItem("tournament-user");

  if (savedUser) {
    const user = JSON.parse(savedUser);

    // Simple validation (will be replaced with proper authentication)
    if (user.email === email) {
      showAuthMessage("Sign in successful! Redirecting...", "success");

      // Redirect to landing page after 1 second
      setTimeout(() => {
        window.location.href = "landing.html";
      }, 1000);
    } else {
      showAuthMessage("Invalid email or password", "error");
    }
  } else {
    showAuthMessage("No account found. Please sign up first.", "error");
  }
}

// Show auth message
function showAuthMessage(message, type) {
  // Remove existing message if any
  const existingMessage = document.querySelector(".auth-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `auth-message ${type} show`;
  messageDiv.textContent = message;

  // Insert before form
  const form = document.querySelector(".auth-form");
  form.parentNode.insertBefore(messageDiv, form);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.classList.remove("show");
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
