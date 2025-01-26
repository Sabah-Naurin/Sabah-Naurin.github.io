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
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.style.color = color;
  }
}

// Monitor Authentication State and Update Sidebar
function monitorAuthState() {
  const login = document.getElementById('login');
  const signup = document.getElementById('signup');
  const userInfo = document.getElementById('user-info');
  const username = document.getElementById('username');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      if (login) login.style.display = 'none';
      if (signup) signup.style.display = 'none';
      if (userInfo) userInfo.style.display = 'block';
      if (username) username.innerHTML = `<i class="fa fa-user-circle"></i> ${user.displayName || user.email}`;
    } else {
      // User is not logged in
      if (login) login.style.display = 'block';
      if (signup) signup.style.display = 'block';
      if (userInfo) userInfo.style.display = 'none';
    }
  });
}

// Handle Sign Up
async function handleSignUp(email, password) {
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
async function handleLogin(email, password) {
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

// Handle Logout
async function handleLogout() {
  try {
    await signOut(auth);
    showMessage("Logged out successfully!", "green");
    window.location.href = "index.html"; // Redirect to the main page
  } catch (error) {
    showMessage(`Error: ${error.message}`);
  }
}

// Attach Event Listeners for Login
if (document.getElementById("login-form")) {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      await handleLogin(email, password);
    } catch (error) {
      console.error("Login Error:", error);
    }
  });
}
// Attach Event Listeners for Signup
if (document.getElementById("signup-form")) {
  document.getElementById("signup-form").addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent the form from reloading the page

      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      try {
          await handleSignUp(email, password);
      } catch (error) {
          console.error("Signup Error:", error);
      }
  });
}

// Export functions
export { monitorAuthState, handleSignUp, handleLogin, handleLogout };
