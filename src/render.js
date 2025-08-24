
let lastWindowId = 0
let counter = 0
timerPaused = localStorage.setItem('timerPaused', 'true');
setInterval(() => {
  window.electronAPI.getActiveWindow()
    .then(currWindow => {
      console.log(currWindow)
      if (currWindow.id == lastWindowId) {
        counter++;
        if (counter == 60) {
          window.electronAPI.sendNotification("Focus-Alert", "Focus!");
          counter = 0;
        }
      }
      else {
        lastWindowId = currWindow.id
        counter = 0
      }
    });
}, 500)
let percentage = 100
let setTime = 10000
let time = 10000

let timerInterval = null;

//convert ms to right time format
function msToTime(ms) {
  seconds = ms / 1000;
  hours = Math.floor(seconds / 3600);
  minutes = Math.floor((seconds % 3600) / 60);
  seconds = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}
function startTimer(onePercentInTime) {
  localStorage.setItem('time-left', time);
  document.getElementById('number').textContent = msToTime(time);
  if (time > 0) {
    percentage = time / onePercentInTime;
    const circumference = 2 * Math.PI * 140
    const offset = circumference - circumference * (percentage / 100);
    // Change the value of the CSS variable
    document.documentElement.style.setProperty('--offset', offset);
    time -= 100
  }
  else if (time == 0) {
    window.electronAPI.sendNotification("Distraction Blocker", "Timer has ended");
    time = setTime;
    onClickTimer();
  }

}

function onClickTimer() {

  const timerPaused = localStorage.getItem('timerPaused');
  let PSButtonE = document.getElementById('PS-Button');
  if (timerPaused == 'true') {
    timerPaused = 'false';
    PSButtonE.textContent = 'Pause';
    PSButtonE.classList.add('paused');
  }
  else {
    timerPaused = 'true';
    PSButtonE.textContent = 'Continue';
    PSButtonE.classList.remove('paused');
  }
  localStorage.setItem('timerPaused', timerPaused);

  if (timerPaused == 'false') {
    const selectedMode = localStorage.getItem("selectedMode");
    if (selectedMode == "timer" || selectedMode == null) {
      let onePercentInTime = time / percentage;
      timerInterval = setInterval(() => {
        startTimer(onePercentInTime);
      }, 100);
    }
  }
  else {
    clearInterval(timerInterval);
  }
}

/*collapse sidebar and change body*/
function collapseElement(element) {
  element.classList.toggle("collapsed");
  document.body.classList.toggle("collapsed");
  console.log("collapsed sidebar")
}
//shrink and expand sidebar if user hovers over it or out
sidebar = document.getElementById("sidebar");
sidebar.addEventListener("mouseenter", () => {
  collapseElement(sidebar)
});
sidebar.addEventListener("mouseleave", () => {
  collapseElement(sidebar)
});

//slider value listener and getter
const slider = document.getElementById("time-slider");
slider.addEventListener("change", () => {
  displaySliderValue(slider.value);
});
//slider value display
function displaySliderValue(value) {
  sliderValue = document.getElementById("valueDisplay");
  sliderValue.textContent = msToTime(slider.value * 300000);
  console.log(value);
}

//set time
function setTandM() {
  let selectedMode = document.getElementById("selected-mode")
  localStorage.setItem("selectedMode", selectedMode);
  console.log(selectedMode.value);
  if (selectedMode.value == "timerSelector") {
    let timeDisplay = document.getElementById("number");
    let valueDisplay = document.getElementById("valueDisplay");
    timeDisplay.textContent = valueDisplay.textContent;
    time = slider.value * 300000
  }
  else {
    time = 0;
    timeDisplay.textContent = "00:00"
  }

}

function startStopwatch() {

  time += 1000;
  document.getElementById('number').textContent = msToTime(time);

  percentage = time / onePercentInTime;
  const circumference = 2 * Math.PI * 140
  const offset = circumference * (percentage / 100);
  // Change the value of the CSS variable
  document.documentElement.style.setProperty('--offset', offset);
  time -= 100


}
