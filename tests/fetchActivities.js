const fetch = require("node-fetch");
const assert = require('assert');

fetch("http://localhost:80/activities?start_time=0&end_time=10000000000&user_id=1")
  .then((data) => data.json())
  .then((json) => {
    console.log(json);
    console.log("Test passed");
  })
  .catch((err) => {
    console.log("Test failed");
    console.log(err);
  });