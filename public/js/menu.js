document.addEventListener("DOMContentLoaded", async () => {
  const menuContainer = document.getElementById("menuItems");
  const searchInput = document.getElementById("searchInput");
  const loader = document.getElementById("loader");


  const categoryButtons = {
    "Main Course": document.getElementById("mainCourseBtn"),
    "Snacks": document.getElementById("snacksBtn"),
    "Drinks": document.getElementById("drinksBtn"),
    "Dessert": document.getElementById("dessertBtn"),
  };

  let menuData = [];

  // // Add to Cart Button Class
  // const addToCartClass = ".add-to-cart-btn";

  // Check if User is Logged In
  const isLoggedIn = () => localStorage.getItem("user") !== null;

  // Retrieve Cart from LocalStorage
  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

  // Save Cart to LocalStorage
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

  // Function to Fetch Menu Items
  const fetchMenuItems = async () => {
    try {
      loader.style.display = "block"; // Show loader

      const response = await fetch("/menu/menuItems"); // Replace with actual API endpoint
      const data = await response.json();
      console.log("Fetched Menu Data:", data); 

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      menuData = data;
      displayMenuItems(menuData);
    } catch (error) {
      console.error("Error fetching menu:", error);
      menuContainer.innerHTML = "<p>Failed to load menu. Please try again later.</p>";
    } finally {
      loader.style.display = "none"; // Hide loader
    }
  };

  // Function to Display Menu Items
  const displayMenuItems = (items) => {
    menuContainer.innerHTML = ""; // Clear menu items before inserting new ones

    if (items.length === 0) {
      menuContainer.innerHTML = "<p>No menu items found.</p>";
      return;
    }

    items.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("food-item");
      menuItem.dataset.category = item.category;

      menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <h5 class="item-price">Rs. ${item.price.toFixed(2)}</h5>
      <p class="cart-quantity">Quantity in cart: <span>0</span></p>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;

      menuContainer.appendChild(menuItem);

      // Add Event Listener to Add to Cart Button
      const addToCartButton = menuItem.querySelector(".add-to-cart-btn");
      addToCartButton.addEventListener("click", () => addToCart(item));
    });
  };

