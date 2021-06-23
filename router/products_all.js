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

router.get("/products/all", (req, res) => {
    console.log('test_product')
    const queryPage = req.query.paging;
    const sqlSelect = "SELECT * FROM product_table";
    const sqlCount = "SELECT Count(*) FROM product_table;";
    queryMain(req, sqlSelect, sqlCount, queryPage).then((result) => {
        res.send(result);
    });
});

module.exports = { router: router };
