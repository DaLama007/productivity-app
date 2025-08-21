
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
percentage = 100
setTime = 10000
time = 10000
onePercentInTime = time / percentage
let timerInterval = null;

//convert ms to right time format
function msToTime(ms){
  seconds = ms / 1000;
  hours = Math.floor(seconds / 3600);
  minutes = Math.floor((seconds % 3600) / 60);
  seconds = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}
function startTimer() {
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
  timerPaused = localStorage.getItem('timerPaused');
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
    timerInterval = setInterval(() => {
      startTimer();
    }, 100);
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
slider=document.getElementById("time-slider");
slider.addEventListener("change",()=>{
  displaySliderValue(slider.value);
});
//slider value display
function displaySliderValue(value){
  sliderValue=document.getElementById("valueDisplay");
  sliderValue.textContent=msToTime(slider.value);
  console.log(value);
}


