// AppWoeksSchool w1p5
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const multer = require("multer");
const redis = require("redis");
const getIP = require("ipware")().get_ip;
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" });

// redis port setting
const REDISPORT = process.env.REDIS_PORT || 6379;

// create redis client
const client = redis.createClient(REDISPORT);

// Router setting
const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static("public"));

router.get("/marketing/campaigns", (req, res) => {
    async function qureyCampaign (sqlSelect, sqlCount, queryPage) {
        const ip = getIP(req).clientIp;
        const N = parseInt(process.env.N); // click times
        const M = parseInt(process.env.M); // expired second
        checkVisit(ip, M);
        const visitTimes = await getCache(ip);
        if (JSON.parse(visitTimes) > N) {
            const output = {
                message: "STOP!!"
            };
            return output;
        }

        const keyData = "campaignList";
        const keyInfo = "sqlInfo";
        const cacheData = await getCache(keyData);
        const cacheSqlInfo = await getCache(keyInfo);
        if (cacheData !== null && cacheSqlInfo !== null) {
            // get data from cache
            console.log("in cache!");
            const campaignList = JSON.parse(cacheData);
            const sqlInfo = JSON.parse(cacheSqlInfo);

            const output = {};
            if (sqlCount !== "none") {
                output.data = campaignList;
                const nextPaging = parseInt(queryPage) + 1;
                if (nextPaging > sqlInfo.totalPages || sqlInfo.sqlTotalcount / ((queryPage + 1) * sqlInfo.pagesGap) === 1) {
                    return output;
                }
                output.next_paging = nextPaging;
                return output;
            } else {
                output.data = campaignList[0];
                return output;
            }
        } else {
            console.log("in sql!");

            let totalPages = 0;
            let sqlTotalcount = 0;
            const pagesGap = 6;

            if (queryPage == null) {
                queryPage = "0";
            }
            if (sqlCount !== "none") {
                const sqlTotalNumber = await dbsql(req, sqlCount);
                sqlTotalcount = parseInt(sqlTotalNumber[0]["Count(*)"]);
                totalPages = sqlTotalcount / pagesGap;
                const sqlDataStart = (queryPage) * pagesGap;
                sqlSelect = sqlSelect + ` LIMIT ${sqlDataStart} , ${pagesGap};`;
                // console.log(sqlSelect);
            }
            const campaignList = await dbsql(req, sqlSelect);
            // console.log(JSON.stringify(campaignList));

            // set data in cache
            client.set(keyData, JSON.stringify(campaignList));
            const campaignSqlInfo = { // save Info of mysql eg totalPages
                totalPages: totalPages,
                sqlTotalcount: sqlTotalcount,
                pagesGap
            };
            client.set(keyInfo, JSON.stringify(campaignSqlInfo));

            const output = {};
            if (sqlCount !== "none") {
                output.data = campaignList;
                const nextPaging = parseInt(queryPage) + 1;
                if (nextPaging > totalPages || sqlTotalcount / ((queryPage + 1) * pagesGap) === 1) {
                    return output;
                }
                output.next_paging = nextPaging;
                return output;
            } else {
                output.data = campaignList[0];
                return output;
            }
        }
    }

    const queryPage = req.query.paging;
    // console.log("query_page: " + queryPage); // check Arthur robot.
    const sqlSelect = "SELECT * FROM campaign_table";
    const sqlCount = "SELECT Count(*) FROM campaign_table;";
    qureyCampaign(sqlSelect, sqlCount, queryPage).then((result) => {
        res.send(result);
    });
});

function getCache (key) { // used in async function
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) throw err;
            resolve(data);
        });
    });
}

async function checkVisit (ip, M) {
    const VisitTimes = await getCache(ip);
    await client.incr(ip); // add visit times
    // console.log(VisitTimes);
    if (VisitTimes == null) {
        client.expire(ip, M);
    }
}

module.exports = { router: router };
