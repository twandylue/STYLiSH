// AppWoeksSchool w2p2 combine
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: process.cwd() + "/DOTENV/config.env" });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "pug");

// set DB function (global function)
// function DBConnection () {
//     const db = mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_DATABASE
//     });
//     // MySQL Connect test
//     db.connect((err) => {
//         if (err) throw err;
//         // eslint-disable-next-line no-console
//         console.log("MySQL connected!");
//     });
//     return db;
// }
// app.set("db", new DBConnection());

// set DB pool

function DBConnection () {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true, // 無可用連線時是否等待pool連線釋放(預設為true)
        connectionLimit: 15 // 連線池可建立的總連線數上限(預設最多為60個連線數)
    });
    // MySQL Connect test
    pool.getConnection((err) => {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log("MySQL(pool) connected!");
    });
    return pool;
}
app.set("db", new DBConnection());

// ===set product api router===
// w0p3
const apiRouterProductsUpload = require("./router/products_upload").router;
// app.use(`/api/${process.env['API_VERSION']}`, apiRouterProductsUpload);
app.use(apiRouterProductsUpload);

// w1p1
const apiRouterProductsAll = require("./router/products_all").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsAll);
const apiRouterProductsMen = require("./router/products_men").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsMen);
const apiRouterProductsWomen = require("./router/products_women").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsWomen);
const apiRouterProductsAccessories = require("./router/products_accessories").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsAccessories);

// w1p2
const apiRouterProductsSearch = require("./router/products_search").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsSearch);
const apiRouterProductsDetails = require("./router/products_details").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterProductsDetails);

// w1p3 and w1p4
const apiRouteSign = require("./router/sign").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouteSign);

// w1p5
const apiRouterCampaign = require("./router/campaign").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterCampaign);
const apiRouterCampaignUpload = require("./router/campaign_upload").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouterCampaignUpload);

// w2p2 checkout
const apiRouteCheckout = require("./router/checkout").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouteCheckout);

// w4_pre cal payments info
const apiRouteCalPaymentInfo = require("./router/paymentInfo").router;
app.use(`/api/${process.env.API_VERSION}`, apiRouteCalPaymentInfo);

// midterm
const midtermGetandSaveData = require("./router/midterm_GetandSaveData").router;
app.use(`/api/${process.env.API_VERSION}`, midtermGetandSaveData);

const midtermCalforDashboard = require("./router/midterm_CalforDashboard").router;
app.use(`/api/${process.env.API_VERSION}`, midtermCalforDashboard);

// ===provide html or pug===
//= ===================================看這邊
// w0p3 products upload form
app.get("/admin/product.html", (req, res) => {
    // res.render("product");
    const encryptedToken = req.headers.authorization;
    const JWTtoken = checkJWT(encryptedToken);
    if (JWTtoken.userType === "admin") {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/product_upload.html"));
    } else {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/checkUserTypeProduct.html"));
    }
});
//= ====================================看這邊

// w1p4 signin and signup
app.get("/admin/sign.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/sign.html"));
});

//= ===================================看這邊
// w1p5 campaign upload form
app.get("/admin/campaign.html", (req, res) => {
    // console.log('check campaign_upload_page'); // check Arthur robot.
    // res.render("campaign_upload_page");
    const encryptedToken = req.headers.authorization;
    const JWTtoken = checkJWT(encryptedToken);
    if (JWTtoken.userType === "admin") {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/campaign_upload.html"));
    } else {
        // eslint-disable-next-line node/no-path-concat
        res.sendFile(path.join(__dirname + "/public/checkUserTypeCampaign.html"));
    }
});
//= ===================================看這邊

// w2p1 checkout.html
app.get("/admin/checkout.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/checkout.html")); // __dirname有問題 還未更正
});

// w2p3 index.html
app.get(["/", "/index.html"], (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/index.html"));
    console.log("test");
});

// w2p4 product.html
app.get("/product.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/pruduct.html"));
});

// w2p5 cart.html
app.get("/cart.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/cart.html"));
});

// w2p5 thankyou.html
app.get("/thankyou.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/thankyou.html"));
});

// w2p5 member.html
app.get("/member.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/member.html"));
});

// w2p5 profile.html for robot checkout
app.get("/profile.html", (req, res) => {
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/member.html"));
});

// midterm dashboard
app.get("/admin/dashboard.html", (req, res) => {
    console.log("MIDTERM!!!");
    // eslint-disable-next-line node/no-path-concat
    res.sendFile(path.join(__dirname + "/public/dashboard.html"));
});

// ===response message===
app.get("/response-message/products-upload-success", (req, res) => {
    res.render("info_products");
});

app.get("/response-message/campaign-upload-success", (req, res) => {
    res.render("info_campaign");
});

// ===for test===
// app.get("/", (req, res) => {
//     res.send("<h1>Hello, My Server!</h1>");
// });

app.get("/insertDB", (req, res) => {
    // insert data into database
    async function insertData () {
        const number = parseInt(req.query.number);
        const dataArr = [];
        for (let i = 0; i < number; i++) {
            const data = [];
            const paid = getRandomInt(0, 1);
            const userID = getRandomInt(1, 5);
            const totalPrice = getRandomInt(100, 1000);
            const subtotal = totalPrice - 60;
            data.push(paid, "delivery", "credit_card", subtotal, 60, totalPrice, "test", "0987654321", "test@gmail.com", "市政府站", "morning", userID);
            dataArr.push(data);
        }
        // console.log(dataArr);
        const sqlTest = "INSERT INTO stylish.order_table (paid, shipping, payment, subtotal, freight, total, name, phone, email, address, time, user_id) VALUES ?";
        const resultdb = await dbSetInsert(sqlTest, [dataArr]);
        console.log(resultdb);
    }
    insertData();
    res.send("insert finished");
});

app.get("/deleteOrderTable", async (req, res) => {
    const sql = "DELETE FROM order_table;";
    await dbsql(sql);
    res.send("delete finished");
});

// 設置port:3000的server
app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("running...");
});

const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_KEY;
function checkJWT (encryptedToken) {
    if (encryptedToken === undefined) {
        return (0);
    }
    encryptedToken = encryptedToken.split(" ")[1];

    const decryptJWT = jwt.decode(encryptedToken, secretkey);
    if (decryptJWT) {
        return (decryptJWT);
    } else if (decryptJWT === null) {
        console.log("Token is wrong");
        return (1);
    } else if (Date.now() > decryptJWT.exp * 1000) {
        console.log("Token expired!");
        return (2);
    }
}

function dbsql (sql) {
    const dbReturn = new Promise((resolve, reject) => {
        app.get("db").query(sql, (err, result) => {
            // if (err) throw err;
            if (err) reject(err);
            resolve(result);
        });
    });
    return dbReturn;
}

function dbSetInsert (sql, info) {
    return new Promise((resolve, reject) => {
        app.get("db").query(sql, info, (err, result) => {
            if (err) resolve(err);
            if (result) resolve(result);
        });
    });
}

function getRandomInt (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
