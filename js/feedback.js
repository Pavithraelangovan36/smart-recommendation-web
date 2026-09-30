/**
 * SMART RECOMMENDATION SYSTEM - Feedback Controller
 * Handles 5-star rating component, feedback form submission, and customer review logs.
 */

let selectedFeedbackRating = 5;

function initFeedbackPage() {
  const form = document.getElementById("feedback-form");
  if (!form) return;

  // Populate product/content target dropdown
  populateFeedbackTargetDropdown();

  // Setup interactive star rating
  setupFeedbackStarPicker();

  // Render previous feedback submissions
  renderFeedbackHistory();
}

function populateFeedbackTargetDropdown() {
  const select = document.getElementById("feedback-target-select");
  if (!select) return;

  const products = getStoredProducts();
  const content = getStoredContent();

  let html = `<option value="" disabled selected>-- Select an item to review --</option>`;
  html += `<optgroup label="Products">`;
  products.forEach(p => {
    html += `<option value="product::${p.name}">${p.name} (${p.category})</option>`;
  });
  html += `</optgroup>`;

  html += `<optgroup label="Articles & Content">`;
  content.forEach(c => {
    html += `<option value="content::${c.title}">${c.title} (${c.category})</option>`;
  });
  html += `</optgroup>`;

  select.innerHTML = html;
}

function setupFeedbackStarPicker() {
  const stars = document.querySelectorAll("#feedback-star-picker .star-icon");
  const label = document.getElementById("feedback-rating-text");

  stars.forEach(star => {
    star.addEventListener("click", function () {
      const val = parseInt(this.getAttribute("data-val"), 10);
      selectedFeedbackRating = val;
      updateStarPickerUI(val);
    });

    star.addEventListener("mouseenter", function () {
      const val = parseInt(this.getAttribute("data-val"), 10);
      highlightStarPickerUI(val);
    });
  });

  const starContainer = document.getElementById("feedback-star-picker");
  if (starContainer) {
    starContainer.addEventListener("mouseleave", () => {
      updateStarPickerUI(selectedFeedbackRating);
    });
  }
}

function updateStarPickerUI(rating) {
  const stars = document.querySelectorAll("#feedback-star-picker .star-icon");
  const label = document.getElementById("feedback-rating-text");

  stars.forEach((s, idx) => {
    if (idx < rating) {
      s.className = "bi bi-star-fill text-warning star-icon cursor-pointer fs-2 me-1";
    } else {
      s.className = "bi bi-star text-muted star-icon cursor-pointer fs-2 me-1";
    }
  });

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
  if (label) label.textContent = `${rating} / 5 (${ratingLabels[rating - 1] || 'Good'})`;
}

function highlightStarPickerUI(hoverVal) {
  const stars = document.querySelectorAll("#feedback-star-picker .star-icon");
  stars.forEach((s, idx) => {
    if (idx < hoverVal) {
      s.className = "bi bi-star-fill text-warning star-icon cursor-pointer fs-2 me-1";
    } else {
      s.className = "bi bi-star text-muted star-icon cursor-pointer fs-2 me-1";
    }
  });
}

function handleFeedbackSubmit(event) {
  event.preventDefault();

  const select = document.getElementById("feedback-target-select");
  const commentInput = document.getElementById("feedback-text");
  const user = getStoredUser() || DEMO_USER;

  if (!select || !select.value) {
    showToast("Please choose a product or article to review.", "warning");
    return false;
  }

  const comment = commentInput ? commentInput.value.trim() : "";
  if (!comment) {
    showToast("Please provide your review feedback.", "warning");
    return false;
  }

  const [targetType, targetName] = select.value.split("::");

  const newFeedback = {
    id: "fb-" + Date.now(),
    user: user.name,
    email: user.email,
    targetType: targetType || "product",
    targetName: targetName || select.value,
    rating: selectedFeedbackRating,
    comment: comment,
    date: new Date().toISOString().split("T")[0],
    status: "New"
  };

  const storedFeedback = JSON.parse(localStorage.getItem("smartFeedback") || "[]");
  storedFeedback.unshift(newFeedback);
  localStorage.setItem("smartFeedback", JSON.stringify(storedFeedback));

  showToast("Thank you for your feedback! Your review has been recorded.", "success");

  // Reset form
  select.selectedIndex = 0;
  if (commentInput) commentInput.value = "";
  selectedFeedbackRating = 5;
  updateStarPickerUI(5);

  renderFeedbackHistory();
  return false;
}

function renderFeedbackHistory() {
  const container = document.getElementById("feedback-history-list");
  if (!container) return;

  const storedFeedback = JSON.parse(localStorage.getItem("smartFeedback") || "[]");

  if (storedFeedback.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-center text-muted">
        <i class="bi bi-chat-square-dots fs-2 mb-2 d-block"></i>
        No feedback submitted yet. Be the first to share your experience!
      </div>
    `;
    return;
  }

  container.innerHTML = storedFeedback.slice(0, 10).map(fb => `
    <div class="card border-0 shadow-sm rounded-3 mb-3 p-3 bg-white">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <span class="badge ${fb.targetType === 'product' ? 'bg-primary-subtle text-primary border border-primary' : 'bg-info-subtle text-info border border-info'} rounded-pill me-2">
            ${fb.targetType === 'product' ? 'Product Review' : 'Article Review'}
          </span>
          <strong class="text-dark">${fb.targetName}</strong>
        </div>
        <small class="text-muted">${fb.date}</small>
      </div>
      <div class="mb-2">
        ${renderStarRating(fb.rating)}
      </div>
      <p class="text-secondary small mb-2">${fb.comment}</p>
      <div class="d-flex justify-content-between align-items-center small text-muted pt-2 border-top">
        <span>By <strong>${fb.user}</strong></span>
        <span class="badge ${fb.status === 'Resolved' ? 'bg-success' : fb.status === 'Reviewed' ? 'bg-primary' : 'bg-secondary'} rounded-pill">${fb.status}</span>
      </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("feedback-form")) {
    initFeedbackPage();
  }
});
