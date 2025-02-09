document.addEventListener('DOMContentLoaded', () => {
  const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navbar = document.querySelector('.nav');

    if (user) {
      navbar.innerHTML = `
        <a href="/" class="active">Home</a>
        <a href="/menu.html">Menu</a>
        <button id="profileBtn" class="profile-icon" title="Profile"><i class="far fa-user-circle"></i></button>
        <a href="/cart.html" class="cart-icon"><i class="fa badge" value="0">&#xf07a;</i></a>
      `;
  
    } else {
      navbar.innerHTML = `
        <a href="/" class="active">Home</a>
        <a href="/menu.html">Menu</a>
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
