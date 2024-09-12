const practices = [
  { name: 'Anuloma Viloma Pranayama', time: 300 },
  { name: 'Trataka (Gazing Meditation)', time: 300 },
  { name: 'Moola Bandha + Nasikagra Mudra', time: 300 },
  { name: 'Shambhavi Mudra with Om Chanting', time: 300 },
  { name: 'Kappalabhati', time: 60 },
  { name: 'Nauli', time: 60 },
  { name: 'Bhastrika', time: 60 },
  { name: 'Kechari Mudra', time: 180 },
  { name: 'Ujjayi', time: 120 },
  { name: 'Vipareeta Karani Asana', time: 300 },
  { name: 'Ajapa Japa', time: 300 },
  { name: 'Bhramari', time: 300 },
  { name: 'Moorchha Pranayama', time: 180 },
  { name: 'Shanmukhi Mudra', time: 300 },
  { name: 'Nadi Shodhana', time: 1200 } // Nadi Shodhana will use special logic
];

let currentPracticeIndex = 0;
let currentTime = practices[currentPracticeIndex].time;
let isRunning = false;
let timerInterval = null;
let phaseInterval = null;
let currentBreathCount = 0; // Tracks the breath retention count for Nadi Shodhana

const timerDisplay = document.getElementById('timer-display');
const currentPracticeEl = document.getElementById('current-practice');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const practiceList = document.getElementById('practice-items');

// Nadi Shodhana-specific elements
const nadiContainer = document.getElementById('nadi-shodhana-container');
const phaseText = document.getElementById('phase-text');
const pieChartCanvas = document.getElementById('nadiPieChart');
const breathCountDisplay = document.getElementById('breath-count'); // Display for breath count
let nadiPieChart;
let currentPhase = 'inhale';
let phaseTimeLeft = 12; // Starting inhale time (12 seconds)

// Initialize Chart.js for pie chart
function initializePieChart() {
  const ctx = pieChartCanvas.getContext('2d');
  nadiPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Time Left'],
      datasets: [{
        data: [100, 0],  // Start with full pie chart
        backgroundColor: ['#f2a365', '#1f1b2d'],
        borderWidth: 1
      }]
    },
    options: {
      rotation: -0.5 * Math.PI, // Start the pie at the top
      circumference: 2 * Math.PI, // Full circle
      cutoutPercentage: 50, // Make it a doughnut
    }
  });
}

// Update Pie Chart for Nadi Shodhana phases
function updatePieChart(percentage) {
  nadiPieChart.data.datasets[0].data = [percentage, 100 - percentage];
  nadiPieChart.update();
}

// Initialize the practice list in the DOM
function initializePracticeList() {
  practices.forEach((practice, index) => {
    const listItem = document.createElement('li');
    listItem.innerText = practice.name;
    listItem.setAttribute('id', `practice-${index}`);
    practiceList.appendChild(listItem);
  });
}

// Highlight the current practice in the list
function updatePracticeList() {
  practices.forEach((practice, index) => {
    const listItem = document.getElementById(`practice-${index}`);
    listItem.classList.remove('current-practice', 'completed-practice');
    
    if (index < currentPracticeIndex) {
      listItem.classList.add('completed-practice');
    } else if (index === currentPracticeIndex) {
      listItem.classList.add('current-practice');
    }
  });
}

// Start/Pause button event listener
startBtn.addEventListener('click', () => {
  if (isRunning) {
    pauseTimer();
  } else {
    if (practices[currentPracticeIndex].name === 'Nadi Shodhana') {
      startNadiShodhana();
    } else {
      startRoutine();
    }
  }
});

// Start routine timer
function startRoutine() {
  isRunning = true;
  startBtn.textContent = 'Pause';
  timerInterval = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      displayTime(currentTime);
    } else {
      clearInterval(timerInterval);
      nextPractice();
    }
  }, 1000);
}

