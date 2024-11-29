import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBdNOR_Ef9X4z8besQSUEZLpMK7MUJnaQU",
    authDomain: "bantaybaha-a979c.firebaseapp.com",
    databaseURL: "https://bantaybaha-a979c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bantaybaha-a979c",
    storageBucket: "bantaybaha-a979c.appspot.com",
    messagingSenderId: "372869446193",
    appId: "1:372869446193:web:4549b25494583672fb7310",
    measurementId: "G-MVHG9XR3MG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Display error popup function
function showErrorPopup(message) {
    // Create the popup element
    const popup = document.createElement("div");
    popup.className = "error-popup";
    popup.textContent = message;
    document.body.appendChild(popup);

    // Show the popup for a few seconds and then remove it
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Login event listener
const submit = document.getElementById('loginSubmit');
submit.addEventListener("click", function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check if both username and password fields are empty
    if (!email && !password) {
        showErrorPopup("Please enter your email and password.");
    } else if (!email) {
        showErrorPopup("Please enter your email.");
    } else if (!password) {
        showErrorPopup("Please enter your password.");
    } else {
        // If both fields are filled, verify with Firebase
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Redirect to home page upon successful login
                window.location.href = "homepage.html";
            })
            .catch((error) => {
                // Show error popup on failed login
                showErrorPopup("Incorrect email or password. Please try again.");
            });
        }
    });
