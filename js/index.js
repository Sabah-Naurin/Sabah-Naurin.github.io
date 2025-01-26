import { monitorAuthState, handleLogout } from './auth.js';

// Initialize Sidebar Functionality
window.onload = function () {
  const login = document.getElementById('login');
  const signup = document.getElementById('signup');
  const logout = document.getElementById('logout');

  // Monitor authentication state and update sidebar
  monitorAuthState();

  // Add event listeners for login, signup, and logout
  if (login) {
    login.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = "login.html"; // Redirect to login page
    });
  }

  if (signup) {
    signup.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = "signup.html"; // Redirect to signup page
    });
  }

  if (logout) {
    logout.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout(); // Call the logout function from auth.js
    });
  }
};