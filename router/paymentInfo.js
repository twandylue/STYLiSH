// AppWoeksSchool w4_pre
const express = require("express");

const router = express.Router();

// function setting
const dbsql = require("./function").dbsql;

router.use(express.static("public"));

router.get("/order/payments", (req, res) => {
    async function calTotal () {
        // =================type 1================= forEach
        const sql = "SELECT user_id, total FROM order_table;";
        const result = await dbsql(req, sql);
        // const result = [ // for test
        //     { user_id: 1, total: 123 },
        //     { user_id: 2, total: 321 },
        //     { user_id: 3, total: 111 },
        //     { user_id: 2, total: 234 }
        // ];
        const user = {};
        const ans = [];
        // console.log(result);
        result.forEach(function (ele) {
            // console.log("================");
            // console.log(user);
            if (!user[ele.user_id]) {
                user[ele.user_id] = { user_id: ele.user_id, total: 0 };
                ans.push(user[ele.user_id]);
            }
            user[ele.user_id].total += ele.total;
        });
        // console.log(ans);

        // result.forEach(function (element) { // 另種寫法
        //     console.log(this[element.user_id]);
        //     if (!this[element.user_id]) {
        //         this[element.user_id] = { user_id: element.user_id, total: 0 };
        //         ans.push(this[element.user_id]);
        //     }
        //     this[element.user_id].total += element.total;
        // }, Object.create(null));
        // =================type 1=================

        // // =================type 2================= Group by
        // const sql = "SELECT user_id, SUM(total) FROM stylish.order_table GROUP BY user_id;";
        // const ans = await dbsql(req, sql);
        // // console.log(ans);
        // // =================type 2=================

        // // =================type 3================= map
        // const sql = "SELECT user_id, total FROM order_table;";
        // const result = await dbsql(req, sql);
        // const obj = {};
        // const ans = [];
        // result.map((element) => {
        //     // const obj = {};
        //     if (!obj[element.user_id]) {
        //         obj[element.user_id] = { user_id: element.user_id, total: 0 };
        //         ans.push(obj[element.user_id]);
        //     }
        //     obj[element.user_id].total += element.total;
        //     return (obj);
        // });
        // // console.log(ans);
        // // =================type 3=================

        // =================type 4================= reduce
        // const sql = "SELECT user_id, total FROM order_table;";
        // const result = await dbsql(req, sql);
        // const obj = result.reduce((a, c) => {
        //     if (c.user_id in a) {
        //         a[c.user_id] += c.total;
        //     } else {
        //         a[c.user_id] = 0;
        //     }
        //     return (a);
        // }, {});
        // const ans = [];
        // for (const i in obj) {
        //     ans.push({ user_id: i, total: obj[i] });
        // }
        // -------
        // const arr = result.reduce((a, c) => {
        //     if (a[c.user_id - 1] === undefined) {
        //         a[c.user_id - 1] = c.total;
        //     } else {
        //         a[c.user_id - 1] += c.total;
        //     }
        //     return (a);
        // }, []);
        // // console.log(arr);
        // const ans = [];
        // for (const i in arr) {
        //     ans.push({ user_id: parseInt(i) + 1, total: arr[i] });
        // }

        // =================type 4=================

        // =================type 5================= new Map
        // const sql = "SELECT user_id, total FROM order_table;";
        // const result = await dbsql(req, sql);
        // const obj = new Map();
        // for (const i in result) {
        //     if (obj[result[i].user_id] !== undefined) {
        //         obj[result[i].user_id] += result[i].total;
        //     } else {
        //         obj[result[i].user_id] = result[i].total;
        //     }
        // }
        // // console.log(obj);
        // const ans = [];
        // for (const i in obj) {
        //     ans.push({ user_id: i, total: obj[i] });
        // }
        // =================type 5=================
        const response = {};
        response.data = ans;
        return (response);
    }
    calTotal().then((response) => {
        res.send(response);
    });
});

module.exports = { router: router };
