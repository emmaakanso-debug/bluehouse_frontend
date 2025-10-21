// ==== PRODUCT DATA ====
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 80,
    category: "electronics",
    image: "headphones.png"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 120,
    category: "electronics",
    image: "smart watches.png"
  },
  {
    id: 3,
    name: "Men’s Jacket",
    price: 60,
    category: "fashion",
    image: "mens jacket.jpg"
  },
  {
    id: 4,
    name: "Sofa Set",
    price: 250,
    category: "home",
    image: "sofa set.jpg"
  },
  {
    id: 5,
    name: "Sneakers",
    price: 90,
    category: "fashion",
    image: "sneakers.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("product-list");
const categoryFilter = document.getElementById("categoryFilter");
const cartCount = document.getElementById("cartCount");

// ==== DISPLAY PRODUCTS ====
function displayProducts(items) {
  productList.innerHTML = "";
  items.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

// ==== FILTER PRODUCTS ====
categoryFilter.addEventListener("change", (e) => {
  const category = e.target.value;
  if (category === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
  }
});

// ==== ADD TO CART ====
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ==== UPDATE CART COUNT ====
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// ==== INITIALIZE ====
displayProducts(products);
updateCartCount();
