// input hash from 1000 TS, upload to DB-c port 3200
const express = require("express");
const cors = require("cors");
var crypto = require("crypto");
const app = express();
app.use(cors());
const fetch = require("node-fetch");
app.use(express.static("ps"));
app.listen(3100, () =>
  console.log("PS listening at port 3100" + "\n" + "connect to DB-C at :3200"));
app.use(express.json({ limit: "1mb" }));

var res1 = {};
let tsKey = [];
tsName = [];
let i = 0;
let j = 0;
let k = 0;
for (i = 0; i < 1000; i++) {
  k = 1000 + i;
  j = "BRAS.ps1000.ts" + k;
  tsName[i] = j;
  tsKey[i] = crypto.createHash("sha256").update(j).digest("hex");
}

console.log(tsName);
console.log(tsKey);

existHash = "to be confirm in future cycle";
result = "next";

app.post("/hashFile", async (req, res) => {
  rxjson = req.body;
  console.log(rxjson);

  time = Date.now();
  newHash = rxjson.thash;
  console.log(newHash);
  console.log(existHash);

  res.json({
    status: result,
    hash: existHash,
    tick: time,
  });

  data = rxjson;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  res1 = await fetch("http://127.0.0.1:3200/hashFile", options); //to DB_c
  const disp = await res1.json();
  console.log(disp);
  console.log(disp.status);
  result = disp.status;
  existHash = disp.hash;
});
