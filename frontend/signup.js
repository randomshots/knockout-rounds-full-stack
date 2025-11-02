const signupForm = document.querySelector("form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const atcoderId = document.querySelector("#atcoderId").value.trim();
  const codeforcesId = document.querySelector("#codeforcesId").value.trim();
  const password = document.querySelector("#password").value.trim();

  try {
    const res = await fetch(`${VITE_API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        email,
        atcoderId,
        codeforcesId,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful! Please log in now.");
      window.location.href = "signin.html";
    } else {
      alert(data.message || "Signup failed. Try again.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