// Search Functionality
searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const filteredItems = menuData.filter((item) =>
    item.name.toLowerCase().includes(searchText)
  );
  displayMenuItems(filteredItems);
});

  // Category Filtering
  Object.keys(categoryButtons).forEach((category) => {
    categoryButtons[category].addEventListener("click", () => {
      console.log("Filtering for category:", category); // Debugging

      const filteredItems = menuData.filter((item) => item.category === category);

      console.log("Filtered Items:", filteredItems); // Debugging
      displayMenuItems(filteredItems);
    });
  });

  const addToCart = (item) => {
    if (!isLoggedIn()) {
      alert("You must log in to add items to the cart.");
      window.location.href = "/signup.html"; // Redirect to login/signup page
      return;
    }
  
    const cart = getCart();
    let newQuantity = 1; // Default quantity for a new item
    let existingItem = cart.find((cartItem) => cartItem.name === item.name);
  
    if (existingItem) {
      existingItem.quantity += 1;
      newQuantity = existingItem.quantity;
      alert(`Increased quantity of ${item.name} in the cart.`);
    } else {
      cart.push({ name: item.name, price: item.price, quantity: 1 });
      alert(`${item.name} added to cart.`);
    }
  
    saveCart(cart);
    updateBadge();
  
    // **Find the correct food item and update its quantity display**
    const foodItems = document.querySelectorAll(".food-item");
    foodItems.forEach((menuItem) => {
      const itemNameElement = menuItem.querySelector("h3");
      if (itemNameElement && itemNameElement.textContent.trim() === item.name) {
        const quantityElement = menuItem.querySelector(".cart-quantity");
        if (quantityElement) {
          quantityElement.classList.add("visible"); // Make it visible
          quantityElement.querySelector("span").textContent = newQuantity; // Update quantity
          console.log(`Updated quantity for ${item.name}: ${newQuantity}`);
        } else {
          console.error("Quantity element not found for", item.name);
        }
      }
    });
  };
  
  
  
  

  const updateBadge = () => {
    setTimeout(() => {
      const badgeElement = document.querySelector(".cart-icon .badge"); // Corrected selector
  
      if (badgeElement) {
        const cart = getCart();
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        badgeElement.setAttribute("value", totalQuantity);
      } else {
        console.warn("⚠️ Badge element not found. It might not be loaded yet.");
      }
    }, 200); // Small delay to ensure navbar loads
  };
  


  // Update Navbar Function
  const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = JSON.parse(localStorage.getItem("admin"));
    const navbar = document.querySelector(".nav");
    const header = document.querySelector(".header");
  
    // Case 1: If Admin is Logged In, Show Admin Navbar
    if (isAdmin) {
      header.innerHTML = `
          <div class="logo">FoodiePhile Admin</div>
          <nav class="nav">
            <a href="/menu.html" class="active">Menu</a>
            <a href="/admin.html">Update Menu</a>
            <a href="/orders.html">Orders</a>
            <a href="#" id="updatedProfileBtn" class="profile-icon" title="Logout"><i class="far fa-user-circle"></i></a>
          </nav>
      `;
  
      // Logout Admin When Profile Button is Clicked
      document.getElementById("updatedProfileBtn").addEventListener("click", () => {
        localStorage.removeItem("admin");
        alert("Logged out successfully!");
        window.location.href = "/";
      });
  
      return; // Exit function to prevent showing user navbar
    }

  // Case 2: If User is Logged In, Show User Navbar
  if (user) {
    header.innerHTML = `
      <div class="logo">FoodiePhile</div>
      <nav class="nav">
      <a href="/">Home</a>
      <a href="/menu.html" class="active">Menu</a>
      <a href="#" id="profileBtn" class="profile-icon" title="Profile"><i class="far fa-user-circle"></i></a>
      <a href="/cart.html" class="cart-icon"><i class="fa badge" value=0>&#xf07a;</i></a>
      </nav>

      <!-- Profile Popup -->
      <div id="profilePopup" class="popup" style="display: none;">
        <div class="popup-content">
          <button id="closeProfilePopup" class="close-btn">&times;</button>
          <div class="profile-picture" style="height: 100px; width: 100px; background-color: #ccc; border-radius: 50%; margin: auto;"></div>
          <h3 id="popupUsername" class="popup-username"></h3>
          <p id="popupEmail" class="popup-email"></p>

          <!-- Add Address -->
          <button id="addAddressBtn" class="btn">Add New Address</button>
          <input id="newAddressInput" type="text" placeholder="Enter address" style="display: none; margin-top: 10px; width: 90%; padding: 5px;" />
          <button id="saveAddressBtn" class="btn" style="display: none; margin-top: 5px;">Save Address</button>

          <!-- Address List -->
          <ul id="addressList" class="address-list"></ul>

          <!-- Logout Button -->
          <button id="popupLogoutBtn" class="btn logout-btn">Logout</button>
        </div>
      </div>
    `;
    updateBadge(); // Update cart badge count
      // Function to load user data into popup
      const loadUserInfo = () => {
        if (user) {
          document.getElementById("popupUsername").textContent = user.username || "N/A";
          document.getElementById("popupEmail").textContent = user.email || "N/A";
          loadAddresses();
        } else {
          alert("Please log in to view your profile.");
          window.location.href = "/signup.html";
        }
      };

      // Function to load addresses into the address list
      const loadAddresses = () => {
        addressList.innerHTML = ""; // Clear any previous list items

        if (user.addresses && user.addresses.length > 0) {
          user.addresses.forEach((address) => {
            const li = document.createElement("li");
            li.className = "address-item";

            // Add the address text
            const addressText = document.createElement("span");
            addressText.textContent = address;

            // Add the remove button
            const removeButton = document.createElement("button");
            removeButton.textContent = "✖"; // Cross symbol
            removeButton.className = "remove-address-btn";
            removeButton.addEventListener("click", async () => {
              try {
                const response = await fetch("/api/user/removeAddress", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: user.email, address }), // Send email and address
                });

                const result = await response.json();
                if (result.success) {
                  user.addresses = result.user.addresses; // Update local user data
                  localStorage.setItem("user", JSON.stringify(user));
                  loadAddresses(); // Reload the address list
                } else {
                  alert("Failed to remove address.");
                }
                } catch (error) {
                console.error("Error removing address:", error);
              }
            });

            li.appendChild(addressText); // Append address text to list item
            li.appendChild(removeButton); // Append remove button to list item
            addressList.appendChild(li); // Add the list item to the address list
          });
        } else {
          const noAddressMessage = document.createElement("li");
          noAddressMessage.textContent = "No saved addresses yet.";
          addressList.appendChild(noAddressMessage);
        }
      };

      // Event Listener: Open Profile Popup
      document.getElementById("profileBtn").addEventListener("click", () => {
        profilePopup.style.display = "block";
        loadUserInfo();
      });

      // Event Listener: Close Profile Popup
      document.getElementById("closeProfilePopup").addEventListener("click", () => {
        profilePopup.style.display = "none";
      });

      // Event Listener: Add Address Button
      document.getElementById("addAddressBtn").addEventListener("click", () => {
        newAddressInput.style.display = "block";
        saveAddressBtn.style.display = "block";
      });

      // Event Listener: Save Address Button
      document.getElementById("saveAddressBtn").addEventListener("click", async () => {
        const newAddress = newAddressInput.value.trim();
        if (newAddress) {
          try {
            const response = await fetch("/api/user/addAddress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user.email, address: newAddress }),
            });

            const result = await response.json();
            if (result.success) {
              user.addresses = result.user.addresses; // Update local user data
              localStorage.setItem("user", JSON.stringify(user));
              loadAddresses();
              newAddressInput.value = ""; // Clear the input
              newAddressInput.style.display = "none";
              saveAddressBtn.style.display = "none";
            } else {
            alert("Failed to save address.");
            }
          } catch (error) {
            console.error("Error adding address:", error);
          }
        }
      });

      // Event Listener: Logout Button
      document.getElementById("popupLogoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        window.location.href = "/";
      });

      // Close Popup on Outside Click
      const profilePopup=document.getElementById("profilePopup")
      window.addEventListener("click", (e) => {
        if (!profilePopup.contains(e.target) && e.target !== profileBtn) {
          profilePopup.style.display = "none";
        }
      });
      return; // Exit function to prevent showing default navbar
    } else {
      // User is not logged in: Display default navbar
      header.innerHTML = `
        <div class="logo">FoodiePhile</div>
        <nav class="nav">
        <a href="/">Home</a>
        <a href="/menu.html" class="active">Menu</a>
        <a href="/signup.html" id="authLink">Login/Signup</a>
        </nav>
      `;
    }   
  };
  // Call updateNavbar on page load
  updateNavbar();
  updateBadge();

  // Fetch and display menu on page load
  await fetchMenuItems();

  setTimeout(() => {
    const navbar = document.querySelector(".nav"); // Select element with class "nav"
    if (navbar) { // Check if navbar exists to avoid errors
        navbar.style.display = "block"; // Show navbar
        navbar.style.visibility = "visible";
        navbar.style.opacity = "1";
    } else {
        console.error("Navbar element not found!");
    }
}, 100); // Delay to prevent flicker
});
