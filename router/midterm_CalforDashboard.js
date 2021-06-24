// midterm part 2
const express = require("express");
const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;
const dbSetInsert = require("./function").dbSetInsert;

router.get("/midtermTest", (req, res) => {
    console.log("test");
    res.send("test");
});

router.get("/TotalRevenue", async (req, res) => {
    const sql = "SELECT order_id, total FROM midterm_order_list;";
    const resultDB = await dbsql(req, sql);
    const obj = {};
    for (const i in resultDB) {
        obj[resultDB[i].order_id] = resultDB[i].total;
    }

    let totalSum = 0;
    for (const i in obj) {
        totalSum += obj[i];
    }
    const ans = {
        data: {
            "Total Revenue": totalSum
        }
    };
    res.send(ans);
});

router.get("/PieChart", async (req, res) => {
    const sql = "SELECT color_name, color_code, SUM(qty) FROM midterm_order_list GROUP BY color_name;";
    const resultDB = await dbsql(req, sql);
    const ans = {
        data: resultDB
    };
    res.send(ans);
});

router.get("/Histograms", async (req, res) => {
    const sql = "SELECT price, qty FROM midterm_order_list";
    const resultDB = await dbsql(req, sql);
    const arr = [];
    const arrTest = [];
    for (const i in resultDB) {
        for (let j = 0; j < resultDB[i].qty; j++) {
            arrTest.push(resultDB[i].price);
        }
        arr.push(resultDB[i].price);
    }
    const ans = {
        data: arrTest
    };
    res.send(ans);
});

router.get("/BarChart", async (req, res) => {
    let sql = "SELECT product_id, SUM(qty) FROM midterm_order_list GROUP BY product_id ORDER BY SUM(qty) DESC LIMIT 5";
    const max5 = await dbsql(req, sql);
    const max5Ids = max5.map(element => element.product_id);

    sql = "SELECT product_id, size, SUM(qty) FROM midterm_order_list WHERE product_id IN ? GROUP BY product_id, size ORDER BY product_id;";
    const resultDB = await dbSetInsert(req, sql, [[max5Ids]]);

    const objSize = new Map();
    for (const i in resultDB) {
        if (objSize.has(resultDB[i].size)) {
            const arr = objSize.get(resultDB[i].size);
            arr.push(resultDB[i]);
            objSize.set(resultDB[i].size, arr);
        } else {
            objSize.set(resultDB[i].size, [resultDB[i]]);
        }
    }

    const keys = objSize.keys();
    const response = [];
    for (const key of keys) {
        const count = [];
        for (const i in max5Ids) {
            for (const j in objSize.get(key)) {
                if ((objSize.get(key))[j].product_id === max5Ids[i]) {
                    count.push((objSize.get(key))[j]["SUM(qty)"]);
                }
            }
        }
        response.push({
            idList: max5Ids,
            count: count,
            size: key
        });
    }
    const arr = [];
    for (const i in response) {
        arr.push(response[response.length - 1 - i]);
    }
    const ans = {
        data: arr
    };
    res.send(ans);
});

module.exports = { router: router };
