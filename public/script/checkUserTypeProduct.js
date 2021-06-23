const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const userStatus = JSON.parse(xhr.responseText);
            console.log(userStatus);
            if (userStatus === 1) {
                alert("尚未登入");
                window.location.href = "/admin/sign.html";
            } else if (userStatus === 2) {
                alert("登入驗證過期 請重新登入");
                window.location.href = "/admin/sign.html";
            } else if (userStatus === 0) {
                alert("尚未登入");
                window.location.href = "/admin/sign.html";
            } else if (userStatus.userType === "admin") { // 如果使用者為admin 執行以下程序
                const getProductsUpload = new XMLHttpRequest();
                getProductsUpload.onreadystatechange = function () {
                    if (getProductsUpload.readyState === 4) {
                        if (getProductsUpload.status === 200) {
                            // do something
                            const mainContent = document.querySelector("#main__content"); // 將透過/admin/product.html拿到的html檔案，塞入#main__content標籤之內
                            mainContent.innerHTML = getProductsUpload.responseText;
                        } else {
                            alert(getProductsUpload.status);
                        }
                    }
                };
                getProductsUpload.open("GET", "/admin/product.html");
                const adminAccessToken = userStatus.token;
                getProductsUpload.setRequestHeader("Authorization", "bearer " + adminAccessToken);
                getProductsUpload.send();
            } else {
                alert("Permission denied!! 您不是管理者!!!");
                window.location.href = "/";
            }
        } else {
            alert(xhr.status);
        }
    }
};
xhr.open("GET", "/api/1.0/user/profile"); // for local test and EC2
// xhr.open("GET", "http://35.73.76.64/api/1.0/user/profile"); // for EC2
const accessToken = localStorage.getItem("access_token");
xhr.setRequestHeader("Authorization", "bearer " + accessToken);
xhr.send();
