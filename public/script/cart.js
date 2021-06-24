updateCartNumber(); // update cart number
const cart = JSON.parse(localStorage.getItem("cart"));
const items = document.querySelector("#items");
for (const i in cart) { // create element in main body
    const item = document.createElement("div");
    item.className = "item";
    const itemImage = document.createElement("img");
    itemImage.className = "item__image";
    itemImage.src = cart[i].image;

    const itemDetail = document.createElement("div");
    itemDetail.className = "item__detail";
    const itemName = document.createElement("div");
    itemName.className = "item__name";
    itemName.innerHTML = cart[i].name;
    const itemID = document.createElement("div");
    itemID.className = "item__id";
    itemID.innerHTML = cart[i].id;
    const itemColor = document.createElement("div");
    itemColor.className = "item__color";
    itemColor.innerHTML = "顏色|" + cart[i].color.name;
    const itemSize = document.createElement("div");
    itemSize.className = "item__size";
    itemSize.innerHTML = "尺寸|" + cart[i].size;
    itemDetail.append(itemName, itemID, itemColor, itemSize);

    const itemQuantity = document.createElement("div");
    itemQuantity.className = "item__quantity";
    const mobileText = document.createElement("div");
    mobileText.className = "mobile-text";
    mobileText.innerHTML = "數量";
    const mobileSelect = document.createElement("select");
    mobileSelect.className = "SelectNumber";
    for (let j = 0; j < cart[i].stock; j++) {
        const option = document.createElement("option");
        option.value = j + 1;
        option.innerHTML = j + 1;
        if (option.value === cart[i].qty) {
            option.selected = "selected";
        }
        mobileSelect.append(option);
    }
    itemQuantity.append(mobileText, mobileSelect);

    const itemPrice = document.createElement("div");
    itemPrice.className = "item__price";
    const itemPriceMobileText = document.createElement("div");
    itemPriceMobileText.className = "mobile-text";
    itemPriceMobileText.innerHTML = "單價";
    const price = document.createElement("div");
    price.innerHTML = "NT." + (cart[i].price).toString();
    itemPrice.append(itemPriceMobileText, price);

    const itemSubtotal = document.createElement("div");
    itemSubtotal.className = "item__subtotal";
    itemSubtotal.innerHTML = "NT." + (cart[i].qty * cart[i].price).toString();

    const itemRemove = document.createElement("div");
    itemRemove.className = "item__remove";
    const removeImg = document.createElement("img");
    removeImg.src = "./images/cart-remove.png";
    itemRemove.append(removeImg);

    item.append(itemImage, itemDetail, itemQuantity, itemPrice, itemSubtotal, itemRemove);
    items.append(item);

    // update subtotal
    updateSubtotal();
    // update total
    updateTotal();
}

const selectChange = document.querySelector("#items");
selectChange.addEventListener("change", (event) => { // uapdate item subtotal
    const newNumbers = document.querySelectorAll("#items option:checked");
    for (let i = 0; i < newNumbers.length; i++) { // i can be used cross different parent element
        const newItemSubtotals = document.querySelectorAll("#items .item__subtotal");
        newItemSubtotals[i].innerHTML = "NT." + (newNumbers[i].value * cart[i].price).toString(); // cart[i] 危險 待改 可改成item__price
        const newQty = JSON.parse(localStorage.getItem("cart"));
        newQty[i].qty = newNumbers[i].value;
        localStorage.setItem("cart", JSON.stringify(newQty));
    }

    // update subtotal
    updateSubtotal();
    // update total
    updateTotal();
});

const itemDelete = document.querySelectorAll("#items .item__remove");
const newCart = JSON.parse(localStorage.getItem("cart"));
const map = new Map();
for (let i = 0; i < itemDelete.length; i++) {
    map.set(i, newCart[i]);
    itemDelete[i].addEventListener("click", (event) => {
        ((event.target).parentElement).parentElement.remove(); // remove element from HTML
        const newArr = [];
        map.set(i, "cancel");
        for (let i = 0; i < map.size; i++) {
            if (map.get(i) !== "cancel") {
                newArr.push(map.get(i));
            }
        }
        localStorage.setItem("cart", JSON.stringify(newArr));

        alert("移除該項商品!");
        // update cart number
        updateCartNumber();
        // update subtotal
        updateSubtotal();
        // update total
        updateTotal();
    });
}

