const addSensorButton = document.getElementById("sensor");
const sensorModal = document.getElementById("sensorModal");
const viewHistoryButton = document.getElementById('viewhistory');
const historyModal = document.getElementById('historyModal');
const closeHistoryModalButton = document.getElementById('closeHistoryModal');
const viewAnalyticsButton = document.getElementById('viewAnalytics');
const analyticsmodal = document.getElementById('analyticsmodal');

addSensorButton.addEventListener("click", () => {
  sensorModal.style.display = "flex";
});



function closesensor() {
  document.getElementById("sensorModal").style.display = "none";
}

window.addEventListener("click", (event) => {
  if (event.target === sensorModal) {
    sensorModal.style.display = "none";
  }
});


viewHistoryButton.addEventListener('click', () => {
  historyModal.style.display = 'flex';
});



viewAnalyticsButton.addEventListener('click', () => {
  analyticsmodal.style.display = 'flex';
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

function logout() {
  // Redirect to login.html
  window.location.href = 'login.html';
}

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
})

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

// Close the modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === historyModal) {
    historyModal.style.display = 'none';
  }
});

function openModal() {
  const modal = document.getElementById('updateModal');
  modal.style.display = 'flex'; // Display the modal
}


function closeModal() {
  document.getElementById('historyModal').style.display = 'none';
}



function closeModal2() {
  document.getElementById('analyticsmodal').style.display = 'none';
}

function closeupdate() {
  document.getElementById("updateModal").style.display = "none";
}