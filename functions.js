// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
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

var map = L.map('map').setView([11.046556122600492, 124.002498512228], 13);
var tileUrl = 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=5ac93f341e474e76bec352bd73074fd1';
var layer = new L.TileLayer(tileUrl, { maxZoom: 18, minZoom: 3 });
map.addLayer(layer);

// Get form elements
let location = document.getElementById("sensorlocation");
let sensorlat = document.getElementById("sensorlatitude");
let sensorlong = document.getElementById("sensorlongitude");
let datecreated = document.getElementById("sensordate");
let addbtn = document.getElementById("addbtn");

function AddData() {
  const sensorsRef = ref(db, "sensors");

  // Retrieve the current maximum sensorid
  onValue(sensorsRef, (snapshot) => {
    let maxSensorId = 0;

    if (snapshot.exists()) {
      const sensors = snapshot.val();
      Object.keys(sensors).forEach((key) => {
        const sensor = sensors[key];
        if (sensor.sensorid > maxSensorId) {
          maxSensorId = sensor.sensorid;
        }
      });
    }

    // Increment the maxSensorId for the new sensor
    const newSensorId = maxSensorId + 1;

    // Set the new sensor data
    set(ref(db, "sensors/" + newSensorId), {
      location: location.value,
      sensorlat: sensorlat.value,
      sensorlong: sensorlong.value,
      datecreated: datecreated.value,
      sensorid: newSensorId,
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
  }, {
    onlyOnce: true // Ensure the listener retrieves data only once
  });
}

// Attach the add button event listener
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

        const parsedReading = parseFloat(reading);
        if (parsedReading <= 0.7) {
          addWarningIcon(lat, long, key); // Add warning icon for critical reading
        } else {
          removeWarningIcon(key); // Remove warning icon if reading improves
        }

        // Reopen the popup if it was previously open
        if (key === currentlyOpenPopupId) {
          marker.openPopup();
        }
      });
    } else {
      console.log("No data available.");
    }
  });

  // Optionally, use setInterval to force periodic checks
  setInterval(() => {
    retrieveAndUpdateSensors();
  }, 30000); // Call the function every 30 seconds or any desired interval
}

const warningIcons = {};

// Function to add a warning icon
function addWarningIcon(lat, long, sensorId) {
  const warningIcon = L.divIcon({
    className: 'warning-icon warning-icon-blinking',
    html: '<i class="fa fa-exclamation-triangle" style="color: red; font-size: 20px;"></i>',
    iconAnchor: [-5, 15],
  });

  // Add the warning icon next to the marker
  const warningMarker = L.marker([lat + 0.0001, long + 0.0001], { icon: warningIcon }).addTo(map);

  // Store the reference of the warning icon using the sensorId
  warningIcons[sensorId] = warningMarker;
}

// Function to remove a warning icon
function removeWarningIcon(sensorId) {
  const warningMarker = warningIcons[sensorId];
  if (warningMarker) {
    map.removeLayer(warningMarker); 
    delete warningIcons[sensorId]; 
  }
}

// Function to create a custom marker and add it to the map
function createCustomMarker(lat, long, location, reading, status, sensorId) {
  const parsedReading = parseFloat(reading);

  let markerColor;
  if (parsedReading <= 0.7) {
    markerColor = 'red';
  } else if (parsedReading <= 1) {
    markerColor = 'orange';
  } else if (parsedReading <= 2) {
    markerColor = 'yellow';
  } else if (parsedReading <= 5) {
    markerColor = 'blue';
  } else {
    markerColor = 'grey';
  }

  const marker = L.circleMarker([lat, long], {
    color: 'black',
    fillColor: markerColor,
    fillOpacity: 1,
    radius: 8,
    weight: 2,
    sensorId: sensorId, // Add the sensorId to marker options for reference
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
  // Show confirmation dialog
  const isConfirmed = confirm("Are you sure you want to delete this sensor?");

  if (isConfirmed) {
    const sensorRef = ref(db, `sensors/${sensorId}`);

    set(sensorRef, null)
      .then(() => {
        alert("Sensor deleted successfully!");
      })
      .catch((error) => {
        alert("Error deleting sensor: " + error.message);
        console.error(error);
      });
  } else {
    alert("Deletion canceled.");
  }
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

// Function to fetch locations and populate the dropdown
function populateLocationOptions() {
  const sensorsRef = ref(db, "sensors"); // Reference to the 'sensors' node in Firebase RTDB
  onValue(sensorsRef, (snapshot) => {
    const sensors = snapshot.val();
    const locationSelect = document.getElementById("location");


    if (sensors) {
      // Create a Set to store unique locations
      const locationsSet = new Set();

      // Iterate through sensors and add their locations to the Set (which removes duplicates)
      Object.keys(sensors).forEach((key) => {
        const sensor = sensors[key];
        if (sensor.location) {
          locationsSet.add(sensor.location);
        }
      });

      // Convert the Set back to an array and create an option for each unique location
      locationsSet.forEach((location) => {
        const option = document.createElement("option");
        option.value = location; // Set the location as the option value
        option.textContent = location; // Set the location as the option text
        locationSelect.appendChild(option);
      });
    } else {
      console.log("No sensors data available.");
    }
  });
}


const historyRef = ref(db, 'history/1'); // Path to the '1' node under 'history'

// Function to fetch data from RTDB and update the table
function fetchHistoryData() {
  // Listen for changes in the 'history/1' node
  onValue(historyRef, (snapshot) => {
    if (snapshot.exists()) {
      const history = snapshot.val();
      const tbody = document.querySelector("#sensorTable tbody"); // Get the tbody of the table

      // Clear any existing rows before adding new data
      tbody.innerHTML = "";

      // Iterate through each timestamp in the history data
      Object.keys(history).forEach((timestamp) => {
        const reading = history[timestamp]; // Get the water level reading for this timestamp

        // Convert timestamp to a human-readable date (optional)
        const date = new Date(timestamp).toLocaleString(); // Converts to a formatted date string

        // Create a new row for the table
        const row = document.createElement("tr");

        const locationIdCell = document.createElement("td");
        locationIdCell.textContent = "Cebu Roosevelt Memorial Colleges"; // Default location ID
        row.appendChild(locationIdCell);

        // Create and append the cells
        const timestampCell = document.createElement("td");
        timestampCell.textContent = date; // Display the formatted timestamp
        row.appendChild(timestampCell);

        const readingCell = document.createElement("td");
        readingCell.textContent = reading; // Display the reading (water level)
        row.appendChild(readingCell);

        // Append the row to the table body
        tbody.appendChild(row);
      });
    } else {
      console.log("No history data available.");
    }
  });
}


// Call this function to populate the dropdown when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateLocationOptions(); // Populate the location options
  retrieveAndUpdateSensors(); // Initialize real-time listener for sensor markers
  fetchHistoryData();
});

