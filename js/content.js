/**
 * SMART RECOMMENDATION SYSTEM - Digital Content Controller
 * Handles article directory, category filtering, search, article reader details,
 * in-article 5-star rating feedback widget, and recommended related articles.
 */

let activeContentCategory = "All";
let activeContentSearch = "";

/**
 * Initialize Content Hub (content.html)
 */
function initContentPage() {
  const gridContainer = document.getElementById("content-grid");
  if (!gridContainer) return;

  // Read URL query parameter if present
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  const searchParam = urlParams.get("search");

  if (catParam) activeContentCategory = catParam;
  if (searchParam) activeContentSearch = searchParam.toLowerCase();

  // Setup search input listener
  const searchInput = document.getElementById("content-search-input");
  if (searchInput) {
    if (activeContentSearch) searchInput.value = activeContentSearch;
    searchInput.addEventListener("input", (e) => {
      activeContentSearch = e.target.value.trim().toLowerCase();
      renderFilteredContent();
    });
  }

  // Setup category pills
  setupContentCategoryTabs();

  // Initial render
  renderFilteredContent();
}

/**
 * Setup category filter tabs
 */
function setupContentCategoryTabs() {
  const tabsContainer = document.getElementById("content-category-tabs");
  if (!tabsContainer) return;

  const content = getStoredContent();
  const categories = ["All", ...new Set(content.map(c => c.category))];

  tabsContainer.innerHTML = categories.map(cat => `
    <button type="button" 
            class="btn btn-sm rounded-pill px-3 py-2 content-cat-btn ${cat.toLowerCase() === activeContentCategory.toLowerCase() ? 'btn-primary' : 'btn-outline-secondary'}"
            data-cat="${cat}"
            onclick="selectContentCategory('${cat}', this)">
      ${cat}
    </button>
  `).join("");
}

/**
 * Select a content category
 */
function selectContentCategory(category, buttonEl) {
  activeContentCategory = category;

  document.querySelectorAll(".content-cat-btn").forEach(btn => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-secondary");
  });
  if (buttonEl) {
    buttonEl.classList.remove("btn-outline-secondary");
    buttonEl.classList.add("btn-primary");
  }

  renderFilteredContent();
}

/**
 * Render filtered articles
 */
