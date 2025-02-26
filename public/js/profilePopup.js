document.addEventListener("DOMContentLoaded", () => {
    const profilePopup = document.getElementById("profilePopup");
    const profileBtn = document.getElementById("profileBtn");
    const closeProfilePopup = document.getElementById("closeProfilePopup");
    const addAddressBtn = document.getElementById("addAddressBtn");
    const newAddressInput = document.getElementById("newAddressInput");
    const saveAddressBtn = document.getElementById("saveAddressBtn");
    const addressList = document.getElementById("addressList");
    const logoutBtn = document.getElementById("popupLogoutBtn");
  
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
  
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
          li.textContent = address;
          addressList.appendChild(li);
        });
      } else {
        const noAddressMessage = document.createElement("li");
        noAddressMessage.textContent = "No saved addresses yet.";
        addressList.appendChild(noAddressMessage);
      }
    };
  
    // Event Listener: Open Profile Popup
    profileBtn.addEventListener("click", () => {
      profilePopup.style.display = "block";
      loadUserInfo();
    });
  
    // Event Listener: Close Profile Popup
    closeProfilePopup.addEventListener("click", () => {
      profilePopup.style.display = "none";
    });
  
    // Event Listener: Add Address Button
    addAddressBtn.addEventListener("click", () => {
      newAddressInput.style.display = "block";
      saveAddressBtn.style.display = "block";
    });
  
    // Event Listener: Save Address Button
    saveAddressBtn.addEventListener("click", async () => {
      const newAddress = newAddressInput.value.trim();
      if (newAddress) {
        try {
          const response = await fetch("/api/user/addAddress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id, address: newAddress }),
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
    logoutBtn.addEventListener("click", () => {
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
  });
  