
const products = [
  {id: 1, name: "Men's Stylish Shirt", price: 1800, category: "Fashion", icon: "👕"},
  {id: 2, name: "Smartphone", price: 25000, category: "Electronics", icon: "📱"},
  {id: 3, name: "Sports Shoes", price: 3500, category: "Shoes", icon: "👟"},
  {id: 4, name: "Beauty Kit", price: 2200, category: "Beauty", icon: "💄"},
  {id: 5, name: "Wrist Watch", price: 4500, category: "Fashion", icon: "⌚"},
  {id: 6, name: "Headphones", price: 3000, category: "Electronics", icon: "🎧"},
  {id: 7, name: "Home Decoration", price: 1500, category: "Home", icon: "🏠"},
  {id: 8, name: "Grocery Pack", price: 1200, category: "Grocery", icon: "🛒"}
];

let cart = [];

function displayProducts(items) {
  const list = document.getElementById("product-list");

  list.innerHTML = items.map(product => `
    <div class="product-card">
      <div class="product-icon">${product.icon}</div>
      <h3>${product.name}</h3>
      <p>Rs. ${product.price.toLocaleString("en-PK")}</p>
      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }

  updateCart();
  alert(product.name + " cart mein add ho gaya!");
}

function updateCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function showCart() {
  if (cart.length === 0) {
    alert("Aapka cart abhi khaali hai!");
    return;
  }

  let message = "YOUR SHOPPING CART\n\n";
  let total = 0;

  cart.forEach(item => {
    message += `${item.name} x ${item.quantity} = Rs. ${item.price * item.quantity}\n`;
    total += item.price * item.quantity;
  });

  message += `\nTotal: Rs. ${total.toLocaleString("en-PK")}`;
  alert(message);
}

document.getElementById("search").addEventListener("input", function() {
  const query = this.value.toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  displayProducts(filtered);
});

displayProducts(products);
