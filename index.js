// input hash from ts to PS, upload to DB-c port 3100
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors())

const fetch = require("node-fetch");

app.listen(3100, () => console.log("PS-1001 listening at 127.0.0.1:3100"));

app.use(express.json({ limit: "1mb" }));

var res1 = {};
existHash = "to be confirm in future cycle";
result = "next"
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
  res1 = await fetch("http://127.0.0.1:3200/hashFile", options)
  const disp = await res1.json();
  console.log(disp)
  console.log(disp.status)
  result = disp.status
existHash = disp.hash
});
