const fetch = require("node-fetch");
const assert = require('assert');




base_url = process.env.REMOTE_TEST ? 'http://3.10.151.65': 'http://localhost:80'

fetch(`${base_url}/activities?start_time=0&end_time=16168810653100000&user_id=1`)
  .then((data) => data.json())
  .then((json) => {
    console.log(json);
    console.log("Test passed");
  })
  .catch((err) => {
    console.log("Test failed");
    console.log(err);
  });