console.log("Apni Pasand Bazar is ready!");

let cart = [];

function addToCart(productName, price) {
  cart.push({
    name: productName,
    price: price
  });

  alert(productName + " cart mein add ho gaya!");
  console.log(cart);
}
