document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const foodCards = document.querySelectorAll(".food-item");
  const foodItemsButton = document.getElementById("foodItems");
  const drinksButton = document.getElementById("drinks");

    const addToCartClass = ".add-to-cart-btn";

    const isLoggedIn = () => {
      return localStorage.getItem("user") !== null;
    };

    const getCart = () => {
      return JSON.parse(localStorage.getItem("cart")) || [];
    };

    const saveCart = (cart) => {
      localStorage.setItem("cart", JSON.stringify(cart));
    };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchText = e.target.value.toLowerCase();
      foodCards.forEach((card) => {
        const itemName = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = itemName.includes(searchText) ? "block" : "none";
      });
    });
  }

  if (foodItemsButton) {
    foodItemsButton.addEventListener("click", () => {
      foodCards.forEach((card) => {
        const category = card.dataset.category;
        card.style.display = category === "food-items" ? "block" : "none";
      });
    });
  }

  if (drinksButton) {
    drinksButton.addEventListener("click", () => {
      foodCards.forEach((card) => {
        const category = card.dataset.category;
        card.style.display = category === "drinks" ? "block" : "none";
      });
    });
  }

  foodCards.forEach((card) => {
    const addToCartButton = card.querySelector(addToCartClass);
    const itemName = card.querySelector("h3").textContent;
    const itemPrice = parseInt(card.querySelector(".item-price").textContent);

    if (addToCartButton) {
      addToCartButton.addEventListener("click", () => {
        if (!isLoggedIn()) {
          alert("You must log in to add items to the cart.");
          window.location.href = "/signup.html"; 
          return;
        }

        const cart = getCart();
        const existingItem = cart.find((item) => item.name === itemName);

        if (existingItem) {
          existingItem.quantity += 1;
          alert(`Increased quantity of ${itemName} in the cart.`);
        } else {
          cart.push({ name: itemName, price: itemPrice, quantity: 1 });
          alert(`${itemName} added to cart.`);
        }
        saveCart(cart);
      });
    }
  });

const updateNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navbar = document.querySelector(".nav");
  if (user) {
    navbar.innerHTML = `
      <a href="/">Home</a>
      <a href="/menu.html" class="active">Menu</a>
      <button id="profileBtn" class="profile-icon" title="Profile"><i class="far fa-user-circle"></i></button>
      <a href="/cart.html" class="cart-icon"><i class="fa badge" value=0>&#xf07a;</i></a>
    `;
  } else {
    navbar.innerHTML = `
      <a href="/">Home</a>
      <a href="/menu.html" class="active">Menu</a>
      <a href="/signup.html" id="authLink">Login/Signup</a>
    `;
  }
};
updateNavbar();

profileBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  alert("Logged out successfully!");
  window.location.href = "/";
});
});

