// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
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

var map = L.map('map').setView([11.049660, 124.007310], 14);
var tileUrl = 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=5ac93f341e474e76bec352bd73074fd1';
var layer = new L.TileLayer(tileUrl, { maxZoom: 18, minZoom: 3 });
map.addLayer(layer);


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
    datecreated: datecreated.value,
    sensorid: Number(sensorid.value),
    status: "Working",
    reading: "",
  })
    .then(() => {
      alert("Sensor Added Successfully!");
      retrieveSensors();
    })
    .catch((error) => {
      alert("Unsuccessful: " + error.message);
      console.error(error);
    });
}

addbtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission if inside a form
  AddData();
});

// Function to retrieve all sensor data from the database
function retrieveSensors() {
  const sensorsRef = ref(db, "sensors");
  get(sensorsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const sensors = snapshot.val();
        Object.keys(sensors).forEach((key) => {
          const sensor = sensors[key];
          const lat = parseFloat(sensor.sensorlat);
          const long = parseFloat(sensor.sensorlong);
          const location = sensor.location;
          const reading = sensor.reading; 

          // Create marker for each sensor
          createCustomMarker(lat, long, location, reading);
        });
      } else {
        console.log("No data available.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving sensor data: ", error);
    });
}

// Function to create a custom marker and add it to the map
function createCustomMarker(lat, long, location, reading) {
  // Create a circle marker with specific styling options
  const marker = L.circleMarker([lat, long], {
    color: 'blue',        // Border color of the circle
    fillColor: 'blue',    // Fill color of the circle
    fillOpacity: 1,     // Opacity of the fill
    radius: 10,            // Radius of the circle
    weight: 2             // Border weight of the circle
  }).addTo(map);

  // Create a styled popup directly without an extra div container
  marker.bindPopup(`
    <div style="
      color: black;
      text-align: left;
    ">
    Location:${location}
    Reading: ${reading ? reading : "No reading available"}
    </div>
  `);
}


document.addEventListener("DOMContentLoaded", () => {
  retrieveSensors();
});












// function RetData() {
//   const dbRef = ref(db);

//   get(child(dbRef, "sensors/" + sensorid.value))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         location.value = snapshot.val().location;
//         sensorlat.value = snapshot.val().sensorlat;
//         sensorlong.value = snapshot.val().sensorlong;
//         datecreated.value = snapshot.val().datacreated;
//       } else {
//         alert("Sensor does not exist");
//       }
//     })
//     .catch((error) => {
//       alert("Error retrieving data: " + error.message);
//       console.error(error);
//     });
// }

