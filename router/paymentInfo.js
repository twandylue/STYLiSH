// AppWoeksSchool w4_pre
const express = require("express");

const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;

router.use(express.static("public"));

router.get("/order/payments", (req, res) => {
    async function calTotal () {
        const sql = "SELECT user_id, total FROM order_table;";
        const result = await dbsql(req, sql);
        const user = {};
        const ans = [];
        result.forEach(function (ele) {
            if (!user[ele.user_id]) {
                user[ele.user_id] = { user_id: ele.user_id, total: 0 };
                ans.push(user[ele.user_id]);
            }
            user[ele.user_id].total += ele.total;
        });
        const response = {};
        response.data = ans;
        return (response);
    }
    calTotal().then((response) => {
        res.send(response);
    });
});

module.exports = { router: router };
