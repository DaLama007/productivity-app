let lastWindowId = 0
let counter = 0
setInterval(() => {
  window.electronAPI.getActiveWindow()
    .then(currWindow => {
      //console.log(currWindow)
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
time = 180000
onePercentInTime = time / percentage
setInterval(() => {
  time -=1000
  console.log(time)
  localStorage.setItem('time-left',time);
  seconds=time/1000;
  console.log(`Seconds:${seconds}`)
  hours=Math.floor(seconds/3600);
  minutes=Math.floor((seconds%3600)/60);
  seconds=seconds%60;
  document.getElementById('number').textContent=`${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

  if(time>0){
    percentage = time / onePercentInTime;
    const circumference = 2 * Math.PI * 225
    const offset=circumference- circumference*(percentage/100)/3;
    // Change the value of the CSS variable
    document.documentElement.style.setProperty('--offset', offset);
    console.log(percentage)}
}, 1000);




