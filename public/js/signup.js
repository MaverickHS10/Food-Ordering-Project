document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const userLoginForm = document.getElementById('loginForm');
  const adminLoginForm = document.getElementById("adminLoginForm");
  const signupForm = document.getElementById('signupForm');
  const loginAdminLink = document.getElementById("loginAdmin");
  const loginUserLink = document.getElementById("loginUser");

  // Tab switching functionality
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');

    userLoginForm.classList.add('active');
    signupForm.classList.remove('active');

    // Hide Admin Login Form if visible
    adminLoginForm.classList.remove('active');
  });

  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');

    signupForm.classList.add('active');
    userLoginForm.classList.remove('active');

    // Hide Admin Login Form if visible
    adminLoginForm.classList.remove('active');
  });

  // Switch to Admin Login Form
  if (loginAdminLink) {
    loginAdminLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from tabs
      loginTab.classList.remove('active');
      signupTab.classList.remove('active');

      // Hide other forms
      userLoginForm.classList.remove('active');
      signupForm.classList.remove('active');

      // Show Admin Login Form
      adminLoginForm.classList.add('active');
    });
  }

  // Switch back to User Login Form
  if (loginUserLink) {
    loginUserLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Add active class to login tab
      loginTab.classList.add('active');
      signupTab.classList.remove('active');

      // Hide Admin Login Form
      adminLoginForm.classList.remove('active');

      // Show User Login Form
      userLoginForm.classList.add('active');
    });
  }

// Handle Login Form Submission
userLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  // Get input values
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    // Send POST request to backend
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {

      // Store user in localStorage (if needed)
      localStorage.setItem('user', JSON.stringify(data.user));

      alert(data.message || 'Login successful!');
      updateNavbar(); // Update the navbar with user details
      window.location.href = '/menu.html'; // Redirect to menu page
    } else {
      alert(data.message || 'Login failed. Please try again.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong during login.');
  }
});


 // Handle Signup Form Submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  // Get input values
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const mobile = document.getElementById('signupMobile').value.trim();

  // Validation for empty fields
  if (!username || !email || !password || !mobile) {
    alert('Please fill in all fields.');
    return;
  }

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
    return;
  }

  // Mobile number validation (exactly 10 digits)
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    alert('Mobile number must be exactly 10 digits.');
    return;
  }

  try {
    // Send POST request to backend
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, mobile }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store user details in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ username, email, mobile, avatar: 'default-avatar.png' })
      );
      alert(data.message || 'Signup successful!');
      updateNavbar(); // Update the navbar with user details
      window.location.href = '/menu.html'; // Redirect to menu page
    } else {
      alert(data.message || 'Signup failed. Please try again.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong during signup.');
  }
});

// Event listener for admin login form submission
adminLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form submission

  // Get form values
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  try {
    // Send login request to the backend
    const response = await fetch("/auth/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Login successful
      localStorage.setItem('admin', JSON.stringify(data.admin));
      alert(data.message); // Display success message
      window.location.href = "/admin.html"; 
    } else {
      // Login failed
      alert(data.message); // Display error message
    }
  } catch (err) {
    console.error("Error logging in:", err);
    alert("Something went wrong. Please try again later.");
  }
});

  // Update Navbar Function
  const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navbar = document.querySelector('.nav');

    if (user) {
      // User is logged in: Update navbar dynamically
      navbar.innerHTML = `
        <a href="/">Home</a>
        <a href="/menu.html">Menu</a>
        <a id="profileBtn" class="profile-icon" title="Profile"><i class="far fa-user-circle"></i></a>
        <a href="/cart.html" class="cart-icon"><i class="fa badge" value=8>&#xf07a;</i></a>

        <!-- Profile Modal -->
        <div id="profileModal" style="display:none;">
          <div class="modal-content">
            <button id="closeProfileModal" class="close-btn">&times;</button>
            <h2>Profile Details</h2>
            <div class="profile-details">
              <p><strong>Username:</strong> <span id="modalUsername">${user.username}</span></p>
              <p><strong>Email:</strong> <span id="modalEmail">${user.email}</span></p>
              <p><strong>Phone:</strong> <span id="modalPhone">${user.mobile || "N/A"}</span></p>
            </div>
            <button id="logoutBtn" class="logout-btn">Logout</button>
          </div>
        </div>
      `;

      // Add functionality for opening and closing the profile modal
      const profileModal = document.getElementById("profileModal");

      // Open Profile Modal
      document.getElementById("profileBtn").addEventListener("click", () => {
        profileModal.style.display = "block";
      });

      // Close Profile Modal
      document.getElementById("closeProfileModal").addEventListener("click", () => {
        profileModal.style.display = "none";
      });

      // Close Modal on Outside Click
      window.addEventListener("click", (e) => {
        if (e.target === profileModal) {
          profileModal.style.display = "none";
        }
      });

      // Logout Button Functionality
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        alert('Logged out successfully!');
        window.location.reload();
      });

    } else {
      // User is not logged in: Display default navbar
      navbar.innerHTML = `
        <a href="/">Home</a>
        <a href="/menu.html">Menu</a>
        <a href="/signup.html" id="authLink" class="active">Login/Signup</a>
      `;
    }
  };

  // Call updateNavbar on page load
  updateNavbar();
});
