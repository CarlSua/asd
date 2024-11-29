const addSensorButton = document.getElementById("sensor");
const sensorModal = document.getElementById("sensorModal");
const closeBtn = document.querySelector(".close-btn");
const viewHistoryButton = document.getElementById('viewhistory');
const historyModal = document.getElementById('historyModal');
const closeHistoryModalButton = document.getElementById('closeHistoryModal');


// Show modal when "Add New Sensor" button is clicked
addSensorButton.addEventListener("click", () => {
  sensorModal.style.display = "flex";
});

// Close modal when the close button is clicked
closeBtn.addEventListener("click", () => {
  sensorModal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === sensorModal) {
    sensorModal.style.display = "none";
  }
});

viewHistoryButton.addEventListener('click', () => {
  historyModal.style.display = 'flex';
});

// Close the modal when the close button is clicked
closeHistoryModalButton.addEventListener('click', () => {
  historyModal.style.display = 'none';
});

// Close the modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === historyModal) {
    historyModal.style.display = 'none';
  }
});

document.getElementById('logout').addEventListener('click', function() {
  window.location.href = 'login.html';
});

addSensorButton.addEventListener("click", () => {
  sensorModal.style.display = "flex";
});

// Close modal when the close button is clicked
closeBtn.addEventListener("click", () => {
  sensorModal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === sensorModal) {
    sensorModal.style.display = "none";
  }
});

viewHistoryButton.addEventListener('click', () => {
  historyModal.style.display = 'flex';
});

// Close the modal when the close button is clicked
closeHistoryModalButton.addEventListener('click', () => {
  historyModal.style.display = 'none';
});

// Close the modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === historyModal) {
    historyModal.style.display = 'none';
  }
});



// Show modal when "Add New Sensor" button is clicked
addSensorButton.addEventListener("click", () => {
  sensorModal.style.display = "flex";
});

// Close modal when the close button is clicked
closeBtn.addEventListener("click", () => {
  sensorModal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === sensorModal) {
    sensorModal.style.display = "none";
  }
});

viewHistoryButton.addEventListener('click', () => {
  historyModal.style.display = 'flex';
});

// Close the modal when the close button is clicked
closeHistoryModalButton.addEventListener('click', () => {
  historyModal.style.display = 'none';
});

// Close the modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === historyModal) {
    historyModal.style.display = 'none';
  }
});




