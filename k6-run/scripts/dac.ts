import sql from "k6/x/sql";
import { check } from "k6"
import { sleep } from "k6"
import { Counter,Trend,Rate } from "k6/metrics";

// The second argument is a MySQL connection string, e.g.
// myuser:mypass@tcp(127.0.0.1:3306)/mydb

// [K6 lifecycle stages]

// 1. init code
// Code in the init context prepares the script, loading files, importing modules, and defining the test lifecycle functions. Required.
// Purpose
// Load local files, import modules, declare lifecycle functions (Open JSON file, Import module; Called Once per VU*)
// * In cloud scripts, init code might be called more often.

const db = sql.open(
    "mysql",
    "pr0521a2f9-fbc6-4e56-9bc6-378cee5f3040:9dd84c99c84a4a99@tcp(host.docker.internal:40001)/employees"
    // "pr0521a2f9-fbc6-4e56-9bc6-378cee5f3040:9dd84c99c84a4a99@tcp(172.31.13.109:40001)/employees"
);

const queryCounter = new Counter("query_per_second");
const failedQueryCounter = new Counter("failed_queries");
const queryDurationTrend = new Trend("query_duration", true);

const query =
    `UPDATE salaries SET salary = 0 WHERE emp_no IN (
  SELECT a.emp_no from (
      SELECT * FROM salaries WHERE salary != 0 LIMIT 10
    ) a
)`
const query2 = `SELECT * FROM salaries LIMIT 10`

export function setup() {
    // 2. setup code
    // The setup function runs, setting up the test environment and generating data. Optional.
    // Purpose
    // Set up data for processing, share data among VUs (Call API to start test environment; Once)

}

// Function to log and reset the trend metrics
function logAndResetTrend() {
    console.log(`p(90): ${queryDurationTrend.percentile(90)}`);
    console.log(`p(95): ${queryDurationTrend.percentile(95)}`);
    console.log(`p(99): ${queryDurationTrend.percentile(99)}`);
    // Reset the trend metric by creating a new instance
    //return new Trend("query_duration", true);
}

// setInterval(logAndResetTrend, 3000);

export default function () {
    // 3. VU code
    // VU code runs in the default or scenario function, running for as long and as many times as the options define. Required.
    // Purpose
    // Run the test function, usually default (Make https requests, validate responses;Once per iteration, as many times as the test options require)

    const startTime = new Date();

    try {
        //sql.query(db, query);
        sql.query(db, query2);
        queryCounter.add(1);
    } catch (e) {
        console.log(e)
        failedQueryCounter.add(1);
    }

    const endTime = new Date();
    let duration = endTime - startTime;
    queryDurationTrend.add(duration);
    console.log("duration=" + duration);
    sleep(0.3);
}

export function teardown() {
    // 4. teardown code
    // The teardown function runs, postprocessing data and closing the test environment. Optional.
    // Purpose
    // Process result of setup code, stop test environment (Validate that setup had a certain result, send webhook notifying that test has finished; Once **)
    // ** If the Setup function ends abnormally (e.g throws an error), the teardown() function isn't called. Consider adding logic to the setup() function to handle errors and ensure proper cleanup.
    db.close();
}
