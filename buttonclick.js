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


viewHistoryButton.addEventListener('click', () => {
  historyModal.style.display = 'flex';
});

viewAnalyticsButton.addEventListener('click', () => {
  analyticsmodal.style.display = 'flex';
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


function logout() {
  window.location.href = 'login.html';
}

function closeCreateAccountModal() {
  document.getElementById("createAccountModal").style.display = "none";
}

function createacc() {
  document.getElementById("users").style.display = "flex";
}

function closeusers() {
  document.getElementById("users").style.display = "none";
}