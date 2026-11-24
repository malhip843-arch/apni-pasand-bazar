
const products = [
  {
    id: 1,
    name: "Men's Stylish Shirt",
    price: 1800,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"
  },
  {
    id: 2,
    name: "Smartphone",
    price: 25000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
  },
  {
    id: 3,
    name: "Sports Shoes",
    price: 3500,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
  },
  {
    id: 4,
    name: "Beauty Kit",
    price: 2200,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"
  },
  {
    id: 5,
    name: "Wrist Watch",
    price: 4500,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    id: 6,
    name: "Headphones",
    price: 3000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
  },
  {
    id: 7,
    name: "Home Decoration",
    price: 1500,
    category: "Home",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600"
  },
  {
    id: 8,
    name: "Grocery Pack",
    price: 1200,
    category: "Grocery",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
  }
];

let cart = JSON.parse(localStorage.getItem("apniPasandCart")) || [];

function saveCart() {
  localStorage.setItem("apniPasandCart", JSON.stringify(cart));
}

function displayProducts(items) {
  const list = document.getElementById("product-list");

  list.innerHTML = items.map(product => `
    <div class="product-card">
      <img class="product-image"
           src="${product.image}"
           alt="${product.name}"
           loading="lazy">
      <h3>${product.name}</h3>
      <p>Rs. ${product.price.toLocaleString("en-PK")}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join("");

  if (items.length === 0) {
    list.innerHTML = "<p>No products found.</p>";
  }
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }

  saveCart();
  updateCart();
  alert(product.name + " cart mein add ho gaya!");
}

function updateCart() {
  document.getElementById("cart-count").textContent =
    cart.reduce((total, item) => total + item.quantity, 0);

  const cartItems = document.getElementById("cart-items");

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Aapka cart khaali hai.</p>";
    document.getElementById("cart-total").textContent = "Total: Rs. 0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    return `
      <div class="product-card">
        <h3>${item.name}</h3>
        <p>Price: Rs. ${item.price.toLocaleString("en-PK")}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: Rs. ${subtotal.toLocaleString("en-PK")}</p>
        <button onclick="changeQuantity(${item.id}, -1)">−</button>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  }).join("");

  document.getElementById("cart-total").textContent =
    "Total: Rs. " + total.toLocaleString("en-PK");
}

function changeQuantity(id, change) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
}

function showCart() {
  document.getElementById("cart-section").scrollIntoView({
    behavior: "smooth"
  });
}

function checkout() {
  if (cart.length === 0) {
    alert("Pehle cart mein product add karein!");
    return;
  }

  document.getElementById("checkout-section").style.display = "block";
  document.getElementById("checkout-section").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("checkout-form").addEventListener("submit", function(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Cart khaali hai!");
    return;
  }

  const customer = {
    name: document.getElementById("customer-name").value.trim(),
    phone: document.getElementById("customer-phone").value.trim(),
    address: document.getElementById("customer-address").value.trim()
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const order = {
    orderNumber: "APB-" + Date.now(),
    customer,
    products: [...cart],
    total,
    paymentMethod: "Cash on Delivery",
    date: new Date().toLocaleString()
  };

  const orders = JSON.parse(
    localStorage.getItem("apniPasandOrders") || "[]"
  );

  orders.push(order);
  localStorage.setItem("apniPasandOrders", JSON.stringify(orders));

  alert("Demo order placed!\nOrder Number: " + order.orderNumber);

  cart = [];
  saveCart();
  updateCart();
  this.reset();

  document.getElementById("checkout-section").style.display = "none";
});

document.getElementById("search").addEventListener("input", function() {
  const query = this.value.toLowerCase();

  displayProducts(products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  ));
});

displayProducts(products);
updateCart();
