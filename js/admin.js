/**
 * SMART RECOMMENDATION SYSTEM - Admin Controller
 * Manages admin dashboard KPIs, product CRUD, content CRUD, user moderation,
 * category manager, feedback status updates, Chart.js analytics, and system settings.
 */

// Route Guard Check
function initAdminAuthCheck() {
  if (localStorage.getItem("smartAdminLogin") !== "true") {
    showToast("Admin session required. Redirecting to login...", "warning");
    setTimeout(() => {
      window.location.href = "../admin-login.html";
    }, 600);
  }
}

/**
 * Initialize Dashboard (admin/dashboard.html)
 */
function initAdminDashboard() {
  initAdminAuthCheck();

  const products = getStoredProducts();
  const content = getStoredContent();
  const users = JSON.parse(localStorage.getItem("smartUsers") || "[]");
  const feedback = JSON.parse(localStorage.getItem("smartFeedback") || "[]");

  // Populate Metric Counters
  const elUsers = document.getElementById("admin-total-users");
  if (elUsers) elUsers.textContent = (users.length + 120).toLocaleString();

  const elProducts = document.getElementById("admin-total-products");
  if (elProducts) elProducts.textContent = products.length;

  const elContent = document.getElementById("admin-total-content");
  if (elContent) elContent.textContent = content.length;

  const elRecs = document.getElementById("admin-total-recs");
  if (elRecs) elRecs.textContent = "1,842";

  const elProdViews = document.getElementById("admin-prod-views");
  if (elProdViews) elProdViews.textContent = "24,890";

  const elContentViews = document.getElementById("admin-content-views");
  if (elContentViews) elContentViews.textContent = "16,340";

  const elWishlist = document.getElementById("admin-wishlist-count");
  if (elWishlist) elWishlist.textContent = "518";

  const elRating = document.getElementById("admin-avg-rating");
  if (elRating) {
    const avg = products.reduce((acc, p) => acc + p.rating, 0) / (products.length || 1);
    elRating.textContent = avg.toFixed(2) + " ★";
  }

  // Render Recent Activity Logs
  const recentTable = document.getElementById("admin-recent-feedback-tbody");
  if (recentTable) {
    recentTable.innerHTML = feedback.slice(0, 5).map(fb => `
      <tr>
        <td><strong>${fb.user}</strong></td>
        <td><span class="badge ${fb.targetType === 'product' ? 'bg-primary-subtle text-primary' : 'bg-info-subtle text-info'}">${fb.targetType}</span> ${fb.targetName}</td>
        <td>${fb.rating} ★</td>
        <td><small class="text-muted text-truncate-2">${fb.comment}</small></td>
        <td><span class="badge ${fb.status === 'Resolved' ? 'bg-success' : fb.status === 'Reviewed' ? 'bg-primary' : 'bg-warning text-dark'}">${fb.status}</span></td>
      </tr>
    `).join("");
  }

  // Quick mini charts on dashboard if canvas exists
  initDashboardMiniCharts();
}

/**
 * Initialize Mini Charts on Admin Dashboard
 */
function initDashboardMiniCharts() {
  const chartCanvas = document.getElementById("dashboardTrendChart");
  if (!chartCanvas || !window.Chart) return;

  new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      datasets: [
        {
          label: "Recommendations Delivered",
          data: [650, 780, 920, 1150, 1340, 1480, 1620, 1750, 1842],
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79, 70, 229, 0.1)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Product Engagements",
          data: [420, 510, 680, 890, 1020, 1180, 1290, 1410, 1530],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.05)",
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

/**
 * Admin Product Management (admin/products.html)
 */
function initAdminProductsList() {
  initAdminAuthCheck();

  const tbody = document.getElementById("admin-products-tbody");
  if (!tbody) return;

  renderAdminProductsTable();

  // Search input
  const searchInput = document.getElementById("admin-product-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      renderAdminProductsTable(q);
    });
  }
}

