/**
 * SMART RECOMMENDATION SYSTEM - Profile Controller
 * Manages user profile display, selectable interest pills, activity summary stats, and profile editing.
 */

const AVAILABLE_INTERESTS = [
  "Technology",
  "Fashion",
  "Books",
  "Beauty",
  "Sports",
  "Travel",
  "Food",
  "Lifestyle"
];

function initProfilePage() {
  const profileContainer = document.getElementById("profile-main-container");
  if (!profileContainer) return;

  const user = getStoredUser() || DEMO_USER;
  const wishlist = getStoredWishlist();
  const recentlyViewed = JSON.parse(localStorage.getItem("smartRecentlyViewed") || "[]");
  const contentHistory = JSON.parse(localStorage.getItem("smartContentHistory") || "[]");
  const ratings = JSON.parse(localStorage.getItem("smartRatings") || "{}");
  const ratingsCount = Object.keys(ratings).length;

  // 1. Populate Profile Details Card
  const avatarEl = document.getElementById("profile-avatar-initial");
  if (avatarEl) avatarEl.textContent = user.name ? user.name.charAt(0) : "U";

  const nameEl = document.getElementById("profile-name-display");
  if (nameEl) nameEl.textContent = user.name;

  const emailEl = document.getElementById("profile-email-display");
  if (emailEl) emailEl.textContent = user.email;

  const ageEl = document.getElementById("profile-age-display");
  if (ageEl) ageEl.textContent = user.age || "26";

  const locationEl = document.getElementById("profile-location-display");
  if (locationEl) locationEl.textContent = user.location || "India";

  const joinedEl = document.getElementById("profile-joined-display");
  if (joinedEl) joinedEl.textContent = user.joinedDate || "2026-01-10";

  // 2. Populate Activity Summary Stats
  const statViewed = document.getElementById("stat-products-viewed");
  if (statViewed) statViewed.textContent = recentlyViewed.length;

  const statWishlist = document.getElementById("stat-wishlist-count");
  if (statWishlist) statWishlist.textContent = wishlist.length;

  const statContent = document.getElementById("stat-content-read");
  if (statContent) statContent.textContent = contentHistory.length;

  const statRatings = document.getElementById("stat-ratings-given");
  if (statRatings) statRatings.textContent = ratingsCount;

  // 3. Populate Interests Selector Pills
  renderProfileInterests(user.interests || []);

  // 4. Fill edit profile modal fields
  const editName = document.getElementById("edit-name");
  const editEmail = document.getElementById("edit-email");
  const editAge = document.getElementById("edit-age");
  const editLocation = document.getElementById("edit-location");

  if (editName) editName.value = user.name;
  if (editEmail) editEmail.value = user.email;
  if (editAge) editAge.value = user.age || 26;
  if (editLocation) editLocation.value = user.location || "India";
}

/**
 * Render interactive interest badges that user can click to toggle
 */
function renderProfileInterests(userInterests) {
  const container = document.getElementById("profile-interests-container");
  if (!container) return;

  container.innerHTML = AVAILABLE_INTERESTS.map(interest => {
    const isSelected = userInterests.some(i => i.toLowerCase() === interest.toLowerCase());
    return `
      <button type="button" 
              class="btn btn-sm rounded-pill px-3 py-2 m-1 interest-toggle-btn ${isSelected ? 'btn-primary shadow-sm' : 'btn-outline-secondary'}"
              data-interest="${interest}"
              onclick="toggleProfileInterest('${interest}')">
        <i class="bi ${isSelected ? 'bi-check-circle-fill' : 'bi-plus-circle'} me-1"></i>
        ${interest}
      </button>
    `;
  }).join("");
}

/**
 * Toggle an interest and immediately sync to LocalStorage
 */
function toggleProfileInterest(interest) {
  const user = getStoredUser() || DEMO_USER;
  let interests = user.interests || [];

  const index = interests.findIndex(i => i.toLowerCase() === interest.toLowerCase());
  if (index > -1) {
    if (interests.length <= 1) {
      showToast("You must maintain at least one interest for recommendations.", "warning");
      return;
    }
    interests.splice(index, 1);
    showToast(`Removed "${interest}" from your preferences.`, "info");
  } else {
    interests.push(interest);
    showToast(`Added "${interest}" to your preferences! Recommendations updated.`, "success");
  }

  user.interests = interests;
  localStorage.setItem("smartUser", JSON.stringify(user));
  localStorage.setItem("smartPreferences", JSON.stringify(interests));

  renderProfileInterests(interests);
}

/**
 * Save edited profile details from modal form
 */
function saveProfileChanges(event) {
  if (event) event.preventDefault();

  const nameInput = document.getElementById("edit-name");
  const emailInput = document.getElementById("edit-email");
  const ageInput = document.getElementById("edit-age");
  const locationInput = document.getElementById("edit-location");

  const user = getStoredUser() || DEMO_USER;

  if (nameInput) user.name = nameInput.value.trim() || user.name;
  if (emailInput) user.email = emailInput.value.trim() || user.email;
  if (ageInput) user.age = parseInt(ageInput.value, 10) || user.age;
  if (locationInput) user.location = locationInput.value.trim() || user.location;

  localStorage.setItem("smartUser", JSON.stringify(user));

  // Dismiss modal if Bootstrap modal instance exists
  const modalEl = document.getElementById("editProfileModal");
  if (modalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }

  initProfilePage();
  showToast("Profile details updated successfully!", "success");
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("profile-main-container")) {
    initProfilePage();
  }
});
