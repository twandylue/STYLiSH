// AppWoeksSchool w0p3
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const redis = require("redis");
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" });

// set storage engine
const storageEng = multer.diskStorage({
    // destination為保留字
    // destination: './public/upload_pics/',
    destination: "./public/upload_images/",
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
const uploadMain = require("./function").uploadMain;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
router.use(express.static("public"));

const fields = [{ name: "main_image", maxCount: 1 }, { name: "images", maxCount: 3 }];
router.post("/admin/upload", upload.fields(fields), (req, res) => {
    const id = parseInt(req.body.id);
    const price = parseInt(req.body.price);
    // eslint-disable-next-line camelcase
    const { catagory, title, description, texture, wash, place, note, story, sizes, name, code } = req.body;
    // eslint-disable-next-line camelcase
    const { color_code_1, color_code_2, color_code_3, size_1, size_2, size_3, stock_1, stock_2, stock_3 } = req.body;

    class Variants {
        // eslint-disable-next-line camelcase
        constructor (id, color_code, size, stock) {
            this.id = parseInt(id);
            // eslint-disable-next-line camelcase
            this.color_code = color_code;
            this.size = size;
            this.stock = parseInt(stock);
        }
    }

    const variant = [];
    variant[0] = new Variants(id, color_code_1, size_1, stock_1);
    variant[1] = new Variants(id, color_code_2, size_2, stock_2);
    variant[2] = new Variants(id, color_code_3, size_3, stock_3);

    const upload = { id: id, price: price, catagory: catagory, title: title, description: description, texture: texture, wash: wash, place: place, note: note, story: story, sizes: sizes, name: name, code: code, variant: variant, image_files: req.files };
    console.log(upload);
    console.log(req.files);
    uploadMain(req, upload).then(() => { // 應該把只用到一次的function移進此js內
        client.flushdb(); // clear all cache
        res.redirect("/response-message/products-upload-success");
    });
});

module.exports = { router: router };
