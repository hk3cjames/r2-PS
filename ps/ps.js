
var time = 0;
var hashCountr = 0;
var PsId = "1000";
var tsHash = []


async function intervalFunc() {

 


  const data = { PsId };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch("/PSdisplay", options);
  const disp = await res.json();
  // console.log(disp);

  document.getElementById("tick").textContent = disp.cycle;
  const d = new Date();
  var str = "" + d;
  var test = str.substring(4, 24);

  document.getElementById("time").textContent = test;
  document.getElementById("count").textContent = disp.cycleHashCount;
  document.getElementById("hash").textContent = disp.cycleLinkHash;

  for (i = 1000; i < 2000; i++) {
    j = i - 1000;
    k = disp.dashboardDisp[j]
    var hashDisp = "" + k
    // console.log(hashDisp)
    display = "" + i + "- "  + hashDisp
    document.getElementsByTagName("p")[j].textContent = display.substring(1,12);
  }
}

setInterval(intervalFunc, 900);
