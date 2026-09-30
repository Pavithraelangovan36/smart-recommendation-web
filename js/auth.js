/**
 * SMART RECOMMENDATION SYSTEM - Authentication Module
 * Handles login, registration, demo user quick login, admin authentication, and route guards.
 */

// Handle User Login form submission
function handleUserLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const rememberCheckbox = document.getElementById("remember-me");
  const errorAlert = document.getElementById("login-error");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  if (errorAlert) errorAlert.classList.add("d-none");

  // Validation
  if (!email || !password) {
    displayAuthError("Please fill in both email and password.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    displayAuthError("Please enter a valid email address.");
    return false;
  }

  // Check against registered users in LocalStorage or match demo user
  const storedUsers = JSON.parse(localStorage.getItem("smartUsers") || "[]");
  let matchedUser = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!matchedUser) {
    // Dynamically create or accept user for demo purposes
    matchedUser = {
      id: "user-" + Date.now(),
      name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      age: 25,
      location: "Mumbai, India",
      interests: ["Technology", "Lifestyle"],
      joinedDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    storedUsers.push(matchedUser);
    localStorage.setItem("smartUsers", JSON.stringify(storedUsers));
  }

  // Set active user session
  localStorage.setItem("smartUser", JSON.stringify(matchedUser));
  localStorage.setItem("smartLogin", "true");
  localStorage.setItem("smartPreferences", JSON.stringify(matchedUser.interests || ["Technology"]));

  showToast(`Welcome back, ${matchedUser.name}!`, "success");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);

  return false;
}

// Quick 1-Click Demo User Login (Alex Johnson)
function loginAsDemoUser() {
  const demoProfile = {
    id: "user-demo-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    age: 26,
    location: "Bangalore, India",
    interests: ["Technology", "Travel", "Books"],
    joinedDate: "2026-01-10",
    status: "Active"
  };

  localStorage.setItem("smartUser", JSON.stringify(demoProfile));
  localStorage.setItem("smartLogin", "true");
  localStorage.setItem("smartPreferences", JSON.stringify(demoProfile.interests));
  
  // Seed demo wishlist and view history if empty
  if (!localStorage.getItem("smartWishlist")) {
    localStorage.setItem("smartWishlist", JSON.stringify(["prod-1", "prod-2", "prod-8"]));
  }

  showToast("Logged in as Demo User (Alex Johnson)!", "success");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 750);
}

// Handle User Registration form submission
function handleUserRegister(event) {
  event.preventDefault();

  const name = document.getElementById("reg-name")?.value.trim();
  const email = document.getElementById("reg-email")?.value.trim();
  const password = document.getElementById("reg-password")?.value;
  const confirmPassword = document.getElementById("reg-confirm-password")?.value;
  const age = document.getElementById("reg-age")?.value;
  const location = document.getElementById("reg-location")?.value.trim() || "India";

  // Gather selected interests
  const interestCheckboxes = document.querySelectorAll("input[name='interests']:checked");
  const selectedInterests = Array.from(interestCheckboxes).map(cb => cb.value);

  // Validate form
  if (!name || !email || !password || !confirmPassword) {
    displayAuthError("Please fill out all required fields.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    displayAuthError("Please enter a valid email address.");
    return false;
  }

  if (password.length < 6) {
    displayAuthError("Password must be at least 6 characters long.");
    return false;
  }

  if (password !== confirmPassword) {
    displayAuthError("Passwords do not match.");
    return false;
  }

  if (selectedInterests.length === 0) {
    displayAuthError("Please select at least one interest to help personalize your recommendations.");
    return false;
  }

  // Create new user profile
  const newUser = {
    id: "user-" + Date.now(),
    name: name,
    email: email,
    age: age ? parseInt(age, 10) : 25,
    location: location,
    interests: selectedInterests,
    joinedDate: new Date().toISOString().split("T")[0],
    activityCount: { viewed: 1, wishlist: 0, content: 0, ratings: 0 },
    status: "Active"
  };

  // Persist to user list
  const users = JSON.parse(localStorage.getItem("smartUsers") || "[]");
  users.push(newUser);
  localStorage.setItem("smartUsers", JSON.stringify(users));

  // Set active user session
  localStorage.setItem("smartUser", JSON.stringify(newUser));
  localStorage.setItem("smartLogin", "true");
  localStorage.setItem("smartPreferences", JSON.stringify(selectedInterests));

  showToast("Account created successfully! Welcome to SmartRecommend.", "success");

  setTimeout(() => {
    window.location.href = "recommendations.html";
  }, 1200);

  return false;
}

// Handle Admin Login submission
function handleAdminLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const errorAlert = document.getElementById("admin-error");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  if (errorAlert) errorAlert.classList.add("d-none");

  // Validate admin credentials (admin@smartrecommend.com / admin123)
  if (email.toLowerCase() === DEMO_ADMIN.email.toLowerCase() && password === DEMO_ADMIN.password) {
    localStorage.setItem("smartAdminLogin", "true");
    showToast("Admin authenticated successfully. Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "admin/dashboard.html";
    }, 800);
    return false;
  } else {
    if (errorAlert) {
      errorAlert.textContent = "Invalid Admin credentials. Use admin@smartrecommend.com / admin123";
      errorAlert.classList.remove("d-none");
    } else {
      showToast("Invalid Admin credentials!", "danger");
    }
    return false;
  }
}

// Quick 1-Click Admin Demo Login
function fillDemoAdminCredentials() {
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  if (emailInput && passwordInput) {
    emailInput.value = "admin@smartrecommend.com";
    passwordInput.value = "admin123";
    showToast("Admin credentials filled. Click Sign In.", "info");
  }
}

// Handle Admin Logout
function handleAdminLogout() {
  localStorage.setItem("smartAdminLogin", "false");
  showToast("Admin session ended.", "info");
  setTimeout(() => {
    window.location.href = "../admin-login.html";
  }, 600);
}

// Display error messages inside auth form container
function displayAuthError(msg) {
  const errorAlert = document.getElementById("auth-error-alert") || document.getElementById("login-error");
  if (errorAlert) {
    errorAlert.textContent = msg;
    errorAlert.classList.remove("d-none");
    errorAlert.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    showToast(msg, "danger");
  }
}

// Route Guard for Admin Portal
function enforceAdminGuard() {
  if (localStorage.getItem("smartAdminLogin") !== "true") {
    showToast("Admin access required. Please sign in.", "warning");
    setTimeout(() => {
      window.location.href = "../admin-login.html";
    }, 500);
  }
}
