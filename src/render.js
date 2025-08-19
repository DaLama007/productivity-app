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
setTime=10000
time = 10000
onePercentInTime = time / percentage
let timerInterval = null;
function startTimer() {
  localStorage.setItem('time-left', time);
  seconds = time / 1000;
  hours = Math.floor(seconds / 3600);
  minutes = Math.floor((seconds % 3600) / 60);
  seconds = Math.floor(seconds % 60);
  document.getElementById('number').textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (time > 0) {
    percentage = time / onePercentInTime;
    const circumference = 2 * Math.PI * 140
    const offset = circumference - circumference * (percentage / 100);
    // Change the value of the CSS variable
    document.documentElement.style.setProperty('--offset', offset);
    time -= 100
  }
  else if(time==0){
    window.electronAPI.sendNotification("Distraction Blocker", "Timer has ended");
    time=setTime;
    onClickTimer();
  }

}

function onClickTimer() {
  timerPaused = localStorage.getItem('timerPaused');
  let PSButtonE=document.getElementById('PS-Button');
  if (timerPaused=='true'){
    timerPaused='false';
    PSButtonE.textContent='Pause';
    PSButtonE.classList.add('paused');
  }
  else{
    timerPaused='true';
    PSButtonE.textContent='Continue';
    PSButtonE.classList.remove('paused');
  }
  localStorage.setItem('timerPaused', timerPaused);
  
  if (timerPaused=='false') {
    timerInterval = setInterval(() => {
      startTimer();
    }, 100);
  }
  else{
    clearInterval(timerInterval);
  }
}

/*collapse sidebar and change body*/
function collapseElement(element){
  element.classList.toggle("collapsed");
  document.body.classList.toggle("collapsed");
  console.log("collapsed sidebar")
}
sidebar=document.getElementById("sidebar");
sidebar.addEventListener("mouseenter", () => {
    collapseElement(sidebar)
  });
sidebar.addEventListener("mouseleave", () => {
    collapseElement(sidebar)
  });

