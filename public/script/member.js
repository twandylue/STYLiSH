updateCartNumber();
toProfile("請先登入");

const signout = document.querySelector("#signout");
signout.addEventListener("click", (event) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("cart");
    localStorage.removeItem("variants");
    toProfile("BYE!");
});

function updateCartNumber () {
    const cartNumber = document.querySelector("#cart_number");
    const cartNumberTitle = document.querySelector("#title");
    if (localStorage.getItem("cart")) {
        const variantsNumber = JSON.parse(localStorage.getItem("cart"));
        if (variantsNumber == null) {
            cartNumber.innerHTML = 0;
        } else {
            cartNumber.innerHTML = variantsNumber.length;
            if (cartNumberTitle !== null) {
                cartNumberTitle.innerHTML = "購物車(" + variantsNumber.length + ")";
            }
        }
    } else {
        const cartInit = [];
        localStorage.setItem("cart", JSON.stringify(cartInit)); // initialize cart
        cartNumber.innerHTML = 0;
    }
}

function toProfile (message) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const userInfo = JSON.parse(xhr.responseText);
            console.log(userInfo.userType); //
            if (parseInt(userInfo) === 1) {
                alert(message);
                window.location.href = "/admin/sign.html";
            } else if (parseInt(userInfo) === 2) {
                alert("登入驗證過期 請重新登入");
                window.location.href = "/admin/sign.html";
            } else if (parseInt(userInfo) === 0) {
                alert("請註冊後再購買");
                window.location.href = "/admin/sign.html";
            } else if (userInfo.userType === "admin") {
                const productsUpload = document.querySelector("#upload__Products");
                productsUpload.style = "show";
                const campaignsUpload = document.querySelector("#upload__Campaigns");
                campaignsUpload.style = "show";
                const member = document.querySelector(".member__detail");
                member.innerHTML = "<h3>姓名: " + userInfo.data.name + "</h3><br><h3>email: " + userInfo.data.email + "</h3>";
                const welcome = document.querySelector("#welcome");
                welcome.innerHTML = "歡迎! <strong>管理者</strong>: " + userInfo.data.name;
            } else {
                const member = document.querySelector(".member__detail");
                member.innerHTML = "<h3>姓名: " + userInfo.data.name + "</h3><br><h3>email: " + userInfo.data.email + "</h3>";
                const welcome = document.querySelector("#welcome");
                welcome.innerHTML = "歡迎! 使用者: " + userInfo.data.name;
            }
        }
    };
    xhr.open("GET", "/api/1.0/user/profile"); // for local test and EC2
    xhr.setRequestHeader("Content-Type", "application/json");
    const accessToken = localStorage.getItem("access_token");
    xhr.setRequestHeader("Authorization", "bearer " + accessToken);
    xhr.send();
}