function renderFilteredContent() {
  const gridContainer = document.getElementById("content-grid");
  const countBadge = document.getElementById("content-count");
  if (!gridContainer) return;

  const content = getStoredContent();

  let filtered = content.filter(art => {
    // 1. Category check
    if (activeContentCategory !== "All" && art.category.toLowerCase() !== activeContentCategory.toLowerCase()) {
      return false;
    }
    // 2. Search check
    if (activeContentSearch) {
      const q = activeContentSearch;
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSummary = art.summary.toLowerCase().includes(q);
      const matchCat = art.category.toLowerCase().includes(q);
      const matchAuthor = art.author.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchCat && !matchAuthor) return false;
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} of ${content.length} articles`;
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-12 py-5 text-center">
        <i class="bi bi-journal-x text-muted" style="font-size: 3.5rem;"></i>
        <h4 class="fw-bold text-dark mt-3">No articles found</h4>
        <p class="text-muted">Try adjusting your category selection or search keywords.</p>
        <button class="btn btn-primary rounded-pill px-4" onclick="selectContentCategory('All', null); renderFilteredContent();">
          Show All Articles
        </button>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map(art => createContentCardHTML(art)).join("");
}

/**
 * Initialize Single Article Reader Page (content-details.html)
 */
function initContentDetailsPage() {
  const container = document.getElementById("content-details-container");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  if (!articleId) {
    window.location.href = "content.html";
    return;
  }

  const content = getStoredContent();
  const article = content.find(c => c.id === articleId);

  if (!article) {
    container.innerHTML = `
      <div class="col-12 py-5 text-center">
        <h3 class="text-danger mb-3">Article Not Found</h3>
        <p class="text-muted">The publication you requested is not available.</p>
        <a href="content.html" class="btn btn-primary rounded-pill px-4">Browse Content</a>
      </div>
    `;
    return;
  }

  // Track content view in user history
  trackContentView(article.id);

  document.title = `${article.title} - SmartRecommend`;

  // Format body text with paragraphs
  const formattedBody = article.body.split("\n\n").map(paragraph => {
    paragraph = paragraph.trim();
    if (paragraph.startsWith("### ")) {
      return `<h3 class="fw-bold fs-4 text-dark mt-4 mb-3">${paragraph.replace("### ", "")}</h3>`;
    }
    if (paragraph.startsWith("- ")) {
      const items = paragraph.split("\n").map(li => `<li>${li.replace("- ", "")}</li>`).join("");
      return `<ul class="my-3 text-secondary">${items}</ul>`;
    }
    return `<p class="article-paragraph text-secondary fs-5 leading-relaxed mb-4">${paragraph}</p>`;
  }).join("");

  container.innerHTML = `
    <div class="col-12 col-lg-8 mx-auto">
      <div class="article-header mb-4">
        <a href="content.html" class="text-decoration-none text-primary fw-semibold small d-inline-flex align-items-center mb-3">
          <i class="bi bi-arrow-left me-1"></i> Back to Content Library
        </a>
        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="badge bg-primary rounded-pill px-3 py-1 fs-6">${article.category}</span>
          <span class="text-muted">•</span>
          <span class="text-muted"><i class="bi bi-clock me-1"></i>${article.readingTime}</span>
          <span class="text-muted">•</span>
          <span class="text-muted"><i class="bi bi-eye me-1"></i>${article.views.toLocaleString()} views</span>
        </div>
        <h1 class="article-headline fw-extrabold text-dark display-6 mb-4">${article.title}</h1>
        <div class="d-flex align-items-center justify-content-between py-3 border-top border-bottom">
          <div class="d-flex align-items-center">
            <div class="author-avatar bg-primary text-white rounded-circle me-3 fw-bold fs-5 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
              ${article.author ? article.author.charAt(0) : 'E'}
            </div>
            <div>
              <div class="fw-bold text-dark">${article.author}</div>
              <small class="text-muted">Published on ${article.date}</small>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary btn-sm rounded-circle" onclick="navigator.clipboard.writeText(window.location.href); showToast('Article link copied to clipboard!', 'info');" title="Share Article">
              <i class="bi bi-share"></i>
            </button>
            <button class="btn btn-outline-secondary btn-sm rounded-circle" onclick="showToast('Article saved to your reading list!', 'success');" title="Bookmark Article">
              <i class="bi bi-bookmark"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="article-cover-wrap mb-5 rounded-4 overflow-hidden shadow-sm">
        <img src="${article.image}" alt="${article.title}" class="img-fluid w-100 object-fit-cover" style="max-height: 440px;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';">
      </div>

      <div class="article-lead p-4 bg-light rounded-3 border-start border-4 border-primary mb-4">
        <p class="fs-5 fst-italic text-dark mb-0 fw-medium">${article.summary}</p>
      </div>

      <div class="article-body">
        ${formattedBody}
      </div>

      <!-- Article In-Line Rating & Feedback Widget -->
      <div class="card mt-5 p-4 border-0 shadow-sm rounded-4 bg-light">
        <h5 class="fw-bold text-dark mb-1">Was this article helpful?</h5>
        <p class="text-muted small mb-3">Your ratings refine future recommendations for you and the community.</p>
        <div class="star-rating-widget d-flex align-items-center gap-2 mb-3 fs-3" id="article-star-rating">
          <i class="bi bi-star star-click text-warning cursor-pointer" data-val="1" onclick="setArticleRating(1)"></i>
          <i class="bi bi-star star-click text-warning cursor-pointer" data-val="2" onclick="setArticleRating(2)"></i>
          <i class="bi bi-star star-click text-warning cursor-pointer" data-val="3" onclick="setArticleRating(3)"></i>
          <i class="bi bi-star star-click text-warning cursor-pointer" data-val="4" onclick="setArticleRating(4)"></i>
          <i class="bi bi-star star-click text-warning cursor-pointer" data-val="5" onclick="setArticleRating(5)"></i>
          <span class="fs-6 text-muted ms-2" id="article-rating-label">Click to rate</span>
        </div>
        <div class="input-group">
          <input type="text" id="article-feedback-comment" class="form-control rounded-start-pill" placeholder="Share your key takeaway or feedback...">
          <button class="btn btn-primary rounded-end-pill px-4" type="button" onclick="submitArticleFeedback('${article.id}', '${article.title.replace(/'/g, "\\'")}')">
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  `;

  // Render "Recommended Articles" at the bottom
  renderRecommendedArticles(article.id);
}

let currentSelectedRating = 5;

function setArticleRating(val) {
  currentSelectedRating = val;
  const stars = document.querySelectorAll("#article-star-rating .star-click");
  stars.forEach((s, idx) => {
    if (idx < val) {
      s.className = "bi bi-star-fill star-click text-warning cursor-pointer";
    } else {
      s.className = "bi bi-star star-click text-warning cursor-pointer";
    }
  });
  const label = document.getElementById("article-rating-label");
  if (label) label.textContent = `${val} out of 5 stars`;
}

function submitArticleFeedback(articleId, articleTitle) {
  const commentInput = document.getElementById("article-feedback-comment");
  const comment = commentInput ? commentInput.value.trim() : "";
  const user = getStoredUser() || DEMO_USER;

  const newFeedback = {
    id: "fb-" + Date.now(),
    user: user.name,
    email: user.email,
    targetType: "content",
    targetName: articleTitle,
    rating: currentSelectedRating,
    comment: comment || `Rated this article ${currentSelectedRating} stars.`,
    date: new Date().toISOString().split("T")[0],
    status: "New"
  };

  const storedFeedback = JSON.parse(localStorage.getItem("smartFeedback") || "[]");
  storedFeedback.unshift(newFeedback);
  localStorage.setItem("smartFeedback", JSON.stringify(storedFeedback));

  // Also save in user ratings record
  const ratings = JSON.parse(localStorage.getItem("smartRatings") || "{}");
  ratings[articleId] = currentSelectedRating;
  localStorage.setItem("smartRatings", JSON.stringify(ratings));

  showToast("Thank you for your feedback! Your rating was saved.", "success");
  if (commentInput) commentInput.value = "";
}

function renderRecommendedArticles(excludeId) {
  const container = document.getElementById("recommended-articles-grid");
  if (!container) return;

  const content = getStoredContent();
  const recommended = content.filter(c => c.id !== excludeId).slice(0, 3);

  container.innerHTML = recommended.map(art => createContentCardHTML(art)).join("");
}

// Auto-run page check
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("content-grid")) {
    initContentPage();
  }
  if (document.getElementById("content-details-container")) {
    initContentDetailsPage();
  }
});
