/**
 * SMART RECOMMENDATION SYSTEM - Products Controller
 * Handles product catalog filtering, real-time search, sorting, URL parameter binding,
 * and single product detail view with image gallery and similar product recommendations.
 */

// Global catalog state
let activeFilters = {
  search: "",
  category: "All",
  priceRange: "all",
  minRating: 0,
  sortBy: "popular"
};

/**
 * Initialize the Product Catalog Page (products.html)
 */
function initProductsPage() {
  const container = document.getElementById("products-grid");
  if (!container) return;

  // Read URL query parameters (e.g. ?category=Electronics or ?search=shoes)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  const searchParam = urlParams.get("search");

  if (categoryParam) {
    activeFilters.category = categoryParam;
    const catRadio = document.querySelector(`input[name="filter-category"][value="${categoryParam}"]`);
    if (catRadio) catRadio.checked = true;
  }

  if (searchParam) {
    activeFilters.search = searchParam;
    const searchInput = document.getElementById("product-search-input");
    if (searchInput) searchInput.value = searchParam;
  }

  // Setup event listeners
  setupFilterListeners();

  // Initial render
  renderFilteredProducts();
}

/**
 * Setup listeners for filters, search inputs, and sort dropdowns
 */
function setupFilterListeners() {
  // Search input with debounce
  const searchInput = document.getElementById("product-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeFilters.search = e.target.value.trim().toLowerCase();
      renderFilteredProducts();
    });
  }

  // Category filter changes
  document.querySelectorAll("input[name='filter-category']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      activeFilters.category = e.target.value;
      renderFilteredProducts();
    });
  });

  // Price range filter changes
  document.querySelectorAll("input[name='filter-price']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      activeFilters.priceRange = e.target.value;
      renderFilteredProducts();
    });
  });

  // Rating filter changes
  document.querySelectorAll("input[name='filter-rating']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      activeFilters.minRating = parseFloat(e.target.value) || 0;
      renderFilteredProducts();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById("product-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeFilters.sortBy = e.target.value;
      renderFilteredProducts();
    });
  }

  // Reset Filters Button
  const resetBtn = document.getElementById("reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetAllFilters();
    });
  }
}

/**
 * Filter, sort, and render product cards
 */
function renderFilteredProducts() {
  const container = document.getElementById("products-grid");
  const countBadge = document.getElementById("products-count");
  if (!container) return;

  const allProducts = getStoredProducts();

  // Apply filters
  let filtered = allProducts.filter(p => {
    // 1. Search Query
    if (activeFilters.search) {
      const q = activeFilters.search;
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchBrand && !matchDesc) return false;
    }

    // 2. Category
    if (activeFilters.category !== "All" && p.category.toLowerCase() !== activeFilters.category.toLowerCase()) {
      return false;
    }

    // 3. Price Range
    if (activeFilters.priceRange === "under-500" && p.price >= 500) return false;
    if (activeFilters.priceRange === "500-1000" && (p.price < 500 || p.price > 1000)) return false;
    if (activeFilters.priceRange === "1000-5000" && (p.price < 1000 || p.price > 5000)) return false;
    if (activeFilters.priceRange === "above-5000" && p.price <= 5000) return false;

    // 4. Rating
    if (activeFilters.minRating > 0 && p.rating < activeFilters.minRating) return false;

    return true;
  });

  // Apply Sorting
  filtered.sort((a, b) => {
    switch (activeFilters.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      case "popular":
      default:
        return b.reviewsCount - a.reviewsCount;
    }
  });

  // Update count display
  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} of ${allProducts.length} products`;
  }

  // Render cards or empty state
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 py-5 text-center empty-state-container">
        <div class="empty-state-icon mb-3">
          <i class="bi bi-search text-muted" style="font-size: 3.5rem;"></i>
        </div>
        <h4 class="fw-bold text-dark">No products found</h4>
        <p class="text-muted mb-4">We couldn't find any products matching your current filters or search term.</p>
        <button class="btn btn-primary rounded-pill px-4" onclick="resetAllFilters()">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
        </button>
      </div>
    `;
    return;
  }

  // Render cards with animation
  container.innerHTML = filtered.map(product => {
    const scored = recommendationEngine.scoreProduct(product);
    return createProductCardHTML(product, scored.score >= 5 ? scored.explanation : "");
  }).join("");
}

