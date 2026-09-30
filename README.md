# Smart Recommendation System for Personalized Content and Product Suggestions

A complete, modern, responsive **frontend-only web application** for a Digital Marketing capstone project that provides personalized product and digital content suggestions based on user preferences, browsing history, and behavioral interactions.

---

## 1. Project Overview

The **Smart Recommendation System** simulates how modern e-commerce and digital content platforms (such as Amazon, Netflix, and Spotify) deliver relevant product recommendations and educational articles to users.

### Key Capabilities
* **Voluntary Interest Matching (Zero-Party Data):** Users select their favorite interest tags (Technology, Fashion, Books, Beauty, Sports, Travel, Food, Lifestyle) during onboarding or in their profile.
* **Explainable Multi-Signal Recommendation Engine:** Transparent badges explain why items are presented (*"Recommended because you like Technology"*, *"Similar to products you viewed"*, *"Matches items in your wishlist"*).
* **Faceted Product Search & Filtering:** Dynamic catalog filters by category, price ranges (in INR ₹), minimum star ratings, and sorting options without reloading pages.
* **Content Hub & Publishing:** Curated digital marketing, tech, and lifestyle guides with reading times, view counters, and in-article rating widgets.
* **Wishlist Management:** Persistent saved items synchronized in real time with interactive heart toggles and counter badges.
* **Interactive Feedback System:** 5-star rating component for reviewing products and articles.
* **Comprehensive Admin Portal:** Separate dashboard layout with 8 live KPI cards, product CRUD, content publishing, user moderation, category management, and 6 Chart.js interactive charts.

---

## 2. Technologies Used

* **HTML5:** Semantic, accessible markup across 14 customer pages and 10 admin portal pages.
* **CSS3:** Custom design tokens, glassmorphism navigation, responsive drawer menus, and micro-animations.
* **JavaScript ES6+:** Modular vanilla JavaScript scripts with zero build-step overhead.
* **Bootstrap 5 (v5.3.3):** Modern responsive grid layout and utility classes.
* **Bootstrap Icons (v1.11.3):** Crisp iconography for categories, ratings, and actions.
* **Chart.js (v4.4.2):** Interactive data visualizations for administrator analytics.
* **Google Fonts:** Plus Jakarta Sans for clean typography.
* **LocalStorage:** Client-side state persistence for user sessions, catalogs, articles, reviews, and activity tallies.

---

## 3. Demo Credentials