// Start Nadi Shodhana logic with inhale-retain-exhale phases
function startNadiShodhana() {
  nadiContainer.style.display = 'block'; // Show Nadi Shodhana container
  currentPhase = 'inhale';  // Start with inhale
  phaseTimeLeft = 12;  // 12 seconds inhale
  currentBreathCount = 0; // Reset breath count
  isRunning = true;
  startBtn.textContent = 'Pause';
  updatePhase();
}

// Update the phases of Nadi Shodhana (inhale-retain-exhale)
function updatePhase() {
  phaseText.innerText = `${currentPhase.toUpperCase()}: ${phaseTimeLeft}s`;

  const totalPhaseTime = currentPhase === 'inhale' ? 12 :
                         currentPhase === 'retain' ? 16 : 10;
  const percentage = (phaseTimeLeft / totalPhaseTime) * 100;
  updatePieChart(percentage);

  clearInterval(phaseInterval);  // Clear any previous interval
  phaseInterval = setInterval(() => {
    if (phaseTimeLeft > 0) {
      phaseTimeLeft--;
      displayPhaseTime(phaseTimeLeft);  // Update the phase timer
    } else {
      clearInterval(phaseInterval);
      nextNadiShodhanaPhase(); // Move to next phase
    }
  }, 1000);
}

function nextNadiShodhanaPhase() {
  if (currentPhase === 'inhale') {
    currentPhase = 'retain';
    phaseTimeLeft = 16;
  } else if (currentPhase === 'retain') {
    currentPhase = 'exhale';
    phaseTimeLeft = 10;
  } else if (currentPhase === 'exhale') {
    currentBreathCount++;  // Increment the breath count after one full cycle
    breathCountDisplay.innerText = `Breath Count: ${currentBreathCount}`; // Update the breath count display
    currentPhase = 'inhale';
    phaseTimeLeft = 12;
  }
  updatePhase(); // Start the next phase
}

// Display the time for the current phase
function displayPhaseTime(seconds) {
  phaseText.innerText = `${currentPhase.toUpperCase()}: ${seconds}s`;
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  clearInterval(phaseInterval);  // Stop the Nadi Shodhana phases too
  startBtn.innerText = "Start"; // Change the button text back to "Start"
  isRunning = false; // Set running state to false
}

// Reset button event listener
resetBtn.addEventListener('click', resetTimer);

function resetTimer() {
  clearInterval(timerInterval);
  clearInterval(phaseInterval);  // Stop the Nadi Shodhana phases too
  currentTime = practices[currentPracticeIndex].time;
  displayTime(currentTime);
  isRunning = false;
  startBtn.innerText = "Start"; // Reset start button to "Start"
  nadiContainer.style.display = 'none';  // Hide Nadi Shodhana container on reset
  breathCountDisplay.innerText = ""; // Clear the breath count display
}

// Display time in mm:ss format
function displayTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerDisplay.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Navigate to the next practice, but do not automatically start the timer
nextBtn.addEventListener('click', () => {
  if (currentPracticeIndex < practices.length - 1) {
    currentPracticeIndex++;
    changePractice();
  }
});

// Navigate to the previous practice, but do not automatically start the timer
prevBtn.addEventListener('click', () => {
  if (currentPracticeIndex > 0) {
    currentPracticeIndex--;
    changePractice();
  }
});

// Change Practice Logic
function changePractice() {
  clearInterval(timerInterval);
  clearInterval(phaseInterval);  // Stop Nadi Shodhana phases if applicable
  currentPracticeEl.innerText = practices[currentPracticeIndex].name;
  currentTime = practices[currentPracticeIndex].time;
  updatePracticeList(); // Update the practice list UI
  displayTime(currentTime);  // Reset time display
  isRunning = false;  // Ensure the timer is not running
  startBtn.innerText = "Start"; // Reset the start button
  nadiContainer.style.display = 'none';  // Hide Nadi Shodhana UI if it was active
}

// Initialize the practice list when the page loads
initializePracticeList();
initializePieChart();
updatePracticeList();
