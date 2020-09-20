// input hash from ts to PS, upload to DB-c port 3100
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors())

const fetch = require("node-fetch");

app.listen(3100, () => console.log("PS-1001 listening at 127.0.0.1:3100"));

app.use(express.json({ limit: "1mb" }));

var res1 = {};
existHash = "ab1234";
app.post("/hashFile", (req, res) => {
  rxjson = req.body;
  console.log(rxjson);

  time = Date.now();
  newHash = rxjson.thash;

  console.log(existHash);
  console.log(newHash);

  if (newHash === existHash) {
    res_status = "fail";
  } else {
    res_status = "success";
    existHash = rxjson.thash;
  }
  console.log(res_status)
  res.json({
    status: res_status,
    hash: existHash,
    tick: time
  });

});