function renderAdminProductsTable(query = "") {
  const tbody = document.getElementById("admin-products-tbody");
  if (!tbody) return;

  const products = getStoredProducts();
  const filtered = query 
    ? products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))
    : products;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No products found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <img src="${p.image}" alt="${p.name}" class="rounded-2" style="width: 48px; height: 48px; object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80';">
      </td>
      <td>
        <strong class="text-dark d-block">${p.name}</strong>
        <small class="text-muted">${p.brand}</small>
      </td>
      <td><span class="badge bg-light text-primary border">${p.category}</span></td>
      <td><strong class="text-dark">${formatINR(p.price)}</strong></td>
      <td>${p.rating} ★ <small class="text-muted">(${p.reviewsCount})</small></td>
      <td>
        <span class="badge ${p.inStock ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">
          ${p.inStock ? 'Active' : 'Out of Stock'}
        </span>
      </td>
      <td>
        <div class="btn-group btn-group-sm">
          <a href="../product-details.html?id=${p.id}" target="_blank" class="btn btn-outline-secondary" title="Preview Product">
            <i class="bi bi-eye"></i>
          </a>
          <button type="button" class="btn btn-outline-danger" onclick="deleteAdminProduct('${p.id}')" title="Delete Product">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function deleteAdminProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    let products = getStoredProducts();
    products = products.filter(p => p.id !== productId);
    localStorage.setItem("smartProducts", JSON.stringify(products));
    renderAdminProductsTable();
    showToast("Product deleted successfully.", "info");
  }
}

/**
 * Handle Add Product form submission (admin/add-product.html)
 */
function handleAddProduct(event) {
  event.preventDefault();

  const name = document.getElementById("prod-name")?.value.trim();
  const brand = document.getElementById("prod-brand")?.value.trim() || "SmartBrand";
  const category = document.getElementById("prod-category")?.value;
  const price = parseFloat(document.getElementById("prod-price")?.value) || 999;
  const originalPrice = parseFloat(document.getElementById("prod-orig-price")?.value) || price + 400;
  const image = document.getElementById("prod-image")?.value.trim() || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80";
  const description = document.getElementById("prod-description")?.value.trim() || "Premium product curated by SmartRecommend.";
  const featuresText = document.getElementById("prod-features")?.value.trim() || "";
  const inStock = document.getElementById("prod-instock")?.checked ?? true;

  if (!name || !category || !price) {
    showToast("Please provide product name, category, and price.", "warning");
    return false;
  }

  const features = featuresText ? featuresText.split("\n").map(f => f.trim()).filter(Boolean) : [
    "High quality materials",
    "Verified manufacturer warranty"
  ];

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const newProduct = {
    id: "prod-" + Date.now(),
    name: name,
    brand: brand,
    category: category,
    price: price,
    originalPrice: originalPrice,
    discount: discount > 0 ? discount : 15,
    rating: 4.8,
    reviewsCount: 1,
    isTrending: true,
    isFeatured: true,
    image: image,
    gallery: [image],
    description: description,
    features: features,
    inStock: inStock,
    dateAdded: new Date().toISOString().split("T")[0]
  };

  const products = getStoredProducts();
  products.unshift(newProduct);
  localStorage.setItem("smartProducts", JSON.stringify(products));

  showToast("New product added to catalog successfully!", "success");

  setTimeout(() => {
    window.location.href = "products.html";
  }, 900);

  return false;
}

/**
 * Admin Content Management (admin/content.html)
 */
function initAdminContentList() {
  initAdminAuthCheck();

  const tbody = document.getElementById("admin-content-tbody");
  if (!tbody) return;

  renderAdminContentTable();

  const searchInput = document.getElementById("admin-content-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      renderAdminContentTable(q);
    });
  }
}

