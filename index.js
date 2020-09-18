// input hash from ts to PS, upload to DB-c port 3100
const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors())

app.listen(3100, () => console.log("PS-1001 listening at 127.0.0.1:3100"));
app.use(express.static("ts"));

app.use(express.json({ limit: "1mb" }));

app.post("/hashFile", (req, res) => {
  console.log(req.body);
  time = Date.now();
  res.json({
    status: "success",
    tick: time
  });
});
