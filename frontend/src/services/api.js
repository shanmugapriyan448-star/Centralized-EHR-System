const API_BASE_URL = 'http://localhost:5000/api';

// Auth Token & User Storage Helpers
export const getToken = () => localStorage.getItem('ehr_token');
export const saveToken = (token) => localStorage.setItem('ehr_token', token);
export const removeToken = () => localStorage.removeItem('ehr_token');

export const getUser = () => {
  const user = localStorage.getItem('ehr_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};
export const saveUser = (user) => localStorage.setItem('ehr_user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('ehr_user');

export const logout = () => {
  removeToken();
  removeUser();
};

/**
 * Base HTTP Request Handler using fetch API
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    let data = {};

    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP Error ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    throw err;
  }
};

export const api = {
  get: (endpoint, headers = {}) => request(endpoint, { method: 'GET', headers }),
  post: (endpoint, body, headers = {}) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body), headers }),
  put: (endpoint, body, headers = {}) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body), headers }),
  delete: (endpoint, headers = {}) => request(endpoint, { method: 'DELETE', headers })
};

export default api;
