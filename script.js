
/* APNI PASAND BAZAR - MULTI PAGE SHOPPING SYSTEM */

// ALL PRODUCTS

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

// PAGE CATEGORY

const pageCategoryMap = {
  "fashion.html": "Fashion",
  "electronics.html": "Electronics",
  "shoes.html": "Shoes",
  "beauty.html": "Beauty",
  "home.html": "Home",
  "grocery.html": "Grocery"
};

const currentPage = window.location.pathname
  .split("/")
  .pop()
  .toLowerCase();

const pageCategory = pageCategoryMap[currentPage] || "All";

// CART DATA

let cart = [];

try {
  cart = JSON.parse(
    localStorage.getItem("apniPasandCart")
  ) || [];

  if (!Array.isArray(cart)) cart = [];
} catch (error) {
  cart = [];
}

// SAVE CART

function saveCart() {
  localStorage.setItem(
    "apniPasandCart",
    JSON.stringify(cart)
  );
}

// DISPLAY PRODUCTS

function displayProducts(items) {
  const list = document.getElementById("product-list");

  if (!list) return;

  if (items.length === 0) {
    list.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.innerHTML = items.map(product => `
    <div class="product-card">

      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >

      <h3>${product.name}</h3>

      <p>Rs. ${product.price.toLocaleString("en-PK")}</p>

      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>

    </div>
  `).join("");
}

// SEARCH PRODUCTS

function applyFilters() {
  const searchInput = document.getElementById("search");

  const searchText = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  let filteredProducts = products.filter(product => {
    return pageCategory === "All" ||
      product.category === pageCategory;
  });

  if (searchText) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  }

  displayProducts(filteredProducts);
}

// CATEGORY FILTER

function filterCategory(category) {
  displayProducts(
    category === "All"
      ? products
      : products.filter(product => product.category === category)
  );

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
}

// ADD TO CART

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  updateCart();

  alert(product.name + " added to cart!");
}

// CHANGE QUANTITY

function changeQuantity(productId, amount) {
  const item = cart.find(product => product.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== productId);
  }

  saveCart();
  updateCart();
}

// REMOVE FROM CART

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);

  saveCart();
  updateCart();
}

// UPDATE CART

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  const quantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartCount) {
    cartCount.textContent = quantity;
  }

  if (cartTotal) {
    cartTotal.textContent =
      "Total: Rs. " + total.toLocaleString("en-PK");
  }

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="product-card">

      <h3>${item.name}</h3>

      <p>Price: Rs. ${item.price.toLocaleString("en-PK")}</p>

      <p>Quantity: ${item.quantity}</p>

      <button onclick="changeQuantity(${item.id}, -1)">−</button>

      <button onclick="changeQuantity(${item.id}, 1)">+</button>

      <button onclick="removeFromCart(${item.id})">
        Remove
      </button>

      <p>
        Subtotal: Rs.
        ${(item.price * item.quantity).toLocaleString("en-PK")}
      </p>

    </div>
  `).join("");
}

// SHOW CART

function showCart() {
  const section = document.getElementById("cart-section");

  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// CHECKOUT

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const section = document.getElementById("checkout-section");

  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// PLACE ORDER

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = {
      orderId: "APB" + Date.now(),
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      products: [...cart],
      total: total,
      date: new Date().toLocaleString(),
      status: "Pending"
    };

    let orders = [];

    try {
      orders = JSON.parse(
        localStorage.getItem("apniPasandOrders")
      ) || [];
    } catch (error) {
      orders = [];
    }

    orders.push(order);

    localStorage.setItem(
      "apniPasandOrders",
      JSON.stringify(orders)
    );

    alert(
      "Thank you " + name +
      "!\nYour demo order has been saved." +
      "\nOrder ID: " + order.orderId
    );

    cart = [];

    saveCart();
    updateCart();
    checkoutForm.reset();

    document.getElementById("checkout-section").style.display = "none";
  });
}

// SEARCH EVENT

const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

// WEBSITE START

applyFilters();
updateCart();
