document.addEventListener('DOMContentLoaded', () => {
  // Update Navbar Function
  const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navbar = document.querySelector('.nav');

    if (user) {
      // User is logged in: Update navbar dynamically
      navbar.innerHTML = `
        <a href="/" class="active">Home</a>
        <a href="/menu.html">Menu</a>
        <a href="#" id="profileBtn" class="profile-icon" title="Profile"><i class="far fa-user-circle"></i></a>
        <a href="/cart.html" class="cart-icon"><i class="fa badge" value="0">&#xf07a;</i></a>

        <!-- Profile Popup -->
        <div id="profilePopup" class="popup" style="display: none;">
          <div class="popup-content">
            <button id="closeProfilePopup" class="close-btn">&times;</button>

            <!-- Profile Picture Placeholder -->
            <div class="profile-picture" style="height: 100px; width: 100px; background-color: #ccc; border-radius: 50%; margin: auto;"></div>

            <!-- User Info -->
            <h3 id="popupUsername" class="popup-username"></h3>
            <p id="popupEmail" class="popup-email"></p>

            <!-- Add Address -->
            <button id="addAddressBtn" class="btn">Add New Address</button>
            <input id="newAddressInput" type="text" placeholder="Enter address" style="display: none; margin-top: 10px; width: 90%; padding: 5px;" />
            <button id="saveAddressBtn" class="btn" style="display: none; margin-top: 5px;">Save Address</button>

            <!-- Address List -->
            <ul id="addressList" class="address-list"></ul>

            <!-- Logout Button (sticks to the bottom) -->
            <button id="popupLogoutBtn" class="btn logout-btn">Logout</button>
          </div>
        </div>
      `;
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
    window.addEventListener("click", (e) => {
      if (!profilePopup.contains(e.target) && e.target !== profileBtn) {
        profilePopup.style.display = "none";
      }
    });

    // **Badge Update Logic**
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Fetch cart from localStorage
    const cartBadge = document.querySelector(".cart-icon .badge"); // Locate the badge element
    if (cartBadge) {
      cartBadge.setAttribute("value", cart.reduce((total, item) => total + item.quantity, 0)); // Update badge value
    } else {
      console.error("Cart badge element not found!");
    }
    } else {
      // User is not logged in: Display default navbar
      navbar.innerHTML = `
        <a href="/" class="active">Home</a>
        <a href="/menu.html">Menu</a>
        <a href="/signup.html" id="authLink">Login/Signup</a>
      `;
    }
  };

  // Call updateNavbar on page load
  updateNavbar();
});
