const signinForm = document.querySelector("form");

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  try {
    const res = await fetch(`${VITE_API_BASE_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save token to localStorage for later use
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

      alert("Login successful!");
      window.location.href = "landing.html";
    } else {
      alert(data.message || "Invalid credentials. Try again.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
