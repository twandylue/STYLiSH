const queryParamsString = window.location.search;
const id = (queryParamsString.split("="))[1];

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            const { data } = response;
            async function detailUpload () {
                updateCartNumber(); // update cart number

                const Product = document.getElementById("product");
                const mainImage = document.createElement("img");
                mainImage.className = "product__main-image";
                mainImage.src = data.main_image;

                const detail = document.createElement("div");
                detail.className = "product__detail";
                const title = document.createElement("div");
                title.className = "product__title";
                title.innerHTML = data.title;
                const id = document.createElement("div");
                id.className = "product__id";
                id.innerHTML = data.id;
                const price = document.createElement("div");
                price.className = "product__price";
                price.innerHTML = "TWD." + data.price;

                // === set color
                const variants = document.createElement("div");
                variants.className = "product__variants";
                const variantColors = document.createElement("div");
                variantColors.className = "product__variant";
                const colorName = document.createElement("div");
                colorName.className = "product__variant-name";
                colorName.innerHTML = "顏色|";
                const colors = document.createElement("div");
                colors.className = "product__colors";
                colors.id = "colors";
                for (const i in data.colors) {
                    const color = document.createElement("div");
                    color.className = "product__color";
                    color.style.backgroundColor = "#" + `${data.colors[i].code}`;
                    colors.append(color);
                }

                // === set size
                const variantSizes = document.createElement("div");
                variantSizes.className = "product__variant";
                const sizeName = document.createElement("div");
                sizeName.className = "product__variant-name";
                sizeName.innerHTML = "尺寸|";
                const sizes = document.createElement("div");
                sizes.className = "product__sizes";
                sizes.id = "sizes";
                for (const i in data.sizes) {
                    const size = document.createElement("div");
                    size.className = "product__size";
                    size.innerHTML = `${data.sizes[i]}`;
                    sizes.append(size);
                }

                // === set qty
                const variantQuantity = document.createElement("div");
                variantQuantity.className = "product__variant";
                const quantityName = document.createElement("div");
                quantityName.className = "product__variant-name";
                quantityName.innerHTML = "數量|";
                const quantity = document.createElement("div");
                quantity.className = "product__quantity";
                const buttondecrease = document.createElement("button");
                buttondecrease.id = "decrement";
                buttondecrease.innerHTML = "-";
                const quantityInit = document.createElement("div");
                quantityInit.id = "quantity";
                quantityInit.innerHTML = 1;
                const buttonIncrease = document.createElement("button");
                buttonIncrease.id = "increment";
                buttonIncrease.innerHTML = "+";

                quantity.append(buttondecrease, quantityInit, buttonIncrease);
                variantColors.append(colorName, colors);
                variantSizes.append(sizeName, sizes);
                variantQuantity.append(quantityName, quantity);
                variants.append(variantColors, variantSizes, variantQuantity);

                const cartButton = document.createElement("button");
                cartButton.id = "add-to-cart";
                cartButton.innerHTML = "加入購物車";
                const note = document.createElement("div");
                note.className = "product__note";
                note.innerHTML = `${data.note}`;
                const texture = document.createElement("div");
                texture.className = "product__texture";
                texture.innerHTML = `${data.texture}`;
                const description = document.createElement("div");
                description.className = "product__description";
                description.innerHTML = `${data.description}`;
                const wash = document.createElement("div");
                wash.className = "product__wash";
                wash.innerHTML = `${data.wash}`;
                const place = document.createElement("div");
                place.className = "product__place";
                place.innerHTML = `${data.place}`;

                detail.append(title, id, price, variants, cartButton, note, texture, description, wash, place);

                const productInfo = document.createElement("div");
                productInfo.className = "seperator";
                productInfo.innerHTML = "更多產品資訊";
                const story = document.createElement("div");
                story.className = "product__story";
                story.innerHTML = `${data.story}`;
                Product.append(mainImage, detail, productInfo, story);
                for (const i in data.images) {
                    const image = document.createElement("img");
                    image.className = "product__image";
                    image.src = data.images[i];
                    Product.append(image);
                }
            }
            detailUpload().then(() => {
                const colorSelect = document.querySelector("#colors");
                colorSelect.addEventListener("click", (event) => {
                    const allColors = document.querySelectorAll(".product__color"); // reset color
                    for (const i in allColors) { // cancel selected color last time.
                        allColors[i].className = "product__color";
                    }
                    const allSizes = document.querySelectorAll(".product__size"); // reset size
                    for (const i in allSizes) { // cancel disable size last time
                        allSizes[i].className = "product__size";
                    }
                    const quantity = document.querySelector("#quantity"); // reset quantity
                    quantity.innerHTML = 1;

                    const colorChoose = event.target;
                    if (colorChoose.className === "product__color") {
                        colorChoose.classList.add("product__color--selected");
                    }
                    const color = colorChoose.style.backgroundColor;
                    const variantChoose = [];
                    for (const i in data.variants) {
                        if (color === hexToRGB("#" + data.variants[i].color_code)) {
                            variantChoose.push(data.variants[i]);
                        }
                    }

                    for (const i in variantChoose) { // disable size if there is no more stock
                        if (variantChoose[i].stock === 0) {
                            const sizeDisable = document.querySelectorAll(".product__size");
                            for (const j in sizeDisable) {
                                if (variantChoose[i].size === sizeDisable[j].innerHTML) {
                                    sizeDisable[j].className = "product__size product__size--disabled";
                                }
                            }
                        }
                    }
                    localStorage.setItem("variants", JSON.stringify(variantChoose));
                });

                const sizeSelect = document.querySelector("#sizes");
                sizeSelect.addEventListener("click", (event) => {
                    const allSizes = document.querySelectorAll(".product__size"); // reset size
                    for (const i in allSizes) { // cancel selected size last time.
                        if (allSizes[i].className === "product__size product__size--selected") {
                            allSizes[i].className = "product__size";
                        }
                    }
                    const quantity = document.querySelector("#quantity"); // reset quantity
                    quantity.innerHTML = 1;

                    const sizeChoose = event.target;
                    if (sizeChoose.className === "product__size") {
                        sizeChoose.classList.add("product__size--selected");
                    }
                });

                const quantityDecrement = document.querySelector("#decrement");
                quantityDecrement.addEventListener("click", (event) => {
                    const quantity = document.querySelector("#quantity");
                    if (parseInt(quantity.innerHTML) > 1) {
                        quantity.innerHTML = parseInt(quantity.innerHTML) - 1;
                    }
                });

                const quantityIncrement = document.querySelector("#increment");
                quantityIncrement.addEventListener("click", (event) => { // keypoint
                    let maxNumber = 0;
                    const quantity = document.querySelector("#quantity");
                    const variants = JSON.parse(localStorage.getItem("variants"));
                    for (const i in variants) {
                        const variantChoose = document.querySelector(".product__size--selected");
                        if (variantChoose.innerHTML === variants[i].size) {
                            maxNumber = variants[i].stock;
                        }
                    }

                    const colorSelected = document.querySelector(".product__color--selected");
                    if (colorSelected !== null && parseInt(quantity.innerHTML) >= 1 && parseInt(quantity.innerHTML) < maxNumber) {
                        quantity.innerHTML = parseInt(quantity.innerHTML) + 1;
                    }
                });
            });

            const addCart = document.querySelector("#add-to-cart");
            addCart.addEventListener("click", (event) => { // add to cart
                const color = document.querySelector(".product__color--selected");
                const size = document.querySelector(".product__size--selected");
                const quantity = document.querySelector("#quantity");

                if (color && size && quantity !== null) {
                    alert("加入購物車!");
                    let colorToCart = color.style.backgroundColor;
                    const sizeCart = size.innerHTML;
                    const quantityCart = quantity.innerHTML;

                    const rgbArr = rgbSplit(colorToCart);
                    colorToCart = (fullcolorHex(rgbArr[0], rgbArr[1], rgbArr[2])).toUpperCase();

                    let variant; // variant added in cart
                    const variants = JSON.parse(localStorage.getItem("variants"));
                    for (const i in variants) {
                        if (sizeCart === variants[i].size) {
                            variant = variants[i];
                        }
                    }

                    for (const i in data.colors) {
                        if (colorToCart === data.colors[i].code) {
                            variant.color = data.colors[i];
                        }
                    }

                    const variantCart = {
                        id: data.id,
                        name: data.title,
                        image: data.main_image,
                        price: data.price,
                        stock: variant.stock,
                        size: variant.size,
                        qty: quantityCart,
                        color: variant.color
                    };

                    let cart = JSON.parse(localStorage.getItem("cart"));
                    if (cart == null) {
                        cart = [];
                        cart.push(variantCart);
                        localStorage.setItem("cart", JSON.stringify(cart));
                    } else {
                        cart.push(variantCart);
                        localStorage.setItem("cart", JSON.stringify(cart));
                    }

                    const variantsNumber = JSON.parse(localStorage.getItem("cart"));
                    const cartNumber = document.querySelector("#cart_number");
                    cartNumber.innerHTML = variantsNumber.length;
                }
            });
        } else {
            alert(xhr.status);
        };
    };
};
xhr.open("GET", `/api/1.0/products/details?id=${id}`); // for local test and EC2
xhr.send();

function hexToRGB (h) {
    let r = 0; let g = 0; let b = 0;

    if (h.length === 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];
    } else if (h.length === 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }

    return "rgb(" + +r + ", " + +g + ", " + +b + ")";
}

function rgbToHex (rgb) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

function fullcolorHex (r, g, b) {
    const red = rgbToHex(r);
    const green = rgbToHex(g);
    const blue = rgbToHex(b);
    return red + green + blue;
};

function rgbSplit (rgbString) {
    const regexpString = rgbString.replace(/[^0-9,]*/g, "");
    const arr = regexpString.split(",");
    return (arr);
}

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
