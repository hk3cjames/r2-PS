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
PSID = "RBAS.ps1000.ts";

linkHash = crypto.createHash("sha256").update("RBAS.ps1000").digest("hex");

var res1 = {};
tsKeyOriginal = [];
tsKey = [];
tsName = [];
tsIn = [];

dashboardDisp = [];
hashToDBc = [];

cycleCount = 0;
nextChain = "";
busyFlag = false;
hashToDBcCount = 0;
systemTick = 0;

for (i = 0; i < 1000; i++) {
  k = 1000 + i;
  j = PSID + k;
  tsName[i] = j; // j: name to gen initial hash key
  tsKey[i] = crypto.createHash("sha256").update(j).digest("hex");
  tsKeyOriginal[i] = tsKey[i]; // initial key
  tsIn[i] = tsKey[i]; 
}

console.log(tsKeyOriginal);
console.log(tsName);

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
    result = "fail: wrong TSname/ID";
  }

  resJson = {
    status: result,
    nextChainId: tsKey[tsPointer],
    tick: tickCounter,
  };
  res.json(resJson);
  // console.log("PS response to TS");
  // console.log(resJson);
});

async function intervalFunc() {
  busyFlag = true;

  // console.log("PS dashboard display");
  // console.log(tsIn);
  cycleCount = 0;
  hashToDBc = [];

  for (i = 0; i < 1000; i++) {
    if (tsIn[i] !== "") {
      tHashIn = tsIn[i]
      tNameIn = tsName[i]
      hashToDBc[cycleCount] = {tsHashS: tHashIn, tsNameS:tNameIn };
      cycleCount++;
    }
    dashboardDisp[i] = tsIn[i];  
    tsIn[i] = "";

  }

  tick = systemTick;
  systemTick++
  psId = "RBAS.ps1000";
  chainId = linkHash;
  psCycleCount = cycleCount;
  tsHash = hashToDBc;

  const data = { tick, psId, chainId, psCycleCount, tsHash};
  // console.log("post json to DB-C")
  // console.log(data);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // res1 = await fetch("http://127.0.0.1:3200/hashFile", options); //to DB_c
  // const DBcDisp = await res1.json();
  // console.log(DBcDisp);

  // result = disp.status;
  // existHash = disp.hash;

  busyFlag = false;
}

app.post("/PSdisplay", async (req, res) => {
  // console.log("input from PS dashboard")
  rxjson = req.body;
  // console.log("PS dashboard req");
  // console.log(rxjson);
  while (busyFlag == true) {
    setInterval(timeAdj, 10); // wait till PS display json is ready
  }
  // console.log("PS response to TS");
  resJson = {
    cycle: systemTick,
    cycleHashCount: cycleCount,
    cycleLinkHash: linkHash,
    dashboardDisp,
  };
  res.json(resJson);
  // console.log(resJson);
});

setInterval(intervalFunc, 1000);