function renderAdminContentTable(query = "") {
  const tbody = document.getElementById("admin-content-tbody");
  if (!tbody) return;

  const content = getStoredContent();
  const filtered = query 
    ? content.filter(c => c.title.toLowerCase().includes(query) || c.category.toLowerCase().includes(query) || c.author.toLowerCase().includes(query))
    : content;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No content found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <img src="${c.image}" alt="${c.title}" class="rounded-2" style="width: 48px; height: 48px; object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';">
      </td>
      <td>
        <strong class="text-dark d-block">${c.title}</strong>
        <small class="text-muted"><i class="bi bi-clock me-1"></i>${c.readingTime}</small>
      </td>
      <td><span class="badge bg-primary-subtle text-primary border">${c.category}</span></td>
      <td>${c.author}</td>
      <td>${c.views.toLocaleString()}</td>
      <td><span class="badge bg-success-subtle text-success">Published</span></td>
      <td>
        <div class="btn-group btn-group-sm">
          <a href="../content-details.html?id=${c.id}" target="_blank" class="btn btn-outline-secondary" title="View Article">
            <i class="bi bi-eye"></i>
          </a>
          <button type="button" class="btn btn-outline-danger" onclick="deleteAdminContent('${c.id}')" title="Delete Article">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function deleteAdminContent(contentId) {
  if (confirm("Are you sure you want to delete this article?")) {
    let content = getStoredContent();
    content = content.filter(c => c.id !== contentId);
    localStorage.setItem("smartContent", JSON.stringify(content));
    renderAdminContentTable();
    showToast("Content article deleted.", "info");
  }
}

/**
 * Handle Add Content form submission (admin/add-content.html)
 */
function handleAddContent(event) {
  event.preventDefault();

  const title = document.getElementById("art-title")?.value.trim();
  const category = document.getElementById("art-category")?.value;
  const author = document.getElementById("art-author")?.value.trim() || "Editorial Team";
  const readingTime = document.getElementById("art-reading-time")?.value.trim() || "5 min read";
  const image = document.getElementById("art-image")?.value.trim() || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
  const summary = document.getElementById("art-summary")?.value.trim();
  const body = document.getElementById("art-body")?.value.trim();

  if (!title || !category || !summary || !body) {
    showToast("Please fill in title, category, summary, and article body.", "warning");
    return false;
  }

  const newArticle = {
    id: "art-" + Date.now(),
    title: title,
    category: category,
    author: author,
    date: new Date().toISOString().split("T")[0],
    readingTime: readingTime,
    views: 120,
    rating: 5.0,
    image: image,
    summary: summary,
    body: body
  };

  const content = getStoredContent();
  content.unshift(newArticle);
  localStorage.setItem("smartContent", JSON.stringify(content));

  showToast("Article published successfully!", "success");

  setTimeout(() => {
    window.location.href = "content.html";
  }, 900);

  return false;
}

/**
 * Admin User Management (admin/users.html)
 */
function initAdminUsersList() {
  initAdminAuthCheck();

  const tbody = document.getElementById("admin-users-tbody");
  if (!tbody) return;

  const users = JSON.parse(localStorage.getItem("smartUsers") || "[]");

  tbody.innerHTML = users.map(u => `
    <tr>
      <td><code>${u.id}</code></td>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td>
        ${(u.interests || []).map(i => `<span class="badge bg-light text-dark border me-1">${i}</span>`).join("")}
      </td>
      <td>${u.joinedDate || '2026-01-10'}</td>
      <td>
        <span class="badge ${u.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
          ${u.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm ${u.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'} rounded-pill" onclick="toggleUserStatus('${u.id}')">
          ${u.status === 'Active' ? 'Disable' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join("");
}

function toggleUserStatus(userId) {
  const users = JSON.parse(localStorage.getItem("smartUsers") || "[]");
  const user = users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === "Active" ? "Disabled" : "Active";
    localStorage.setItem("smartUsers", JSON.stringify(users));
    initAdminUsersList();
    showToast(`User status updated to ${user.status}.`, "info");
  }
}

/**
 * Admin Categories Management (admin/categories.html)
 */
function initAdminCategories() {
  initAdminAuthCheck();

  const container = document.getElementById("admin-categories-grid");
  if (!container) return;

  const categories = getStoredCategories();

  container.innerHTML = categories.map(cat => `
    <div class="col-12 col-sm-6 col-lg-3 mb-4">
      <div class="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
        <div class="icon-circle bg-primary-subtle text-primary mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style="width: 60px; height: 60px;">
          <i class="bi ${cat.icon || 'bi-tag'} fs-3"></i>
        </div>
        <h5 class="fw-bold text-dark mb-1">${cat.name}</h5>
        <p class="text-muted small mb-3">${cat.description || 'Category'}</p>
        <span class="badge bg-light text-primary border rounded-pill mb-3">${cat.count || 4} Products</span>
        <button class="btn btn-outline-danger btn-sm rounded-pill" onclick="deleteAdminCategory('${cat.id}')">
          <i class="bi bi-trash me-1"></i> Delete
        </button>
      </div>
    </div>
  `).join("");
}

function handleAddCategory(event) {
  event.preventDefault();
  const name = document.getElementById("cat-name")?.value.trim();
  const icon = document.getElementById("cat-icon")?.value.trim() || "bi-tag";
  const desc = document.getElementById("cat-desc")?.value.trim() || "";

  if (!name) {
    showToast("Please enter a category name.", "warning");
    return false;
  }

  const categories = getStoredCategories();
  const newCat = {
    id: "cat-" + Date.now(),
    name: name,
    icon: icon,
    count: 0,
    description: desc
  };

  categories.push(newCat);
  localStorage.setItem("smartCategories", JSON.stringify(categories));

  showToast(`Category "${name}" added!`, "success");
  initAdminCategories();

  const modalEl = document.getElementById("addCategoryModal");
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
  return false;
}

function deleteAdminCategory(catId) {
  if (confirm("Delete this category?")) {
    let categories = getStoredCategories();
    categories = categories.filter(c => c.id !== catId);
    localStorage.setItem("smartCategories", JSON.stringify(categories));
    initAdminCategories();
    showToast("Category removed.", "info");
  }
}

/**
 * Admin Feedback Management (admin/feedback.html)
 */
function initAdminFeedback() {
  initAdminAuthCheck();

  const tbody = document.getElementById("admin-feedback-tbody");
  if (!tbody) return;

  const feedback = JSON.parse(localStorage.getItem("smartFeedback") || "[]");

  if (feedback.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No customer feedback recorded.</td></tr>`;
    return;
  }

  tbody.innerHTML = feedback.map(fb => `
    <tr>
      <td><strong>${fb.user}</strong><br><small class="text-muted">${fb.email}</small></td>
      <td><span class="badge ${fb.targetType === 'product' ? 'bg-primary-subtle text-primary' : 'bg-info-subtle text-info'}">${fb.targetType}</span></td>
      <td><strong>${fb.targetName}</strong></td>
      <td>${renderStarRating(fb.rating)}</td>
      <td><small class="text-secondary">${fb.comment}</small></td>
      <td>
        <span class="badge ${fb.status === 'Resolved' ? 'bg-success' : fb.status === 'Reviewed' ? 'bg-primary' : 'bg-warning text-dark'}">
          ${fb.status}
        </span>
      </td>
      <td>
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown">
            Status
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="updateFeedbackStatus('${fb.id}', 'New')">Mark New</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="updateFeedbackStatus('${fb.id}', 'Reviewed')">Mark Reviewed</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="updateFeedbackStatus('${fb.id}', 'Resolved')">Mark Resolved</a></li>
          </ul>
        </div>
      </td>
    </tr>
  `).join("");
}

function updateFeedbackStatus(id, newStatus) {
  const feedback = JSON.parse(localStorage.getItem("smartFeedback") || "[]");
  const item = feedback.find(f => f.id === id);
  if (item) {
    item.status = newStatus;
    localStorage.setItem("smartFeedback", JSON.stringify(feedback));
    initAdminFeedback();
    showToast(`Feedback status updated to ${newStatus}.`, "success");
  }
}

/**
 * Admin Analytics with Chart.js (admin/analytics.html)
 */
function initAdminAnalytics() {
  initAdminAuthCheck();
  if (!window.Chart) return;

  // 1. User Growth Line Chart
  const ctxUserGrowth = document.getElementById("chartUserGrowth")?.getContext("2d");
  if (ctxUserGrowth) {
    new Chart(ctxUserGrowth, {
      type: "line",
      data: {
        labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        datasets: [{
          label: "Active Registered Users",
          data: [28, 45, 68, 89, 114, 135],
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79, 70, 229, 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 5
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // 2. Product Views by Category Bar Chart
  const ctxProdViews = document.getElementById("chartProdViews")?.getContext("2d");
  if (ctxProdViews) {
    new Chart(ctxProdViews, {
      type: "bar",
      data: {
        labels: ["Electronics", "Fashion", "Books", "Beauty", "Sports", "Travel", "Lifestyle"],
        datasets: [{
          label: "Product Views",
          data: [6840, 4920, 3810, 2950, 3120, 2840, 1940],
          backgroundColor: "#2563eb",
          borderRadius: 8
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // 3. Popular Categories Distribution Doughnut Chart
  const ctxCatShare = document.getElementById("chartCatShare")?.getContext("2d");
  if (ctxCatShare) {
    new Chart(ctxCatShare, {
      type: "doughnut",
      data: {
        labels: ["Electronics", "Fashion", "Books", "Beauty", "Sports", "Travel", "Lifestyle"],
        datasets: [{
          data: [30, 22, 16, 12, 10, 6, 4],
          backgroundColor: ["#4f46e5", "#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#f97316", "#8b5cf6"]
        }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
  }

  // 4. Content Engagement Horizontal Bar Chart
  const ctxContentEng = document.getElementById("chartContentEng")?.getContext("2d");
  if (ctxContentEng) {
    new Chart(ctxContentEng, {
      type: "bar",
      indexAxis: "y",
      data: {
        labels: ["Rec Systems", "10 Trends", "Tech 2026", "AI Intro", "Ergonomics", "Travel Plan"],
        datasets: [{
          label: "Total Article Reads",
          data: [6180, 4520, 5410, 4890, 4120, 3820],
          backgroundColor: "#06b6d4",
          borderRadius: 6
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // 5. Recommendation CTR Line Chart
  const ctxRecCTR = document.getElementById("chartRecCTR")?.getContext("2d");
  if (ctxRecCTR) {
    new Chart(ctxRecCTR, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
        datasets: [{
          label: "Click-Through Rate (%)",
          data: [18.4, 21.2, 23.8, 25.4, 28.1, 31.6],
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // 6. Wishlist Activity Bar Chart
  const ctxWishlist = document.getElementById("chartWishlist")?.getContext("2d");
  if (ctxWishlist) {
    new Chart(ctxWishlist, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Items Wishlisted",
          data: [42, 58, 65, 78, 92, 124, 110],
          backgroundColor: "#ec4899",
          borderRadius: 6
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }
}

/**
 * Admin Settings Controller (admin/settings.html)
 */
function initAdminSettings() {
  initAdminAuthCheck();

  const resetBtn = document.getElementById("reset-demo-data-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all platform data, products, articles, users, and ratings to default seeds?")) {
        localStorage.clear();
        initMockDatabase();
        localStorage.setItem("smartAdminLogin", "true");
        showToast("System reset to original factory demo data!", "success");
        setTimeout(() => location.reload(), 800);
      }
    });
  }
}

// Auto-run checks based on present DOM elements
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("admin-total-users")) initAdminDashboard();
  if (document.getElementById("admin-products-tbody")) initAdminProductsList();
  if (document.getElementById("admin-content-tbody")) initAdminContentList();
  if (document.getElementById("admin-users-tbody")) initAdminUsersList();
  if (document.getElementById("admin-categories-grid")) initAdminCategories();
  if (document.getElementById("admin-feedback-tbody")) initAdminFeedback();
  if (document.getElementById("chartUserGrowth")) initAdminAnalytics();
  if (document.getElementById("reset-demo-data-btn")) initAdminSettings();
});
