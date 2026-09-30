/**
 * SMART RECOMMENDATION SYSTEM - API Client Integration Layer
 * Connects frontend pages to the live Express.js REST API backend on http://localhost:5000
 */

const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('smartAuthToken') || localStorage.getItem('smartAdminToken') || '';
  }

  setToken(token, isAdmin = false) {
    if (isAdmin) {
      localStorage.setItem('smartAdminToken', token);
    } else {
      localStorage.setItem('smartAuthToken', token);
    }
  }

  clearToken() {
    localStorage.removeItem('smartAuthToken');
    localStorage.removeItem('smartAdminToken');
  }

  /**
   * Generic fetch wrapper with automatic JWT authorization header injection
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      console.warn(`[API Client] ${options.method || 'GET'} ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  // --- Auth APIs ---
  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async demoUserLogin() {
    const res = await this.request('/auth/demo-user', { method: 'POST' });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async demoAdminLogin() {
    const res = await this.request('/auth/demo-admin', { method: 'POST' });
    if (res.token) this.setToken(res.token, true);
    return res;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async updateInterests(interests) {
    return this.request('/auth/interests', {
      method: 'PUT',
      body: JSON.stringify({ interests })
    });
  }

  // --- Products APIs ---
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? '?' + query : ''}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  async getRelatedProducts(id) {
    return this.request(`/products/${id}/related`);
  }

  // --- Recommendations APIs ---
  async getTopRecommendations(limit = 12) {
    return this.request(`/recommendations/top?limit=${limit}`);
  }

  async getByInterests(limit = 4) {
    return this.request(`/recommendations/by-interests?limit=${limit}`);
  }

  async getSimilarToViewed(limit = 4) {
    return this.request(`/recommendations/similar-viewed?limit=${limit}`);
  }

  async getSimilarToWishlist(limit = 4) {
    return this.request(`/recommendations/similar-wishlist?limit=${limit}`);
  }

  async getTrendingProducts(limit = 4) {
    return this.request(`/recommendations/trending?limit=${limit}`);
  }

  async getRecommendedContent(limit = 6) {
    return this.request(`/recommendations/content?limit=${limit}`);
  }

  // --- Content APIs ---
  async getContent(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/content${query ? '?' + query : ''}`);
  }

  async getContentById(id) {
    return this.request(`/content/${id}`);
  }

  // --- Wishlist APIs ---
  async getWishlist() {
    return this.request('/wishlist');
  }

  async toggleWishlist(productId) {
    return this.request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/${productId}`, {
      method: 'DELETE'
    });
  }

  // --- Activity APIs ---
  async trackView(targetType, targetId, category) {
    return this.request('/activity/view', {
      method: 'POST',
      body: JSON.stringify({ targetType, targetId, category })
    });
  }

  async getRecentlyViewed() {
    return this.request('/activity/recently-viewed');
  }

  // --- Feedback APIs ---
  async submitFeedback(feedbackData) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  }

  async getFeedback(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/feedback${query ? '?' + query : ''}`);
  }

  // --- Admin APIs ---
  async getDashboardStats() {
    return this.request('/admin/dashboard-stats');
  }

  async getAnalyticsCharts() {
    return this.request('/admin/analytics/charts');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async toggleUserStatus(userId) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH'
    });
  }

  async getAlgorithmSettings() {
    return this.request('/admin/settings/algorithm');
  }

  async updateAlgorithmSettings(weights) {
    return this.request('/admin/settings/algorithm', {
      method: 'PUT',
      body: JSON.stringify(weights)
    });
  }

  async resetDatabase() {
    return this.request('/admin/settings/reset-seeds', {
      method: 'POST'
    });
  }
}

// Global API instance attached to window for all frontend scripts
window.api = new ApiClient();
