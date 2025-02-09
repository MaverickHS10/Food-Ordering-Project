document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const foodCards = document.querySelectorAll(".food-item");
  const foodItemsButton = document.getElementById("foodItems");
  const drinksButton = document.getElementById("drinks");

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

