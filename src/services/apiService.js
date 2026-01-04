// API Service to replace Supabase
// This handles all API calls to your PHP backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://yourdomain.com/backend/api';
const ASSETS_BASE_URL = process.env.REACT_APP_ASSETS_URL || 'https://assets.gpmithmumbari.com';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.auth !== false),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return { data, error: null };
    } catch (error) {
      console.error('API Error:', error);
      return { data: null, error: error.message };
    }
  }

  // Authentication
  async signIn(email, password) {
    const { data, error } = await this.request('auth.php/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    });

    if (data && data.token) {
      this.setToken(data.token);
    }

    return { data, error };
  }

  async signOut() {
    const { data, error } = await this.request('auth.php/logout', {
      method: 'POST',
    });

    this.setToken(null);
    return { data, error };
  }

  async verifyToken() {
    return await this.request('auth.php/verify', {
      method: 'GET',
    });
  }

  async changePassword(newPassword) {
    return await this.request('auth.php/change-password', {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  }

  // Team Members
  async getTeamMembers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`team.php?${params}`, {
      method: 'GET',
      auth: false,
    });
  }

  async createTeamMember(data) {
    return await this.request('team.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeamMember(data) {
    return await this.request('team.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeamMember(id) {
    return await this.request(`team.php?id=${id}`, {
      method: 'DELETE',
    });
  }

  // News
  async getNews(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`news.php?${params}`, {
      method: 'GET',
      auth: false,
    });
  }

  async createNews(data) {
    return await this.request('news.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNews(data) {
    return await this.request('news.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNews(id) {
    return await this.request(`news.php?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Events
  async getEvents(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`events.php?${params}`, {
      method: 'GET',
      auth: false,
    });
  }

  async createEvent(data) {
    return await this.request('events.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(data) {
    return await this.request('events.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id) {
    return await this.request(`events.php?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Services
  async getServices(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`resources.php/services?${params}`, {
      method: 'GET',
      auth: false,
    });
  }

  async createService(data) {
    return await this.request('resources.php/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(data) {
    return await this.request('resources.php/services', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id) {
    return await this.request(`resources.php/services?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Gallery
  async getGallery(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`resources.php/gallery?${params}`, {
      method: 'GET',
      auth: false,
    });
  }

  async createGalleryItem(data) {
    return await this.request('resources.php/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGalleryItem(data) {
    return await this.request('resources.php/gallery', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGalleryItem(id) {
    return await this.request(`resources.php/gallery?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Contact Submissions
  async getContacts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await this.request(`resources.php/contacts?${params}`, {
      method: 'GET',
    });
  }

  async createContact(data) {
    return await this.request('resources.php/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    });
  }

  async updateContactStatus(id, status) {
    return await this.request('resources.php/contacts', {
      method: 'PUT',
      body: JSON.stringify({ id, status }),
    });
  }

  async deleteContact(id) {
    return await this.request(`resources.php/contacts?id=${id}`, {
      method: 'DELETE',
    });
  }

  // File Upload
// Update the uploadFile method
  async uploadFile(file, category, fileType = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('file_type', fileType);

    const url = `${API_BASE_URL}/upload.php`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Transform the response to use the assets domain
      if (data.filepath) {
        data.url = `${ASSETS_BASE_URL}/${data.filepath}`;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Upload Error:', error);
      return { data: null, error: error.message };
    }
  }

  // Add a helper method to get full asset URL
  getAssetUrl(filepath) {
    if (!filepath) return null;
    // If it's already a full URL, return as is
    if (filepath.startsWith('http://') || filepath.startsWith('https://')) {
      return filepath;
    }
    // Otherwise, prepend the assets base URL
    return `${ASSETS_BASE_URL}/${filepath}`;
  }

  // Delete File
  async deleteFile(filepath) {
    // Note: You'll need to implement a delete endpoint in PHP
    return await this.request('upload.php', {
      method: 'DELETE',
      body: JSON.stringify({ filepath }),
    });
  }
}

export default new ApiService();