const checkout = document.querySelector("#checkout");
checkout.addEventListener("click", (event) => {
    // check if user condition first
    const signXhr = new XMLHttpRequest();
    signXhr.onreadystatechange = function () {
        if (signXhr.readyState === 4) {
            if (signXhr.status === 200) {
                if (parseInt(signXhr.responseText) === 1) {
                    alert("請登入後再購買");
                    window.location.href = "/admin/sign.html";
                } else if (parseInt(signXhr.responseText) === 2) {
                    alert("登入驗證過期 請重新登入");
                    window.location.href = "/admin/sign.html";
                } else if (parseInt(signXhr.responseText) === 0) {
                    alert("請註冊後再購買");
                    window.location.href = "/admin/sign.html";
                } else {
                    const data = {};
                    const shipping = "delivery";
                    const payment = "credit_card";
                    const subtotalArr = (document.querySelector("#subtotal .value").innerHTML).match(/[0-9]/g);
                    let subtotal = "";
                    for (const i in subtotalArr) {
                        subtotal += subtotalArr[i];
                    }

                    const freightArr = (document.querySelector(".freight .value").innerHTML).match(/[0-9]/g);
                    let freight = "";
                    for (const i in freightArr) {
                        freight += freightArr[i];
                    }

                    const totalArr = (document.querySelector("#total .value").innerHTML).match(/[0-9]/g);
                    let total = "";
                    for (const i in totalArr) {
                        total += totalArr[i];
                    }

                    const name = (document.querySelector("#name")).value;
                    const phone = (document.querySelector("#phone")).value;
                    const email = (document.querySelector("#email")).value;
                    const address = (document.querySelector("#address")).value;

                    const morning = document.querySelector("#morning").checked;
                    const afternoon = document.querySelector("#afternoon").checked;
                    const anytime = document.querySelector("#anytime").checked;
                    let time = "";
                    if (morning) {
                        time = document.querySelector("#morning").value;
                    } else if (afternoon) {
                        time = document.querySelector("#afternoon").value;
                    } else if (anytime) {
                        time = document.querySelector("#anytime").value;
                    }
                    const recipient = {
                        name: name,
                        phone: phone,
                        email: email,
                        address: address,
                        time: time
                    };

                    const list = [];
                    const cartList = JSON.parse(localStorage.getItem("cart"));
                    for (const i in cartList) {
                        delete cartList[i].image;
                        delete cartList[i].stock;
                        list.push(cartList[i]);
                    }

                    function getPrime (data) {
                        return new Promise((resolve, reject) => {
                            // eslint-disable-next-line no-undef
                            TPDirect.card.getPrime(function (result) {
                                if (result.status !== 0) {
                                    alert("get prime error " + result.msg);
                                    return;
                                }
                                const tappayPrime = result.card.prime;
                                data = {
                                    prime: tappayPrime,
                                    order: {
                                        shipping: shipping,
                                        payment: payment,
                                        subtotal: parseInt(subtotal),
                                        freight: parseInt(freight),
                                        total: parseInt(total),
                                        recipient: recipient,
                                        list: list
                                    }
                                };
                                resolve(data);
                            });
                        });
                    }
                    getPrime(data).then((data) => {
                        const dataString = JSON.stringify(data);
                        const checkoutXhr = new XMLHttpRequest();
                        checkoutXhr.onreadystatechange = function () {
                            if (checkoutXhr.readyState === 4) {
                                if (checkoutXhr.status === 200) {
                                    const response = JSON.parse(checkoutXhr.responseText);

                                    const thankyouXhr = new XMLHttpRequest();
                                    thankyouXhr.onreadystatechange = function () {
                                        if (thankyouXhr.readyState === 4) {
                                            if (thankyouXhr.status === 200) {
                                                window.location.href = `/thankyou.html?number=${response.data.number}`;
                                            } else {
                                                alert(thankyouXhr.status);
                                            }
                                        }
                                    };
                                    thankyouXhr.open("GET", `/thankyou.html?number=${response.data.number}`); // for local test and EC2
                                    thankyouXhr.send();
                                } else {
                                    alert(checkoutXhr.status);
                                }
                            }
                        };
                        checkoutXhr.open("POST", "/api/1.0/order/checkout"); // // for local test and EC2
                        checkoutXhr.send(dataString);
                    });
                }
            } else {
                alert(signXhr.status);
            }
        }
    };
    signXhr.open("GET", "/api/1.0/user/profile"); // for // for local test and EC2
    signXhr.setRequestHeader("Content-Type", "application/json");
    const accessToken = localStorage.getItem("access_token");
    signXhr.setRequestHeader("Authorization", "bearer " + accessToken);
    signXhr.send();
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

function updateSubtotal () {
    const subtotal = document.querySelector("#subtotal .value");
    const itemSubtotal = document.querySelectorAll(".item__subtotal");
    let subtotalCost = 0;
    for (let i = 1; i < itemSubtotal.length; i++) {
        const cost = ((itemSubtotal[i].innerHTML).split("."))[1];
        subtotalCost += parseInt(cost);
    }
    subtotal.innerHTML = "NT.<span>" + subtotalCost + "</span>";
}

function updateTotal () {
    const freight = document.querySelector(".freight .value");
    const subtotal = document.querySelector("#subtotal .value");
    const freightCostArr = (freight.innerHTML).match(/[0-9]/g);
    let freightCost = "";
    for (const i in freightCostArr) {
        freightCost += freightCostArr[i];
    }
    const subtotalCostArr = (subtotal.innerHTML).match(/[0-9]/g);
    let subtotalCost = "";
    for (const i in subtotalCostArr) {
        subtotalCost += subtotalCostArr[i];
    }

    const totalCost = parseInt(freightCost) + parseInt(subtotalCost);
    const total = document.querySelector("#total .value");
    total.innerHTML = "NT.<span>" + totalCost + "</span>";
}
