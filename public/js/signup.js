document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
  });

  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
  });

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem('user', JSON.stringify(data.user));

      alert(data.message || 'Login successful!');
      updateNavbar(); 
      window.location.href = '/menu.html';
    } else {
      alert(data.message || 'Login failed. Please try again.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong during login.');
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const mobile = document.getElementById('signupMobile').value.trim();

  if (!username || !email || !password || !mobile) {
    alert('Please fill in all fields.');
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
    return;
  }

  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    alert('Mobile number must be exactly 10 digits.');
    return;
  }

  try {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, mobile }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        'user',
        JSON.stringify({ username, email, mobile, avatar: 'default-avatar.png' })
      );
      alert(data.message || 'Signup successful!');
      updateNavbar(); 
      window.location.href = '/menu.html'; 
    } else {
      alert(data.message || 'Signup failed. Please try again.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong during signup.');
  }
});

  const updateNavbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navbar = document.querySelector('.nav');

    if (user) {
      navbar.innerHTML = `
        <a href="/">Home</a>
        <a href="/menu.html">Menu</a>
        <a id="profileBtn" class="profile-icon" title="Profile"><i class="far fa-user-circle"></i></a>
        <a href="/cart.html" class="cart-icon"><i class="fa badge" value=8>&#xf07a;</i></a>
      `;

    } else {
      navbar.innerHTML = `
        <a href="/">Home</a>
        <a href="/menu.html">Menu</a>
        <a href="/signup.html" id="authLink" class="active">Login/Signup</a>
      `;
    }
  };

  updateNavbar();
});
