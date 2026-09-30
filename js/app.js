/**
 * SMART RECOMMENDATION SYSTEM - Global Utilities & App Controller
 * Provides toast alerts, navigation synchronization, view tracking, currency formatting, and state management.
 */

// Helper to safely retrieve data from LocalStorage
function getStoredProducts() {
  try {
    const data = localStorage.getItem("smartProducts");
    return data ? JSON.parse(data) : SEED_PRODUCTS;
  } catch (e) {
    return SEED_PRODUCTS;
  }
}

function getStoredContent() {
  try {
    const data = localStorage.getItem("smartContent");
    return data ? JSON.parse(data) : SEED_CONTENT;
  } catch (e) {
    return SEED_CONTENT;
  }
}

function getStoredCategories() {
  try {
    const data = localStorage.getItem("smartCategories");
    return data ? JSON.parse(data) : SEED_CATEGORIES;
  } catch (e) {
    return SEED_CATEGORIES;
  }
}

function getStoredWishlist() {
  try {
    const data = localStorage.getItem("smartWishlist");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function getStoredUser() {
  try {
    const data = localStorage.getItem("smartUser");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function isUserLoggedIn() {
  return localStorage.getItem("smartLogin") === "true";
}

function isAdminLoggedIn() {
  return localStorage.getItem("smartAdminLogin") === "true";
}

// Format numbers into Indian Rupee strings: e.g. ₹2,499
function formatINR(amount) {
  if (amount === undefined || amount === null) return "₹0";
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Generate star rating markup
function renderStarRating(rating, reviewsCount = null) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.4 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  let html = `<div class="rating-stars" aria-label="Rating: ${rating} out of 5">`;
  for (let i = 0; i < fullStars; i++) {
    html += `<i class="bi bi-star-fill text-warning"></i>`;
  }
  if (halfStar) {
    html += `<i class="bi bi-star-half text-warning"></i>`;
  }
  for (let i = 0; i < emptyStars; i++) {
    html += `<i class="bi bi-star text-muted"></i>`;
  }
  html += ` <span class="rating-score fw-bold ms-1">${rating.toFixed(1)}</span>`;
  if (reviewsCount !== null) {
    html += ` <span class="rating-count text-muted ms-1">(${reviewsCount})</span>`;
  }
  html += `</div>`;
  return html;
}

// Global Toast Notification Manager
function showToast(message, type = "success", duration = 3500) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }

  const toastId = "toast-" + Date.now();
  const iconClass = type === "success" 
    ? "bi-check-circle-fill text-success" 
    : type === "error" || type === "danger"
    ? "bi-exclamation-triangle-fill text-danger"
    : type === "warning"
    ? "bi-exclamation-circle-fill text-warning"
    : "bi-info-circle-fill text-primary";

  const toastEl = document.createElement("div");
  toastEl.className = "toast align-items-center shadow-lg border-0 show custom-toast animate-slide-in";
  toastEl.id = toastId;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="d-flex p-3 align-items-center bg-white rounded-3 border-start border-4 ${type === 'success' ? 'border-success' : type === 'danger' ? 'border-danger' : 'border-primary'}">
      <i class="bi ${iconClass} fs-4 me-3"></i>
      <div class="toast-body flex-grow-1 p-0 fw-medium text-dark">
        ${message}
      </div>
      <button type="button" class="btn-close ms-2 me-0" data-bs-dismiss="toast" aria-label="Close" onclick="this.closest('.toast').remove()"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  setTimeout(() => {
    if (toastEl && toastEl.parentNode) {
      toastEl.classList.remove("show");
      toastEl.classList.add("fade");
      setTimeout(() => toastEl.remove(), 400);
    }
  }, duration);
}

// Track product view in recently viewed list
function trackProductView(productId) {
  try {
    let viewed = JSON.parse(localStorage.getItem("smartRecentlyViewed") || "[]");
    viewed = viewed.filter(id => id !== productId);
    viewed.unshift(productId);
    if (viewed.length > 15) viewed = viewed.slice(0, 15);
    localStorage.setItem("smartRecentlyViewed", JSON.stringify(viewed));
  } catch (e) {
    console.error("Error tracking product view", e);
  }
}

// Track content view in article history
function trackContentView(contentId) {
  try {
    let history = JSON.parse(localStorage.getItem("smartContentHistory") || "[]");
    history = history.filter(id => id !== contentId);
    history.unshift(contentId);
    if (history.length > 15) history = history.slice(0, 15);
    localStorage.setItem("smartContentHistory", JSON.stringify(history));
  } catch (e) {
    console.error("Error tracking content view", e);
  }
}

// Toggle Wishlist item
function toggleWishlist(productId, callback) {
  let wishlist = getStoredWishlist();
  const index = wishlist.indexOf(productId);
  let isAdded = false;

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Product removed from wishlist", "info");
  } else {
    wishlist.push(productId);
    isAdded = true;
    showToast("Product added to wishlist!", "success");
  }

  localStorage.setItem("smartWishlist", JSON.stringify(wishlist));
  updateWishlistCountBadge();

  // Update heart icons on page
  document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle("active", isAdded);
    const icon = btn.querySelector("i");
    if (icon) {
      icon.className = isAdded ? "bi bi-heart-fill text-danger" : "bi bi-heart";
    }
  });

  if (typeof callback === "function") callback(isAdded, wishlist);
}

