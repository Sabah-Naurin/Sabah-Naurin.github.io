// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDckLliAb4jgAxkf-6q1blcWU6WzQTGdsE",
  authDomain: "loopdeoop.firebaseapp.com",
  projectId: "loopdeoop",
  storageBucket: "loopdeoop.appspot.com", // Corrected URL (ends with .appspot.com)
  messagingSenderId: "383196216983",
  appId: "1:383196216983:web:9f8f2adff0a2c3f12473d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Export Firebase services for use in other files
export { app, db, auth };