const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Service 2");
});

app.listen(3002, () => console.log("Service 2 running on port 3002"));
