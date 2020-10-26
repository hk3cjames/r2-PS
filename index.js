// input hash from 1000 TS, upload to DB-c port 3200
const express = require("express");
const cors = require("cors");
var crypto = require("crypto");
const app = express();
app.use(cors());
const fetch = require("node-fetch");
app.use(express.static("ps"));
app.listen(3100, () =>
  console.log("PS listening at port 3100" + "\n" + "connect to DB-C at :3200")
);
app.use(express.json({ limit: "1mb" }));

var res1 = {};
tsKeyOriginal = [];
tsKey = [];
tsName = [];
tsIn = [];
tsRdy = [];
dashboardDisp = [];
linkHash = "";
displayCount = 0;
nextChain = "";
busyFlag = false;

let i = 0;
let j = 0;
let k = 0;

for (i = 0; i < 1000; i++) {
  k = 1000 + i;
  j = "" + k;
  tsName[i] = j;
  tsKey[i] = crypto.createHash("sha256").update(j).digest("hex");
  tsKeyOriginal[i] = tsKey[i];
  tsIn[i] = "abcd1234567890abcdef";
  tsRdy[i] = true;
}

console.log(tsName);
console.log(tsKey);
hashCount = 0;
tickCounter = 0;
result = 0;

function checkTSname(name, ID) {
  for (i = 0; i < 1000; i++) {
    if (name == tsName[i]) {
      if (ID == tsKey[i] || ID == tsKeyOriginal[i]) {
        return i;
      }
    }
  }
  return 1000; // >= 1000
}

async function timeAdj() {
  return;
}

app.post("/hashFile", async (req, res) => {
  rxjson = req.body;
  // console.log("TS input json");
  // console.log(rxjson)

  while (busyFlag == true) {
    setInterval(timeAdj, 10);
  }
  tsPointer = checkTSname(rxjson.tsId, rxjson.chainId);
  // console.log("tsId =" + rxjson.tsId) //==index of input hash
  // console.log("tsPointer =" + tsPointer)

  if (tsPointer < 1000) {
    tsIn[tsPointer] = rxjson.tHash;
    tsKey[tsPointer] = rxjson.tHash;
    result = "submitted";
  } else {
    resullt = "fail: wrong name+ID";
  }

  resJson = {
    status: result,
    nextChainId: nextChain,
    tick: tickCounter,
  };
  res.json(resJson);
  // console.log("PS response to TS");
  // console.log(resJson);
});

app.post("/PSdisplay", async (req, res) => {
  // input from PS dashboard
  rxjson = req.body;
  // console.log("PS dashboard req");
  // console.log(rxjson);
  while (busyFlag == true) {
    setInterval(timeAdj, 10);
  }
  // console.log("PS response to TS");

  resJson = {
    cycle: tickCounter,
    cycleHashCount: displayCount,
    cycleLinkHash: linkHash,
    dashboardDisp,
  };
  res.json(resJson);
  // console.log(resJson);

  cycleLinkHash = tsKey[0];
});

async function intervalFunc() {
  busyFlag = true;
  tickCounter++;
  // data = rxjson;
  // const options = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // };
  // res1 = await fetch("http://127.0.0.1:3200/hashFile", options); //to DB_c
  // const DBcDisp = await res1.json();
  // console.log(DBcDisp);

  // result = disp.status;
  // existHash = disp.hash;

  // console.log(tsIn);
  displayCount = 0
  for (i = 0; i < 1000; i++) {
    if (tsIn[i] !=="") {displayCount++}
    dashboardDisp[i] = tsIn[i];
    tsIn[i] = "";
  }
  
  busyFlag = false;
}
setInterval(intervalFunc, 1000);
