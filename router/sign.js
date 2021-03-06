// AppWoeksSchool w1p3 and w1p4
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

// Router setting
const router = express.Router();

// function setting
const createJWT = require("./function").createJWT;
const checkJWT = require("./function").checkJWT;
const callSQL = require("./function").callSQL;
const sendRequest = require("./function").sendRequest;
const responseConsist = require("./function").responseConsist;

// Middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(bodyParser.text());
router.use(cookieParser());

router.post("/user/signup", (req, res) => {
    let userdata = {};
    if (typeof (req.body) === "object") {
        // from front-end
        userdata = req.body;
    } else {
        // from postman
        userdata = JSON.parse(req.body);
    }

    async function signupMain () {
        const info = {};
        let responseResult = {};
        let sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
        let sqlresponse = await callSQL(req, sql);
        if (sqlresponse) {
            sqlresponse = "<h1>Email has been registered!</h1>";
            info.message = sqlresponse;
            responseResult.data = info;
            return responseResult;
        } else {
            // hash password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userdata.password, salt);

            // jwt token
            const payload = { name: userdata.name, email: userdata.email };
            const jtw = await createJWT(payload);

            sql = `INSERT INTO stylish.user_info_table (name, email, password) VALUES ('${userdata.name}', '${userdata.email}', '${hashedPassword}');`;
            let sqlresult = await callSQL(req, sql);
            sql = `SELECT * FROM stylish.user_info_table WHERE email = '${userdata.email}';`;
            sqlresult = await callSQL(req, sql);

            responseResult = responseConsist(jtw.token, jtw.expired, sqlresult[0].id, "facebook", userdata.name, userdata.email, "test");

            return JSON.stringify(responseResult);
        }
    }
    signupMain().then((answer) => {
        console.log("sing up");
        res.send(answer);
    });
});

router.post("/user/signin", (req, res) => {
    let singinData = {};
    if (typeof (req.body) === "object") {
        // from postman
        singinData = req.body;
    } else {
        // from front-end
        singinData = JSON.parse(req.body);
    }
    async function singinMain () {
        let responseResult = {};
        if ("access_token" in singinData && singinData.provider === "facebook") { // ????????????header?????????token? req.headers.access_token
            // from postman

            const fbTokenURL = singinData.access_token;
            const userInfo = await sendRequest(fbTokenURL);

            const payload = { name: userInfo.name, email: userInfo.email, provider: singinData.provider, picture: userInfo.picture.data.url };
            const jtw = await createJWT(payload);

            responseResult = responseConsist(jtw.token, jtw.expired, userInfo.id, singinData.provider, userInfo.name, userInfo.email, userInfo.picture.data.url);
            return JSON.stringify(responseResult);
        }

        const sql = `SELECT * FROM stylish.user_info_table WHERE email = '${singinData.email}';`; // haven't finshed checking email
        const sqlresult = await callSQL(req, sql);
        const result = await bcrypt.compare(singinData.password, sqlresult[0].password);
        if (result) {
            // jwt token
            const payload = { name: sqlresult[0].name, email: singinData.email, userType: sqlresult[0].userType }; // sqlresult[0].userType??????????????????(admin or ??????)
            const jtw = await createJWT(payload);

            // ?????????????????????????????????provider? ??????bug
            responseResult = responseConsist(jtw.token, jtw.expired, sqlresult[0].id, singinData.provider, sqlresult[0].name, singinData.email, "test");

            return JSON.stringify(responseResult);
        } else {
            const message = "<h1>Password or email is wrong!</h1>"; // ????????????check email sql??????????????????
            const info = {};
            info.message = message;
            responseResult.data = info;
            return JSON.stringify(responseResult);
        }
    }
    singinMain().then((answer) => {
        console.log("sing in");
        res.send(answer);
    });
});

router.get("/user/profile", (req, res) => {
    const responseResult = {};
    const info = {};

    const encryptedToken = req.headers.authorization;
    const JWTtoken = checkJWT(encryptedToken);
    if (JWTtoken === 1) { // Token is wrong
        res.send(JWTtoken.toString());
        return;
    } else if (JWTtoken === 2) { // Token expired!
        res.send(JWTtoken.toString());
        return;
    } else if (JWTtoken === 0) { // undefined (not signin)
        res.send(JWTtoken.toString());
        return;
    } else {
        if (JWTtoken.provider) {
            info.provider = JWTtoken.provider;
        } else {
            info.provider = "native";
        }
        info.name = JWTtoken.name;
        info.email = JWTtoken.email;
        // console.log(JWTtoken.email);
        if (JWTtoken.picture) {
            info.picture = JWTtoken.picture;
        } else {
            info.picture = "not exist";
        }
        responseResult.data = info;

        async function checkUserInfo () {
            const sql = `SELECT * FROM stylish.user_info_table WHERE email = '${JWTtoken.email}';`;
            const sqlresponse = await callSQL(req, sql);
            return (sqlresponse);
        }
        checkUserInfo().then((result) => {
            if (result.length >= 1) {
                console.log("??????/????????????!"); // ready to redirect
                responseResult.message = "??????/????????????!";
                responseResult.userType = JWTtoken.userType; // ?????????????????????(admin)?????????
                responseResult.userPass = "pass"; // ????????????(????????????????????????)
                responseResult.token = encryptedToken.split(" ")[1];
                res.send(JSON.stringify(responseResult));
            }
        });
    }
    console.log("in profile");
});

module.exports = { router: router };
