import { auth } from './firebase.js'; // Import Firebase Auth service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Utility function to display messages
function showMessage(message, color = "red") {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.style.color = color;
}

// Handle Sign Up
async function handleSignUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    showMessage(`Registration successful! Welcome, ${userCredential.user.email}`, "green");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    showMessage(`Error: ${error.message}`);
  }
}

// Handle Login
async function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showMessage(`Login successful! Welcome back, ${userCredential.user.email}`, "green");

    // Redirect to the main page or dashboard
    setTimeout(() => {
      window.location.href = "index.html"; // Change this to your dashboard page if needed
    }, 2000);
  } catch (error) {
    showMessage(`Error: ${error.message}`);
  }
}

// Attach Event Listeners
if (document.getElementById("signup-btn")) {
  document.getElementById("signup-btn").addEventListener("click", handleSignUp);
}

if (document.getElementById("login-btn")) {
  document.getElementById("login-btn").addEventListener("click", handleLogin);
}

// Monitor Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`User logged in: ${user.email}`);
  } else {
    console.log("No user logged in.");
  }
});