// Update the wishlist counter badges across the navigation bar
function updateWishlistCountBadge() {
  const wishlist = getStoredWishlist();
  const badges = document.querySelectorAll(".wishlist-counter-badge");
  badges.forEach(badge => {
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? "inline-flex" : "none";
  });
}

// Build standard product card HTML
function createProductCardHTML(product, explanation = "") {
  const wishlist = getStoredWishlist();
  const isWishlisted = wishlist.includes(product.id);
  const safeImg = product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80";

  return `
    <div class="col-12 col-sm-6 col-lg-3 mb-4 product-card-col" data-id="${product.id}" data-category="${product.category}">
      <div class="card h-100 product-card shadow-sm border-0 position-relative">
        ${explanation ? `<div class="recommendation-badge"><i class="bi bi-stars me-1"></i>${explanation}</div>` : ""}
        <div class="product-img-wrap position-relative overflow-hidden">
          <img src="${safeImg}" class="card-img-top product-img" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80';">
          <span class="badge bg-danger position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill">-${product.discount}%</span>
          <button class="btn wishlist-btn position-absolute top-0 end-0 m-3 rounded-circle shadow-sm ${isWishlisted ? 'active' : ''}" 
                  data-id="${product.id}" 
                  title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                  onclick="event.stopPropagation(); toggleWishlist('${product.id}')">
            <i class="bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
          </button>
        </div>
        <div class="card-body d-flex flex-column p-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="badge bg-light text-primary border rounded-pill category-pill">${product.category}</span>
            <small class="text-muted">${product.brand}</small>
          </div>
          <h6 class="card-title product-title mb-2 text-truncate-2" title="${product.name}">
            <a href="product-details.html?id=${product.id}" class="text-decoration-none text-dark hover-primary">${product.name}</a>
          </h6>
          <div class="mb-2">
            ${renderStarRating(product.rating, product.reviewsCount)}
          </div>
          <div class="d-flex align-items-baseline gap-2 mt-auto mb-3">
            <span class="product-price fw-bold text-dark fs-5">${formatINR(product.price)}</span>
            <span class="text-muted text-decoration-line-through small">${formatINR(product.originalPrice)}</span>
          </div>
          <div class="d-grid gap-2">
            <a href="product-details.html?id=${product.id}" class="btn btn-outline-primary btn-sm rounded-pill fw-semibold">
              <i class="bi bi-eye me-1"></i> View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Build standard content card HTML
function createContentCardHTML(article) {
  const safeImg = article.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";

  return `
    <div class="col-12 col-md-6 col-lg-4 mb-4 content-card-col" data-id="${article.id}" data-category="${article.category}">
      <div class="card h-100 content-card shadow-sm border-0 overflow-hidden">
        <div class="content-img-wrap position-relative">
          <img src="${safeImg}" class="card-img-top content-img" alt="${article.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';">
          <span class="badge bg-primary position-absolute top-0 start-0 m-3 rounded-pill">${article.category}</span>
        </div>
        <div class="card-body d-flex flex-column p-4">
          <div class="d-flex justify-content-between align-items-center text-muted small mb-2">
            <span><i class="bi bi-clock me-1"></i>${article.readingTime}</span>
            <span><i class="bi bi-eye me-1"></i>${article.views.toLocaleString()}</span>
          </div>
          <h5 class="card-title content-title mb-2 text-truncate-2">
            <a href="content-details.html?id=${article.id}" class="text-decoration-none text-dark hover-primary">${article.title}</a>
          </h5>
          <p class="card-text text-muted small text-truncate-3 mb-4">${article.summary}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
            <div class="d-flex align-items-center">
              <div class="author-avatar bg-light text-primary rounded-circle me-2 fw-bold d-flex align-items-center justify-content-center">
                ${article.author ? article.author.charAt(0) : 'A'}
              </div>
              <small class="fw-semibold text-secondary">${article.author}</small>
            </div>
            <a href="content-details.html?id=${article.id}" class="btn btn-sm btn-link text-primary text-decoration-none fw-bold p-0">
              Read More <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Global Navigation Initializer (synchronizes auth state and active link)
function initGlobalNavigation() {
  updateWishlistCountBadge();

  const loggedIn = isUserLoggedIn();
  const user = getStoredUser();

  // User Profile / Auth Button in header
  const authNavContainer = document.getElementById("nav-auth-container");
  if (authNavContainer) {
    if (loggedIn && user) {
      authNavContainer.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center gap-2 border px-3 py-1 shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="user-avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
              ${user.name ? user.name.charAt(0) : 'U'}
            </div>
            <span class="d-none d-md-inline fw-semibold text-dark">${user.name}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
            <li class="px-3 py-2 border-bottom">
              <div class="fw-bold text-dark">${user.name}</div>
              <small class="text-muted">${user.email}</small>
            </li>
            <li><a class="dropdown-item py-2" href="profile.html"><i class="bi bi-person me-2 text-primary"></i>My Profile & Interests</a></li>
            <li><a class="dropdown-item py-2" href="recommendations.html"><i class="bi bi-stars me-2 text-warning"></i>My Recommendations</a></li>
            <li><a class="dropdown-item py-2" href="wishlist.html"><i class="bi bi-heart me-2 text-danger"></i>Wishlist</a></li>
            <li><a class="dropdown-item py-2" href="feedback.html"><i class="bi bi-chat-heart me-2 text-info"></i>Give Feedback</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item py-2 text-danger" href="javascript:void(0)" onclick="handleLogout()"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
          </ul>
        </div>
      `;
    } else {
      authNavContainer.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <a href="login.html" class="btn btn-outline-primary btn-sm rounded-pill px-3">Sign In</a>
          <a href="register.html" class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">Register</a>
        </div>
      `;
    }
  }

  // Highlight active link based on current path
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href && (href === currentPath || (currentPath === "" && href === "index.html"))) {
      link.classList.add("active", "fw-bold", "text-primary");
    }
  });

  // Global search input enter listener
  const globalSearchInput = document.getElementById("global-search-input");
  if (globalSearchInput) {
    globalSearchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}

