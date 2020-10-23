var tickCounter = 0;
var time = 0;
var hashCountr = 0;


function intervalFunc() {
  document.getElementById("tick").textContent = tickCounter;
  tickCounter++;
  const d = new Date();
  var str = ''+ d
  var test = str.substring(4,24)
  document.getElementById("time").textContent = test;
  for (i = 1000; i < 2000; i++) {
    display = "" + i + "- " 
    j=i-1000
    document.getElementsByTagName("p")[j].textContent = display.substring(1);
  }
    document.getElementsByTagName("p")[2].textContent = display + 123456;   
    document.getElementsByTagName("p")[4].textContent = display+ tickCounter;   
    document.getElementsByTagName("p")[6].textContent = display+ tickCounter;   
    document.getElementsByTagName("p")[9].textContent = display+ tickCounter;   
}

setInterval(intervalFunc, 1000);
