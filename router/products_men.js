// AppWoeksSchool w1p1
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" });

// Router setting
const router = express.Router();

// function setting
const queryMain = require("./function").queryMain;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());

router.get("/products/men", (req, res) => {
    const queryCatagory = "men";
    const queryPage = req.query.paging;
    // console.log(queryPage)
    const sqlSelect = `SELECT * FROM product_table WHERE catagory = '${queryCatagory}'`;
    const sqlCount = `SELECT Count(*) FROM product_table WHERE catagory = '${queryCatagory}'`;
    queryMain(req, sqlSelect, sqlCount, queryPage).then((result) => {
        res.send(result);
    });
});

module.exports = { router: router };