/**
 * Reset all active filters
 */
function resetAllFilters() {
  activeFilters = {
    search: "",
    category: "All",
    priceRange: "all",
    minRating: 0,
    sortBy: "popular"
  };

  const searchInput = document.getElementById("product-search-input");
  if (searchInput) searchInput.value = "";

  const allCatRadio = document.querySelector("input[name='filter-category'][value='All']");
  if (allCatRadio) allCatRadio.checked = true;

  const allPriceRadio = document.querySelector("input[name='filter-price'][value='all']");
  if (allPriceRadio) allPriceRadio.checked = true;

  const allRatingRadio = document.querySelector("input[name='filter-rating'][value='0']");
  if (allRatingRadio) allRatingRadio.checked = true;

  const sortSelect = document.getElementById("product-sort-select");
  if (sortSelect) sortSelect.value = "popular";

  renderFilteredProducts();
  showToast("Filters reset to default", "info");
}

/**
 * Initialize Single Product Details Page (product-details.html)
 */
function initProductDetailsPage() {
  const container = document.getElementById("product-details-container");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    window.location.href = "products.html";
    return;
  }

  const products = getStoredProducts();
  const product = products.find(p => p.id === productId);

  if (!product) {
    container.innerHTML = `
      <div class="col-12 py-5 text-center">
        <h3 class="text-danger mb-3">Product Not Found</h3>
        <p class="text-muted">The product you are looking for does not exist or has been removed.</p>
        <a href="products.html" class="btn btn-primary rounded-pill px-4">Browse All Products</a>
      </div>
    `;
    return;
  }

  // Track product view in history
  trackProductView(product.id);

  // Update Page Title
  document.title = `${product.name} - SmartRecommend`;

  // Render product details
  const wishlist = getStoredWishlist();
  const isWishlisted = wishlist.includes(product.id);
  const images = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image];

  container.innerHTML = `
    <div class="col-12 col-lg-6 mb-5">
      <div class="product-gallery-card card border-0 shadow-sm p-3 rounded-4">
        <div class="main-image-container position-relative overflow-hidden rounded-3 mb-3 bg-light text-center" style="height: 420px;">
          <img id="main-product-img" src="${images[0]}" alt="${product.name}" class="img-fluid h-100 object-fit-contain p-3 transition-transform" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80';">
          <span class="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill fs-6">-${product.discount}% OFF</span>
        </div>
        <div class="d-flex gap-2 thumbnail-row overflow-x-auto pb-2">
          ${images.map((img, idx) => `
            <button type="button" class="btn p-1 border rounded-3 gallery-thumb ${idx === 0 ? 'border-primary shadow-sm' : ''}" onclick="swapMainImage('${img}', this)">
              <img src="${img}" alt="Thumbnail ${idx + 1}" style="width: 70px; height: 70px; object-fit: cover;" class="rounded-2">
            </button>
          `).join("")}
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-6 mb-5">
      <div class="product-info-wrap ps-lg-4">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="badge bg-light text-primary border rounded-pill px-3 py-1 fs-6">${product.category}</span>
          <span class="text-muted fw-medium">•</span>
          <span class="text-muted fw-semibold">${product.brand}</span>
          <span class="ms-auto badge ${product.inStock ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger'} rounded-pill px-3 py-1">
            <i class="bi ${product.inStock ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1"></i> ${product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <h1 class="product-title fs-2 fw-bold text-dark mb-3">${product.name}</h1>

        <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          ${renderStarRating(product.rating, product.reviewsCount)}
          <span class="text-muted">•</span>
          <span class="text-success fw-semibold"><i class="bi bi-shield-check me-1"></i>Verified Quality</span>
        </div>

        <div class="pricing-wrap mb-4">
          <div class="d-flex align-items-baseline gap-3">
            <span class="fs-1 fw-extrabold text-primary">${formatINR(product.price)}</span>
            <span class="fs-4 text-muted text-decoration-line-through">${formatINR(product.originalPrice)}</span>
            <span class="badge bg-danger-subtle text-danger border border-danger rounded-pill px-3 py-1 fw-bold">Save ${formatINR(product.originalPrice - product.price)}</span>
          </div>
          <small class="text-muted d-block mt-1">Inclusive of all taxes. Free shipping on orders over ₹999.</small>
        </div>

        <div class="description-wrap mb-4">
          <h6 class="fw-bold text-dark mb-2">Product Description</h6>
          <p class="text-secondary leading-relaxed">${product.description}</p>
        </div>

        ${product.features && product.features.length > 0 ? `
          <div class="features-wrap mb-4">
            <h6 class="fw-bold text-dark mb-2">Key Highlights & Specifications</h6>
            <ul class="list-unstyled">
              ${product.features.map(f => `
                <li class="d-flex align-items-center mb-2 text-secondary">
                  <i class="bi bi-check2-circle text-primary me-2 fs-5"></i>
                  <span>${f}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        ` : ''}

        <div class="action-buttons-wrap d-flex flex-wrap gap-3 pt-3 border-top">
          <button class="btn btn-outline-danger rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2 wishlist-action-btn ${isWishlisted ? 'active' : ''}" 
                  id="detail-wishlist-btn"
                  onclick="toggleDetailWishlist('${product.id}')">
            <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'} fs-5"></i>
            <span>${isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
          </button>
          
          <button class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  onclick="handleAddToCartDemo('${product.name}')">
            <i class="bi bi-cart-plus-fill fs-5"></i>
            <span>Add to Cart</span>
          </button>

          <button class="btn btn-warning rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center gap-2"
                  onclick="handleBuyNowDemo('${product.name}', ${product.price})">
            <i class="bi bi-lightning-charge-fill fs-5"></i>
            <span>Buy Now</span>
          </button>
        </div>

        <div class="reasons-box mt-4 p-3 bg-light rounded-3 border">
          <div class="d-flex align-items-center gap-2 text-primary fw-semibold mb-1">
            <i class="bi bi-stars"></i> Why SmartRecommend picked this for you:
          </div>
          <small class="text-muted">
            Categorized under <strong>${product.category}</strong>. Matches consumer interest benchmarks and high customer satisfaction ratings (>4.5★).
          </small>
        </div>
      </div>
    </div>
  `;

  // Render "You May Also Like" similar products
  renderSimilarProducts(product.category, product.id);
}

// Gallery thumbnail swap function
function swapMainImage(imgUrl, thumbBtn) {
  const mainImg = document.getElementById("main-product-img");
  if (mainImg) mainImg.src = imgUrl;

  document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("border-primary", "shadow-sm"));
  if (thumbBtn) thumbBtn.classList.add("border-primary", "shadow-sm");
}

// Wishlist toggle on details page
function toggleDetailWishlist(productId) {
  toggleWishlist(productId, (isAdded) => {
    const btn = document.getElementById("detail-wishlist-btn");
    if (btn) {
      btn.classList.toggle("active", isAdded);
      btn.innerHTML = `<i class="bi ${isAdded ? 'bi-heart-fill' : 'bi-heart'} fs-5"></i> <span>${isAdded ? 'In Wishlist' : 'Add to Wishlist'}</span>`;
    }
  });
}

// Add to Cart demo action
function handleAddToCartDemo(productName) {
  showToast(`"${productName}" added to your cart! (Demo)`, "success");
}

// Buy Now demo action
function handleBuyNowDemo(productName, price) {
  showToast(`Proceeding to demo checkout for ${productName} (${formatINR(price)})`, "info");
}

// Render "You May Also Like"
function renderSimilarProducts(category, excludeId) {
  const container = document.getElementById("similar-products-grid");
  if (!container) return;

  const similarList = recommendationEngine.getRelatedProducts(category, excludeId, 4);

  if (similarList.length === 0) {
    container.closest("section")?.classList.add("d-none");
    return;
  }

  container.innerHTML = similarList.map(prod => 
    createProductCardHTML(prod, `Similar to this product in ${category}`)
  ).join("");
}

// Auto-run page check
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("products-grid")) {
    initProductsPage();
  }
  if (document.getElementById("product-details-container")) {
    initProductDetailsPage();
  }
});