// User Logout Handler
function handleLogout() {
  localStorage.setItem("smartLogin", "false");
  showToast("You have been signed out.", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 800);
}

// Synchronize LocalStorage with live backend REST API if server is reachable
async function syncWithBackend() {
  if (typeof window.api === "undefined") return;

  try {
    const [prodRes, catRes, contRes] = await Promise.all([
      window.api.getProducts({ limit: 100 }).catch(() => null),
      window.api.request('/categories').catch(() => null),
      window.api.getContent({ limit: 50 }).catch(() => null)
    ]);

    if (prodRes && prodRes.products) {
      localStorage.setItem("smartProducts", JSON.stringify(prodRes.products));
    }
    if (catRes && catRes.categories) {
      localStorage.setItem("smartCategories", JSON.stringify(catRes.categories));
    }
    if (contRes && contRes.articles) {
      localStorage.setItem("smartContent", JSON.stringify(contRes.articles));
    }

    if (window.api.getToken()) {
      const wishRes = await window.api.getWishlist().catch(() => null);
      if (wishRes && wishRes.wishlistIds) {
        localStorage.setItem("smartWishlist", JSON.stringify(wishRes.wishlistIds));
        updateWishlistBadge();
      }
    }
  } catch (e) {
    // Silent fallback to local cache
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  initGlobalNavigation();
  syncWithBackend();
});

