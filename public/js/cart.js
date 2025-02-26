document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cartList");
  const cartContainer = document.getElementById("cartContainer");
  const emptyCartMessage = document.getElementById("emptyCartMessage");
  const cartSummary = document.getElementById("cartSummary");
  const totalPriceElement = document.getElementById("totalPrice");
  const addMoreItemsBtn = document.getElementById("addMoreItemsBtn");
  const orderSummaryBtn = document.getElementById("orderSummaryBtn");
  const orderSummaryModal = document.getElementById("orderSummaryModal");
  const closeOrderSummary = document.getElementById("closeOrderSummary");
  const orderSummaryList = document.getElementById("orderSummaryList");
  const orderSummaryTotalPrice = document.getElementById("orderSummaryTotalPrice");
  const proceedToPaymentBtn = document.getElementById("proceedToPaymentBtn");
  const profileBtn = document.getElementById("profileBtn");
  const profilePopup = document.getElementById("profilePopup");
  const closeProfilePopup = document.getElementById("closeProfilePopup");
  const addAddressBtn = document.getElementById("addAddressBtn");
  const newAddressInput = document.getElementById("newAddressInput");
  const saveAddressBtn = document.getElementById("saveAddressBtn");
  const addressList = document.getElementById("addressList");
  const popupLogoutBtn = document.getElementById("popupLogoutBtn");
// Select Address Elements
const addressDropdown = document.getElementById("addressDropdown");
const orderSummaryAddress = document.createElement("p"); // Address for Order Summary Modal
orderSummaryAddress.id = "orderSummaryAddress";
orderSummaryAddress.style.textAlign = "center";

  const cartBadge = document.querySelector(".cart-icon .badge"); // Select the cart badge element

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let user = JSON.parse(localStorage.getItem("user"));

  // Function to update cart badge value
  const updateCartBadge = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Total quantity in the cart
    cartBadge.setAttribute("value", totalItems); // Update the badge value
    if (totalItems === 0) {
      cartBadge.setAttribute("value", ""); // Hide the badge value if cart is empty
    }
  };

  // Function to render cart items
  const renderCart = () => {
    cartList.innerHTML = ""; // Clear existing items
    let totalPrice = 0;

    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
      cartSummary.style.display = "none";
      cartHeadings.style.display = "none"; // Hide headings when cart is empty
      return;
    }

    emptyCartMessage.style.display = "none";
    cartSummary.style.display = "block";
    cartHeadings.style.display = "block"; // Show headings when cart has items

    cart.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span>${item.name} - ₹${item.price}</span>
        <span>
          <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
          ${item.quantity}
          <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
        </span>
        <span>₹${item.price * item.quantity}</span>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      cartList.appendChild(listItem);
      totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = totalPrice;
    updateCartBadge(); // Update cart badge whenever cart is rendered
  };

  // Add More Items Button
  if (addMoreItemsBtn) {
    addMoreItemsBtn.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  } else {
    console.error('Add More Items button not found! Check the HTML for the correct ID.');
  }

   // Error message for the address dropdown
   const addressError = document.createElement("p");
   addressError.id = "addressError";
   addressError.style.color = "red";
   addressError.style.fontSize = "0.9rem";
   addressError.style.display = "none"; // Initially hidden
   addressError.textContent = "Please select the delivery address.";
   addressDropdown.parentNode.appendChild(addressError); // Append error message below the dropdown
 
   // Order Summary Button
   if (orderSummaryBtn) {
     orderSummaryBtn.addEventListener("click", () => {
       const selectedAddress = addressDropdown.options[addressDropdown.selectedIndex]?.text;
 
       if (!selectedAddress || addressDropdown.selectedIndex === 0) {
         // Show error message if no address is selected
         addressError.style.display = "block";
         return; // Exit without opening the modal
       }
 
       // Hide the error message if address is selected
       addressError.style.display = "none";
 
       // Populate the Order Summary Modal with items and the selected address
       orderSummaryList.innerHTML = ""; // Clear existing summary
       let totalOrderPrice = 0;
 
       cart.forEach((item) => {
         const summaryItem = document.createElement("li");
         summaryItem.innerHTML = `
           <span>${item.name} </span>
           <span> ${item.quantity} </span>
           <span> ₹${item.price * item.quantity} </span>
         `;
         orderSummaryList.appendChild(summaryItem);
         totalOrderPrice += item.price * item.quantity;
       });
 
       orderSummaryTotalPrice.textContent = totalOrderPrice;
 
       // Add Address to the Order Summary Modal
       orderSummaryAddress.innerHTML = `<strong> Delivery Address: </strong> ${selectedAddress}`;
       const modalContent = orderSummaryModal.querySelector(".modal-content");
       const proceedToPaymentButton = modalContent.querySelector("#proceedToPaymentBtn");
 
       if (modalContent && proceedToPaymentButton) {
         modalContent.insertBefore(orderSummaryAddress, proceedToPaymentButton);
       }
 
       // Display the modal
       orderSummaryModal.style.display = "block";
     });
   } else {
     console.error('Order Summary button not found! Check the HTML for the correct ID.');
   }
 
  // Close Order Summary Modal
  if (closeOrderSummary) {
    closeOrderSummary.addEventListener("click", () => {
      orderSummaryModal.style.display = "none";
    });
  } else {
    console.error("Close Order Summary button not found! Check your HTML.");
  }

// Proceed to Payment
if (proceedToPaymentBtn) {
  proceedToPaymentBtn.addEventListener("click", async () => {
    const selectedAddress = addressDropdown.options[addressDropdown.selectedIndex]?.value;

    if (!selectedAddress) {
      addressError.style.display = "block";
      return;
    }

    addressError.style.display = "none"; // Hide error if address is selected

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const userEmail = user?.email;

    if (!userEmail) {
      alert("Please log in to place an order.");
      return;
    }

    try {
      const response = await fetch("/api/orders/newOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          deliveryAddress: selectedAddress,
          orderItems: cart,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order placed successfully!\nYour Order ID: ${data.orderId}`);
        localStorage.removeItem("cart"); // Clear the cart
        updateCartBadge(); // Update the cart badge
        location.reload(); // Refresh the page or redirect as needed
      } else {
        alert(`Failed to place order: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
} else {
  console.error("Proceed to Payment button not found!");
}



  // Handle Quantity and Remove Buttons
  cartList.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("quantity-btn")) {
      const index = parseInt(target.dataset.index);
      const action = target.dataset.action;

      if (action === "increase") {
        cart[index].quantity++;
      } else if (action === "decrease" && cart[index].quantity > 1) {
        cart[index].quantity--;
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    if (target.classList.contains("remove-btn")) {
      const index = parseInt(target.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
      renderCart();

    }
  });

  // Render cart on page load
  renderCart();

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
    popupLogoutBtn.addEventListener("click", () => {
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
   
    // Load addresses into the dropdown
    const loadAddressDropdown = () => {
    if (user && user.addresses && user.addresses.length > 0) {
      addressDropdown.innerHTML = `
        <option value="" disabled selected>Select Delivery Address</option>
      `; // Reset dropdown options
      user.addresses.forEach((address) => {
        const option = document.createElement("option");
        option.value = address;
        option.textContent = address;
        addressDropdown.appendChild(option);
      });
    } else {
      addressDropdown.innerHTML = `
        <option value="" disabled>No addresses available</option>
      `;
    }
  };
  // Call loadAddressDropdown on page load to populate addresses
  loadAddressDropdown();
});

