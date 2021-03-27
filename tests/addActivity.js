const fetch = require("node-fetch");
const assert = require('assert');

const activity = {
  user_id: 1,
    title: "Testing the API",
    description: "A description",
    feeling: "great",
    tags: ["health", "new tag", "education"]
}

const body = JSON.stringify(activity);
fetch("http://localhost:80/activity", {
  method: "POST",
  body,
  headers: { "Content-Type": "application/json" },
})
  .then((data) => data.json())
  .then((json) => {
    console.log(json)
    for(key in activity){
      assert(String(activity[key])==String(json[key]));
    }
    assert(typeof json.id=="number");
    console.log("Test passed");
  })
  .catch((err) => {
    console.log("Test failed");
    console.log(err);
  });