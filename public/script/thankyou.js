const queryParamsString = window.location.search;
const number = queryParamsString.split("=")[1];

const resetCart = [];
localStorage.setItem("cart", JSON.stringify(resetCart)); // reset cart
updateCartNumber(); // reset cart number
const orderID = document.querySelector("#number");
orderID.innerHTML = number;

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
