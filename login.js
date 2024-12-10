import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBdNOR_Ef9X4z8besQSUEZLpMK7MUJnaQU",
    authDomain: "bantaybaha-a979c.firebaseapp.com",
    databaseURL: "https://bantaybaha-a979c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bantaybaha-a979c",
    storageBucket: "bantaybaha-a979c.firebasestorage.app",
    messagingSenderId: "372869446193",
    appId: "1:372869446193:web:10ab97ac79ea2f6dfb7310",
    measurementId: "G-G25990LRGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

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

    // Check if both email and password fields are empty
    if (!email && !password) {
        showErrorPopup("Please enter your email and password.");
    } else if (!email) {
        showErrorPopup("Please enter your email.");
    } else if (!password) {
        showErrorPopup("Please enter your password.");
    } else {
        // Verify email and password with Firebase Realtime Database under the 'users' node
        const usersRef = ref(database, 'users');
        get(usersRef).then(snapshot => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                let userFound = false;

                // Loop through the users to find a matching email
                for (let userid in users) {
                    const user = users[userid];
                    // Check if the email and password match
                    if (user.username === email && user.password === password) {
                        userFound = true;
                        break;
                    }
                }

                if (userFound) {
                    const loginContainer = document.querySelector('.login-container');
                    loginContainer.classList.add('fade-out'); // Apply fade-out animation
                
                    // Redirect after the animation
                    setTimeout(() => {
                        window.location.href = "homepage.html";
                    }, 500); // Match CSS animation duration
                } else {
                    showErrorPopup("Incorrect email or password. Please try again.");
                }
            } else {
                showErrorPopup("No users found.");
            }
        }).catch((error) => {
            showErrorPopup("An error occurred while checking credentials. Please try again later.");
        });
    }
});