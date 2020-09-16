// input hash from ts to PS
const express = require("express");
const app = express();
app.listen(3000, () => console.log("PS-1001 listening at 127.0.0.1:3000"));
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
