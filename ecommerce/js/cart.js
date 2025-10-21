// ==== LOAD CART DATA ====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cart-items");
const totalPrice = document.getElementById("totalPrice");
const clearCartBtn = document.getElementById("clearCart");

// ==== DISPLAY CART ITEMS ====
function displayCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p style='text-align:center;'>Your cart is empty 🛒</p>";
    totalPrice.textContent = "0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
      </div>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  totalPrice.textContent = total.toFixed(2);
}

// ==== REMOVE ITEM ====
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// ==== CLEAR CART ====
clearCartBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("cart");
    cart = [];
    displayCart();
  }
});

// ==== INITIALIZE ====
displayCart();