### Registered Shopper Demo
* **Name:** Alex Johnson
* **Email:** `alex@example.com`
* **Interests:** Technology, Travel, Books
* **Quick Login:** Click **"Continue as Demo User (Alex)"** on the [login.html](file:///c:/software/login.html) page.

### Administrator Demo
* **Email:** `admin@smartrecommend.com`
* **Password:** `admin123`
* **Portal URL:** [admin-login.html](file:///c:/software/admin-login.html) (or click "Pre-Fill Demo Credentials" on the page).

---

## 4. Recommendation Scoring Algorithm

The client-side engine (`js/recommendations.js`) evaluates products using a linear scoring matrix:

$$\text{Score}(P) = 5 \cdot \text{MatchInterest} + 4 \cdot \text{CategoryAlignment} + 3 \cdot \text{WishlistAffinity} + 3 \cdot \text{RecentlyViewed} + 2 \cdot (\text{Rating} \ge 4.5) + 1 \cdot \text{Trending}$$

### Signal Breakdown:
1. **Direct Interest Match (+5 pts):** Strict match between product category and user-declared interests.
2. **Category Alignment (+4 pts):** Awarded when user shows recurring interest in a specific category.
3. **Wishlist Category Similarity (+3 pts):** Awarded to products sharing categories with saved wishlist items.
4. **Recently Viewed Category (+3 pts):** Boosts complementary items based on items viewed in the session.
5. **High Rating Quality Factor (+2 pts):** Prioritizes customer satisfaction for items rated $\ge 4.5\text{★}$.
6. **Trending Momentum (+1 pt):** Highlights fast-moving catalog items.

---

## 5. Project Directory Structure

```text
c:\software\
├── index.html                  # Landing page (Hero, Categories, Recommendations, Trending, Benefits)
├── login.html                  # User sign in with 1-click demo access
├── register.html               # Registration with multi-interest checklist
├── products.html               # Product catalog with live search, filters & sort
├── product-details.html        # Product detail with gallery, specs, buy actions & similar items
├── content.html                # Content marketing hub with category tabs
├── content-details.html        # Article reader with rating & feedback widget
├── recommendations.html        # Dedicated personalization portal with scored rationale badges
├── wishlist.html               # Saved items management with empty states
├── profile.html                # User profile, selectable interests & activity counters
├── feedback.html               # 5-star customer review submission & history
├── about.html                  # Project purpose, architecture, and marketing benefits
├── contact.html                # Contact form with validation and FAQs
├── admin-login.html            # Administrator login interface
│
├── admin/
│   ├── dashboard.html          # Admin KPI dashboard with 8 metric cards
│   ├── products.html           # Catalog management data table
│   ├── add-product.html        # Product authoring form
│   ├── content.html            # Article library management table
│   ├── add-content.html        # Article drafting & publisher form
│   ├── users.html              # Registered user management & status toggles
│   ├── categories.html         # Category manager
│   ├── feedback.html           # Customer review moderation queue
│   ├── analytics.html          # 6 Chart.js interactive charts
│   └── settings.html           # Algorithm weights sliders & factory reset
│
├── css/
│   ├── style.css               # Core design tokens, hero, cards, badges, and toasts
│   ├── responsive.css          # Mobile navigation, breakpoints, and touch scaling
│   └── admin.css               # Admin layout, sidebar navigation, and tables
│
└── js/
    ├── data.js                 # 28+ seed products, 16+ articles, seed users, and LocalStorage bootstrap
    ├── app.js                  # Toasts, currency formatting, navigation sync, view tracker
    ├── auth.js                 # Authentication, demo login, registration, and admin guard
    ├── products.js             # Catalog filters, search, sort, and detail view logic
    ├── content.js              # Article filtering, search, and in-line feedback
    ├── recommendations.js      # Linear scoring recommendation engine
    ├── wishlist.js             # Wishlist toggling, removal animations, and empty state
    ├── profile.js              # Profile editor, interest tag toggles, activity metrics
    ├── feedback.js             # Star rating widget and review submission
    └── admin.js                # KPI calculations, CRUD handlers, and Chart.js instances
```

---

## 6. How to Run Locally

Because this project is built entirely on standard frontend technologies (HTML5, CSS3, JavaScript ES6+):
1. **Direct Browser Execution:** You can open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. **Running Storefront & Backend Services:**
   ```bash
   # Terminal 1 - Start the REST API Backend (Runs on http://localhost:5000):
   npm run backend

   # Terminal 2 - Start the Frontend Dev Server (Runs on http://localhost:3000):
   npm run dev

   # Re-seed the SQLite Database with factory demo data at any time:
   npm run seed
   ```

   - **Frontend UI:** `http://localhost:3000`
   - **Backend API:** `http://localhost:5000`
   - **API Health Check:** `http://localhost:5000/api/health`
   - **Database File:** `backend/data/smartrecommend.db` (Persistent SQLite)

---

## 7. College Project Demonstration Script

Follow this step-by-step presentation flow:
1. **Homepage (`index.html`):** Show hero banner, global search, popular categories, and dynamic "Recommended For You" carousel.
2. **Registration & Interests (`register.html`):** Demonstrate choosing interest categories (e.g. Technology, Books, Travel).
3. **Personalized Recommendations (`recommendations.html`):** Show how the recommendation engine generates rationale badges (*"Recommended because you like Technology"*).
4. **Catalog Filtering (`products.html`):** Filter by Electronics, price under ₹5,000, and sort by Highest Rated.
5. **Product Detail & Wishlist (`product-details.html`):** Switch gallery thumbnails, toggle "Add to Wishlist", and notice the counter badge incrementing in the top navigation.
6. **Content Hub (`content.html` & `content-details.html`):** Open an article, leave a 5-star rating with review comments.
7. **Profile Management (`profile.html`):** Show live activity stats (Products Viewed, Wishlist, Articles Read, Ratings Given) and toggle interest badges.
8. **Admin Portal (`admin/dashboard.html` & `admin/analytics.html`):** Log into `admin-login.html` and inspect the 8 KPI cards, Chart.js visualizations, and add a new product.

---

&copy; 2026 SmartRecommend. Built for Digital Marketing & Recommendation Systems Capstone.
