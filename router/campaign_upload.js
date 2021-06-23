// AppWoeksSchool w1p5
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const redis = require("redis");
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" });

// set storage engine
const storageEng = multer.diskStorage({
    // destination為保留字
    destination: "./public/upload_pics/",
    filename: function (req, file, callback) {
        // callback(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
        callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});

// input upload
const upload = multer({
    storage: storageEng
});

// redis port setting
const REDISPORT = process.env.REDIS_PORT || 6379;

// create redis client
const client = redis.createClient(REDISPORT);

// Router setting
const router = express.Router();

// function setting
const imageURL = require("./function").imageURL;
const dbsql = require("./function").dbsql;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static("public"));

const fieldsCampaign = [{ name: "campaign_image", maxCount: 1 }];
router.post("/admin/campaign_upload", upload.fields(fieldsCampaign), (req, res) => { // 可以獨立
    // eslint-disable-next-line camelcase
    async function uploadCampaign (upload_var) {
        if (upload_var.id && upload_var.story && upload_var.campaign_image_path) {
            const checkProduct = `SELECT * FROM product_table WHERE id = ${upload_var.id}`;
            const insertCampaign = `INSERT INTO campaign_table (product_id, story, picture) VALUES (${upload_var.id}, '${upload_var.story}', '${upload_var.campaign_image_path}');`;
            const sqlReturn = await dbsql(req, checkProduct);
            // console.log(sqlReturn.length)
            if (sqlReturn.length === 0) {
                // product_id not exist.
            } else {
                // eslint-disable-next-line no-unused-vars
                const insertReturn = await dbsql(req, insertCampaign);
                // console.log(insertReturn);
            }
            console.log("Update campaign.");
        }
    }
    // console.log('img: ');
    // console.log(req.files)

    const { id, story } = req.body;
    const campaignImagePath = imageURL(req.files.campaign_image[0].path);
    const upload = { id: id, story: story, campaign_image_path: campaignImagePath };
    console.log("upload_var: "); // check Arthur robot.
    console.log(upload); // check Arthur robot.
    uploadCampaign(upload).then(() => { // 要不要移到function.js? ans: 不用 只用一次
        client.flushdb(); // clear all cache
        res.redirect("/response-message/campaign-upload-success");
    });
});

module.exports = { router: router };
