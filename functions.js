// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
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

var map = L.map('map').setView([11.046556122600492, 124.002498512228], 15);
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

// Function to listen for real-time data and update markers dynamically
function retrieveAndUpdateSensors() {
  const sensorsRef = ref(db, "sensors");
  let currentlyOpenPopupId = null;

  // Listen for real-time changes in the database
  onValue(sensorsRef, (snapshot) => {
    if (snapshot.exists()) {
      const sensors = snapshot.val();

      // Check if a popup is currently open and save its ID
      map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker && layer.getPopup() && layer.getPopup().isOpen()) {
          currentlyOpenPopupId = layer.getPopup()._source.options.sensorId;
        }
      });

      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
          map.removeLayer(layer);
        }
      });

      // Iterate through sensors and update markers
      Object.keys(sensors).forEach((key) => {
        const sensor = sensors[key];
        const lat = parseFloat(sensor.sensorlat);
        const long = parseFloat(sensor.sensorlong);
        const location = sensor.location;
        const reading = sensor.reading;
        const status = sensor.status;

        // Create marker for each sensor
        const marker = createCustomMarker(lat, long, location, reading, status, key);

        // Reopen the popup if it was previously open
        if (key === currentlyOpenPopupId) {
          marker.openPopup();
        }
      });
    } else {
      console.log("No data available.");
    }
  });
}

// Function to create a custom marker and add it to the map
function createCustomMarker(lat, long, location, reading, status, sensorId) {
  // Parse the reading as a number (assuming reading is stored as a string in the database)
  const parsedReading = parseFloat(reading);

  // Determine the marker color based on the reading
  let markerColor;
  if (parsedReading <= 0.7) {
    markerColor = 'red';
  } else if (parsedReading <= 1) {
    markerColor = 'orange';
  } else if (parsedReading <= 2) {
    markerColor = 'yellow';
  } else {
    markerColor = 'blue'; // Build-up color
  }

  const marker = L.circleMarker([lat, long], {
    color: 'black',        // Border color
    fillColor: markerColor, // Dynamic fill color based on reading
    fillOpacity: 1,
    radius: 8,
    weight: 2,
    sensorId: sensorId,    // Add the sensorId to marker options for reference
  }).addTo(map);

  // Create a styled popup with real-time data
  const popupContent = `
    <div style="color: black; text-align: left;">
      Location: ${location}<br>
      Reading: ${parsedReading ? parsedReading : "No reading available"}<br>
      Status: ${status}<br>
      <button id="delete-btn-${sensorId}" style="margin-top: 10px; color: black;">Delete Sensor</button>
      <button id="update-btn-${sensorId}" style="margin-top: 10px; color: black;">Update Sensor</button>
    </div>
  `;

  // Bind popup to the marker
  marker.bindPopup(popupContent);

  // Add event listeners for popup actions
  marker.on('popupopen', () => {
    const deleteButton = document.getElementById(`delete-btn-${sensorId}`);
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        deleteSensor(sensorId);
        location.reload();
      });
    }

    const updateButton = document.getElementById(`update-btn-${sensorId}`);
    if (updateButton) {
      updateButton.addEventListener('click', () => {
        openUpdateModal({ sensorId, location, lat, long, reading, status });
      });
    }
  });

  return marker;
}

// Function to delete a sensor from the database
function deleteSensor(sensorId) {
  const sensorRef = ref(db, `sensors/${sensorId}`);
  set(sensorRef, null)
    .then(() => {
      alert("Sensor deleted successfully!");
    })
    .catch((error) => {
      alert("Error deleting sensor: " + error.message);
      console.error(error);
    });
}

function openUpdateModal(sensorData) {
  // Destructure the sensor data
  const { sensorId, location, lat, long, status } = sensorData;

  // Get the modal and its fields
  const modal = document.getElementById('updateModal');
  const locationField = document.getElementById('update-location');
  const statusField = document.getElementById('update-status');
  const latitudeField = document.getElementById('update-sensorlatitude');
  const longitudeField = document.getElementById('update-sensorlongitude');

  // Populate the modal fields with current data
  locationField.value = location;
  statusField.value = status;
  latitudeField.value = lat;
  longitudeField.value = long;

  // Show the modal (adjust based on your modal library, e.g., Bootstrap)
  modal.style.display = 'block';

  // Add event listener for the save button in the modal
  const saveButton = document.getElementById('save-update-btn');
  saveButton.onclick = () => {
    
    const updatedLocation = locationField.value;
    const updatedStatus = statusField.value;
    const updatedLatitude = latitudeField.value;
    const updatedLongitude = longitudeField.value;

    // Call the function to update the sensor in your system
    updateSensor(sensorId, updatedLocation, updatedLatitude, updatedLongitude, updatedStatus);

    // Hide the modal after saving
    modal.style.display = 'none';
  };
}

function updateSensor(sensorId, updatedLocation, updatedLatitude, updatedLongitude, updatedStatus) {
  const sensorRef = ref(db, `sensors/${sensorId}`);

  // Update the sensor data in the database
  set(sensorRef, {
    location: updatedLocation,
    sensorlat: updatedLatitude,
    sensorlong: updatedLongitude,
    status: updatedStatus,
    reading:"",
    sensorid: Number(sensorId), // Ensure sensor ID remains consistent
  })
    .then(() => {
      alert("Sensor updated successfully!");
    })
    .catch((error) => {
      alert("Error updating sensor: " + error.message);
      console.error(error);
    });
}

const saveButton = document.getElementById('save-update-btn');
saveButton.onclick = () => {
  const updatedLocation = locationField.value;
  const updatedStatus = statusField.value;
  const updatedLatitude = latitudeField.value;
  const updatedLongitude = longitudeField.value;

  // Call the updateSensor function with the new data
  updateSensor(sensorId, updatedLocation, updatedLatitude, updatedLongitude, updatedStatus);

  // Optionally close the modal after saving
  modal.style.display = 'none';
};



// Initialize real-time listener on page load
document.addEventListener("DOMContentLoaded", () => {
  retrieveAndUpdateSensors();
});

document.querySelectorAll('#logoimagehead, .logo h1, .logo p').forEach(element => {
  element.addEventListener('click', function() {
    window.location.href = 'homepage.html'; // Navigates to homepage.html when clicked
  });
});