// const xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//             const userStatus = JSON.parse(xhr.responseText);
//             console.log(userStatus);
//             if (userStatus === 1) {
//                 // const mainContent = document.querySelector("#main__content");
//                 // // mainContent.classList.add("display__status");
//                 // // console.log(mainContent);
//                 // mainContent.style = "show";
//                 alert("尚未登入");
//                 window.location.href = "/admin/sign.html";
//             } else if (userStatus === 2) {
//                 alert("登入驗證過期 請重新登入");
//                 window.location.href = "/admin/sign.html";
//             } else if (userStatus === 0) {
//                 alert("尚未登入");
//                 window.location.href = "/admin/sign.html";
//             } else if (userStatus.userType === "admin") {
//                 const getProductsUpload = new XMLHttpRequest();
//                 getProductsUpload.onreadystatechange = function () {
//                     if (getProductsUpload.readyState === 4) {
//                         if (getProductsUpload.status === 200) {
//                             // do something
//                         } else {
//                             alert(getProductsUpload.status);
//                         }
//                     }
//                 };
//                 getProductsUpload.open("GET", "/admin/product.html");
//                 getProductsUpload.send();

//                 // console.log("test");
//             } else {
//                 alert("Permission denied!!");
//                 const mainContent = document.querySelector("#main__content");
//                 mainContent.style = "none";
//             }
//         } else {
//             alert(xhr.status);
//         }
//     }
// };
// // xhr.open("GET", "/test"); // to profile
// xhr.open("GET", "/api/1.0/user/profile"); // for local test
// // xhr.open("GET", "/api/1.0/user/profile"); // for EC2
// const accessToken = localStorage.getItem("access_token");
// xhr.setRequestHeader("Authorization", "bearer " + accessToken);
// xhr.send();
