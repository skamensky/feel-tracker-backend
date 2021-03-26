import express = require("express");
// Create a new express app instance
const app: express.Application = express();
app.get("/", function (req, res) {
  res.send("Hello There World!\n");
});
app.listen(3000, function () {
  console.log("App is listening on port 3000!\n");
});
console.log("hi");
