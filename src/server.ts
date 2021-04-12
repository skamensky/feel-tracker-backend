import express = require("express");
import Activity from "./store/Activity";
const { getDBConnection, getActivities, addActivity } = require("./store");
const bodyParser = require("body-parser");

const app: express.Application = express();
app.use(bodyParser.json());

app.post("/activity", async function (req, res) {
  const required_params = [
    "user_id",
    "title",
    "description",
    "feeling",
    "tags",
  ];

  const missing_params = required_params.filter((param, index) => {
    return !(param in req.body);
  });
  if (missing_params.length) {
    return res.json({
      error: `Missing json keys in request body: ${missing_params}`,
    });
  }
  try {
    const activity = new Activity(
      req.body.title,
      req.body.description,
      req.body.feeling,
      req.body.time,
      req.body.tags,
      req.body.user_id
    );
    const savedActivity = await addActivity(activity);
    return res.json(savedActivity);
  } catch (e) {
    console.trace();

    return res.json({ error: String(e) });
  }
});
app.get("/activities", async function (req, res) {
  const required_params = ["user_id", "start_time", "end_time"];
  const missing_params = required_params.filter((param, index) => {
    return !req.query[param];
  });
  if (missing_params.length) {
    return res.json({ error: `Missing params: ${missing_params}` });
  }
  try {
    const activities = await getActivities(
      Number(req.query.user_id),
      req.query.start_time,
      req.query.end_time
    );
    return res.json({ activities });
  } catch (e) {
    return res.json({ error: String(e) });
  }
});
app.listen(8080, function () {
  console.log("App is listening on port 8080, woohoo!\n");
});
