// @ts-ignore
import sql from "k6/x/sql"
// @ts-ignore
import {check, sleep} from "k6"
// @ts-ignore
import {Counter, Trend} from "k6/metrics"


// K6 Test lifecycle 에 대해 이 링크를 참고하세요.
// https://k6.io/docs/using-k6/test-lifecycle/

// 1. init code (call once per VU)

const queryCount = new Counter("query_count");
const queryFailures = new Counter("query_failures");
const queryDuration = new Trend("query_duration", true /* isTime */);

// The second argument is a MySQL connection string, e.g.
// myuser:mypass@tcp(127.0.0.1:3306)/mydb
const db = sql.open(
    "mysql",
    "pr0521a2f9-fbc6-4e56-9bc6-378cee5f3040:9dd84c99c84a4a99@tcp(host.docker.internal:40001)/employees"
    // "pr0521a2f9-fbc6-4e56-9bc6-378cee5f3040:9dd84c99c84a4a99@tcp(172.31.13.109:40001)/employees"
);

// noinspection JSUnusedGlobalSymbols
export function setup() {
    // 2. Setup code (call once at the beginning of test)
    // Set up data for processing, share data among VUs.
    console.log("setup is invoked.")
}

// noinspection JSUnusedGlobalSymbols
export default function () {
    // 3. VU code

    queryCount.add(1);
    const startTime = new Date();

    try {
        // noinspection SqlDialectInspection,SqlNoDataSourceInspection
        const results = sql.query(db,
            `SELECT *
             FROM salaries LIMIT 10`
        );
        const checkOutput = check(results, {
            'is length 10': (r: any[]) => r.length === 10,
        })
        if (!checkOutput) {
            queryFailures.add(1)
            console.warn("Results of sql.query() are invalid.")
        }
    } catch (e) {
        // It might get exceptions due to too many connections or unexpected EOF.
        // Please do not increase virtual users (VU) above high loads
        // where it returns exceptions.
        // Exception 이 발생하는 높은 부하 수준으로 Virtual User 를 늘이는 것을 권장하지 않습니다.
        queryFailures.add(1)
        console.warn("Got an exception:", e)
    }

    const endTime = new Date();
    const duration = endTime.valueOf() - startTime.valueOf();
    queryDuration.add(duration);

    sleep(0.3); // in seconds
}

// noinspection JSUnusedGlobalSymbols
export function teardown() {
    // 4. Teardown
    // Process result of setup code, stop test environment.
    db.close();
}
