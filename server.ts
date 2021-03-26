import express = require("express");
// Create a new express app instance
const app: express.Application = express();
app.get("/", function (req, res) {
  res.send(
    "Hello There World (from javascript transpiled from typescript running in a docker container on an ec2 machine!\n"
  );
});
app.listen(8080, function () {
  console.log("App is listening on port 8080!\n");
});
