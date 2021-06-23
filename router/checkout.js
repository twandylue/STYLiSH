// AppWoeksSchool w2p1 and w2p2
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const TapPay = require("tappay-nodejs");
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" }); // 路徑會有問題

// Router setting
const router = express.Router();

// function setting
const dbSetInsert = require("./function").dbSetInsert;
const callSQL = require("./function").callSQL;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());
// router.use(express.static('public')); // 可能會有問題

// -- w2p1 and w2p2
router.post("/order/checkout", (req, res) => {
    let orderData = {};
    if (typeof (req.body) === "object") {
        // from postman
        orderData = req.body;
    } else {
        // from front-end
        orderData = JSON.parse(req.body);
    }

    async function orderInsertMysql () {
        const { shipping, payment, subtotal, freight, total } = orderData.order;
        const { name, phone, email, address, time } = orderData.order.recipient;
        const orderInfo = {
            paid: 0,
            shipping: shipping,
            payment: payment,
            subtotal: subtotal,
            freight: freight,
            total: total,
            name: name,
            phone: phone,
            email: email,
            address: address,
            time: time
        };
        const orderSQL = "INSERT INTO stylish.order_table SET ?";
        const result = await dbSetInsert(req, orderSQL, orderInfo); // INSERT INTO order_table
        // console.log(result);
        const orderID = result.insertId; // orderID in mysql
        for (let i = 0; i < orderData.order.list.length; i++) { // 注意效能 for loop
            const { id, name, price, size, qty } = orderData.order.list[i];
            const orderListInfo = {
                order_id: orderID,
                id: id,
                name: name,
                price: price,
                color_code: orderData.order.list[i].color.code,
                color_name: orderData.order.list[i].color.name,
                size: size,
                quantity: qty
            };
            const orderSQL = "INSERT INTO stylish.order_list_table SET ?";
            console.log(orderListInfo); // checkout robot
            // eslint-disable-next-line no-unused-vars
            const result = await dbSetInsert(req, orderSQL, orderListInfo); // INSERT INTO order_list_table
            // console.log(result)
        }
        console.log("order_id :" + orderID); // checkout robot

        return (orderID);
    }
    orderInsertMysql().then((orderID) => {
        TapPay.initialize({
            partner_key: process.env.partner_key,
            env: "sandbox"
        });

        const paymentInfo = {
            prime: orderData.prime,
            merchant_id: "AppWorksSchool_CTBC",
            amount: 1,
            currency: "TWD",
            details: "An apple and a pen.",
            cardholder: {
                phone_number: "+886923456789",
                name: "王小明",
                email: "LittleMing@Wang.com"
            },
            remember: true
        };
        console.log(paymentInfo); // checkout robot
        // Callback Style
        TapPay.payByPrime(paymentInfo, (_error, result) => { // error to _error by linter
            // console.log(result.status);
            if (result.status !== 0) {
                console.log(result.msg);
                res.send(result.msg);
            } else if (result.status === 0) {
                const updatePaidSQL = `UPDATE stylish.order_table SET paid = 1 WHERE order_id = ${orderID};`; // 效能差 一次只能處理一筆
                const updatePaid = callSQL(req, updatePaidSQL);
                updatePaid.then(() => {
                    const response = {
                        data: {
                            number: orderID.toString()
                        }
                    };
                    console.log(response); // checkout robot
                    res.send(JSON.stringify(response));
                });
            }
        });
    });
});

module.exports = { router: router };
