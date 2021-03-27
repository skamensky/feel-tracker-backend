import { Database } from "better-sqlite3";
import Activity from "./Activity";
import Feelings from "./Feelings";

const path = require("path");
const fs = require("fs");
const { getNowAsUTCTimeStamp } = require("../utils");

const Database = require("better-sqlite3");

const DB_PATH = "/persistent_data/db.sqlite";

async function getDBConnection(): Promise<Database> {
  const db_exists = fs.existsSync(DB_PATH);
  const db = new Database(DB_PATH, { verbose: console.log });

  if (!db_exists) {
    // parse out comments since sqlite.exec doesn't support comments
    const create_script = fs
      .readFileSync(path.join(__dirname, "setup_db.sql"), { encoding: "utf-8" })
      .split("\n")
      .filter((line: string, index: number) => {
        return !line.startsWith("--");
      })
      .join("\n");

    return await db.exec(create_script);
  } else {
    return db;
  }
}

function arrayToSQLValuesString(values: number[] | string[]): string {
  // takes and array like [1,2,3] and turns it into (1),(2),(3)
  // or an array like ['a','b','c'] and turns it into ('a'),('b'),('c')
  return values
    .map((val: string | number) => {
      let quote = "'";
      if (typeof val == "number") {
        quote = "";
      }
      return `(${quote}${val}${quote})`;
    })
    .join(",");
}

async function getActivities(
  user_id: String,
  start_time: Number,
  end_time: Number
): Promise<Activity[]> {
  let activities: Activity[] = [];
  const dbConn = await getDBConnection();

  let rawActivityRows: any[] = await dbConn
    .prepare(
      `SELECT activity_id,user_id,title,description,feeling,time
         FROM activity 
         WHERE time>= ? AND time <= ? AND user_id=?`
    )
    .all([start_time, end_time, user_id]);

  let rawTags: any[] = await dbConn
    .prepare(
      `SELECT tag.tag_id,name,a.activity_id FROM tag 
            JOIN activity_tag_junction aj on aj.tag_id=tag.tag_id
            JOIN activity  a on a.activity_id=aj.activity_id
            WHERE a.time>= ? AND a.time <= ? AND a.user_id=?`
    )
    .all([start_time, end_time, user_id]);

  let activityIdToActivity = {};
  rawActivityRows.forEach((activity: any, index) => {
    activity["tags"] = [];
    // @ts-ignore
    activityIdToActivity[activity.activity_id] = activity;
  });

  rawTags.forEach((tag, index) => {
    // @ts-ignore
    activityIdToActivity[tag.activity_id].tags.push(tag);
  });

  return rawActivityRows.map((row, index) => {
    return new Activity(
      row.title,
      row.description,
      row.feeling,
      row.time,
      row.tags,
      row.activity_id
    );
  });
}

async function getActivity(activity_id: number): Promise<Activity> {
  const dbConn = await getDBConnection();
  const activityRaw = await dbConn
    .prepare("SELECT * FROM activity WHERE activity_id=?")
    .get(activity_id);

  const tags = await dbConn
    .prepare(
      `SELECT name FROM tag 
            WHERE tag_id in 
                (SELECT tag_id FROM activity_tag_junction 
                WHERE activity_id=?
                )`
    )
    .all(activity_id)
    .map((tag) => tag.name);

  return new Activity(
    activityRaw.title,
    activityRaw.description,
    activityRaw.feeling,
    activityRaw.time,
    tags,
    activityRaw.user_id,
    activity_id
  );
}

async function addActivity(activity: Activity): Promise<Activity> {
  const dbConnection = await getDBConnection();

  // add new tags
  await dbConnection
    .prepare("CREATE TEMPORARY TABLE new_tags(name TEXT)")
    .run();

  const tagParams = activity.tags.map((tg) => "(?)").join(",");
  await dbConnection
    .prepare(`INSERT INTO new_tags (name) VALUES ${tagParams}`)
    .run(...activity.tags);
  await dbConnection
    .prepare(
      `INSERT INTO tag
        (name)
        SELECT 
            name FROM new_tags 
            WHERE name NOT IN (SELECT name FROM tag)
        `
    )
    .run();
  activity.time = getNowAsUTCTimeStamp();

  let actPrep = await dbConnection.prepare(`
    INSERT INTO activity 
    (user_id, title, description, feeling, time)
    VALUES
    (?,?,?,?,?)
    `);
  let activityId = await actPrep.run(
    activity.user_id,
    activity.title,
    activity.description,
    activity.feeling,
    activity.time
  ).lastInsertRowid;

  const whereParams = activity.tags.map((tg) => "?").join(",");
  console.log(` INSERT INTO activity_tag_junction
    (tag_id, activity_id) 
    SELECT tag_id,${activityId} FROM tag where name in (${whereParams})`);
  await dbConnection
    .prepare(
      `
    INSERT INTO activity_tag_junction
    (tag_id, activity_id) 
    SELECT tag_id,? FROM tag where name in (${whereParams})`
    )
    .run(activityId, ...activity.tags);

  return await getActivity(Number(activityId));
}

module.exports = {
  getDBConnection,
  getActivities,
  addActivity,
};
