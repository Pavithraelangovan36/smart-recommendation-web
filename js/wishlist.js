/**
 * SMART RECOMMENDATION SYSTEM - Wishlist Controller
 * Manages saved products, real-time removal, empty state management, and batch demo actions.
 */

function initWishlistPage() {
  const container = document.getElementById("wishlist-grid");
  const emptyState = document.getElementById("wishlist-empty-state");
  const countBadge = document.getElementById("wishlist-count-badge");
  const actionsWrap = document.getElementById("wishlist-actions-bar");

  if (!container) return;

  const wishlistIds = getStoredWishlist();
  const allProducts = getStoredProducts();
  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  if (countBadge) {
    countBadge.textContent = `${wishlistProducts.length} items saved`;
  }

  if (wishlistProducts.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("d-none");
    if (actionsWrap) actionsWrap.classList.add("d-none");
    return;
  }

  if (emptyState) emptyState.classList.add("d-none");
  if (actionsWrap) actionsWrap.classList.remove("d-none");

  container.innerHTML = wishlistProducts.map(product => `
    <div class="col-12 col-md-6 col-lg-4 mb-4 wishlist-item" id="wishlist-col-${product.id}">
      <div class="card h-100 product-card shadow-sm border-0 position-relative">
        <div class="product-img-wrap position-relative overflow-hidden">
          <img src="${product.image}" class="card-img-top product-img" alt="${product.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80';">
          <span class="badge bg-danger position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill">-${product.discount}%</span>
          <button class="btn btn-danger position-absolute top-0 end-0 m-3 rounded-circle shadow-sm" 
                  title="Remove from Wishlist"
                  onclick="removeWishlistItem('${product.id}')">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>
        <div class="card-body d-flex flex-column p-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="badge bg-light text-primary border rounded-pill category-pill">${product.category}</span>
            <small class="text-muted">${product.brand}</small>
          </div>
          <h6 class="card-title product-title mb-2 text-truncate-2">
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
  `).join("");
}

function removeWishlistItem(productId) {
  const col = document.getElementById(`wishlist-col-${productId}`);
  if (col) {
    col.style.transition = "all 0.35s ease";
    col.style.transform = "scale(0.85)";
    col.style.opacity = "0";
    setTimeout(() => {
      toggleWishlist(productId, () => {
        initWishlistPage();
      });
    }, 300);
  } else {
    toggleWishlist(productId, () => {
      initWishlistPage();
    });
  }
}

function clearAllWishlist() {
  if (confirm("Are you sure you want to remove all items from your wishlist?")) {
    localStorage.setItem("smartWishlist", JSON.stringify([]));
    updateWishlistCountBadge();
    initWishlistPage();
    showToast("Wishlist cleared", "info");
  }
}

function addAllWishlistToCartDemo() {
  const ids = getStoredWishlist();
  if (ids.length === 0) return;
  showToast(`All ${ids.length} items moved to your cart! (Demo)`, "success");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("wishlist-grid")) {
    initWishlistPage();
  }
});
