// midterm part 1
const express = require("express");
const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;
const dbSetInsert = require("./function").dbSetInsert;
const request = require("./function").Request;

router.use(express.static("public"));

router.get("/midtermPart1", async (req, res) => {
    const data = await request("http://13.113.12.180:1234/api/1.0/order/data");
    // console.log(data);
    const insertDataList = [];
    for (const i in data) {
        // console.log(data[i].list);
        for (const j in data[i].list) {
            const insertList = [];
            const orderId = parseInt(i) + 1;
            insertList.push(orderId, data[i].list[j].id, data[i].list[j].price, data[i].list[j].color.code, data[i].list[j].color.name, data[i].list[j].size, data[i].list[j].qty, data[i].total);
            insertDataList.push(insertList);
        }
    }
    // console.log(insertDataList);
    const sql = "INSERT INTO midterm_order_list (order_id, product_id, price, color_code, color_name, size, qty, total) VALUES ?";
    const reusltDB = await dbSetInsert(req, sql, [insertDataList]);
    console.log(reusltDB);

    res.send("Save data finished");
});

router.get("/deleteDB", async (req, res) => {
    const sql = "DELETE FROM midterm_order_list;";
    // const resultDB = await dbsql(req, sql);
    // console.log(resultDB);
    res.send("Clear DB finished!");
});

module.exports = { router: router };
