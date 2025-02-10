document.addEventListener("DOMContentLoaded", () => {
    const cartList = document.getElementById("cartList");
    const cartContainer = document.getElementById("cartContainer");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const cartSummary = document.getElementById("cartSummary");
    const totalPriceElement = document.getElementById("totalPrice");
    const addMoreItemsBtn = document.getElementById("addMoreItemsBtn");
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let user = JSON.parse(localStorage.getItem("user"));
  
    const renderCart = () => {
      cartList.innerHTML = ""; 
      let totalPrice = 0;
  
      if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
        cartSummary.style.display = "none";
        cartHeadings.style.display = "none"; 
        return;
      }
  
      emptyCartMessage.style.display = "none";
      cartSummary.style.display = "block";
      cartHeadings.style.display = "block";
  
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
      updateCartBadge(); 
    };

    if (addMoreItemsBtn) {
      addMoreItemsBtn.addEventListener('click', () => {
        window.location.href = 'menu.html';
      });
    } else {
      console.error('Add More Items button not found! Check the HTML for the correct ID.');
    }
  
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
    renderCart();
});
  
  