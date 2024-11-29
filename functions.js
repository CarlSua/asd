// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdNOR_Ef9X4z8besQSUEZLpMK7MUJnaQU",
  authDomain: "bantaybaha-a979c.firebaseapp.com",
  databaseURL:
    "https://bantaybaha-a979c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bantaybaha-a979c",
  storageBucket: "bantaybaha-a979c.firebasestorage.app",
  messagingSenderId: "372869446193",
  appId: "1:372869446193:web:10ab97ac79ea2f6dfb7310",
  measurementId: "G-G25990LRGL",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// Get form elements
let location = document.getElementById("sensorlocation");
let sensorlat = document.getElementById("sensorlatitude");
let sensorlong = document.getElementById("sensorlongitude");
let datecreated = document.getElementById("sensordate");
let sensorid = document.getElementById("sensorid");
let addbtn = document.getElementById("addbtn");

function AddData() {
  set(ref(db, "sensors/" + sensorid.value), {
    location: location.value,
    sensorlat: sensorlat.value,
    sensorlong: sensorlong.value,
    datacreated: datecreated.value,
    sensorid: Number(sensorid.value),
    status: "Working",
    reading: "",
  })
    .then(() => {
      alert("Sensor Added Successfully!");
    })
    .catch((error) => {
      alert("Unsuccessful: " + error.message);
      console.error(error);
    });
}

function RetData() {
  const dbRef = ref(db);

  get(child(dbRef, "sensors/" + sensorid.value))
    .then((snapshot) => {
      if (snapshot.exists()) {
        location.value = snapshot.val().location;
        sensorlat.value = snapshot.val().sensorlat;
        sensorlong.value = snapshot.val().sensorlong;
        datecreated.value = snapshot.val().datacreated;
      } else {
        alert("Sensor does not exist");
      }
    })
    .catch((error) => {
      alert("Error retrieving data: " + error.message);
      console.error(error);
    });
}

addbtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission if inside a form
  AddData();
});