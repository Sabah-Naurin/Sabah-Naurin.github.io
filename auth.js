import { auth } from './firebase.js'; // Import Firebase Auth service

// Utility function to display messages
function showMessage(message, color = "red") {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.style.color = color;
}

// Handle Login
async function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    showMessage(`Login successful! Welcome back, ${userCredential.user.email}`, "green");

    // Redirect to main page or dashboard
    setTimeout(() => {
      window.location.href = "index.html"; // Change to your dashboard page if needed
    }, 2000);
  } catch (error) {
    showMessage(`Error: ${error.message}`);
  }
}

// Handle Sign Up
async function handleSignUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    showMessage(`Registration successful! Welcome, ${userCredential.user.email}`, "green");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    showMessage(`Error: ${error.message}`);
  }
}

// Attach Event Listeners
if (document.getElementById("login-btn")) {
  document.getElementById("login-btn").addEventListener("click", handleLogin);
}

if (document.getElementById("signup-btn")) {
  document.getElementById("signup-btn").addEventListener("click", handleSignUp);
}
