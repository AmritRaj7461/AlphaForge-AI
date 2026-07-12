/**
 * API Client
 * Axios instance configured to communicate with the AlphaForge backend.
 * Per Engineering Constitution: Frontend ONLY communicates with backend APIs.
 * Frontend NEVER calls Gemini or external providers directly.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds — analysis can take time with real APIs
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {
      success: false,
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error. Please check your connection.',
    };
    return Promise.reject(errorData);
  }
);

/**
 * Analyze a company by name or ticker.
 * @param {string} company - Company name or ticker symbol
 * @returns {Promise<object>} Full analysis report
 */
export const analyzeCompany = (company) =>
  apiClient.post('/analyze', { company });

/**
 * Send a follow-up chat question.
 * @param {string} sessionId - Session ID from previous analysis
 * @param {string} question - Follow-up question
 * @returns {Promise<object>} Chat response
 */
export const sendChatMessage = (sessionId, question) =>
  apiClient.post('/chat', { sessionId, question });

/**
 * Check backend health status.
 * @returns {Promise<object>} Health status
 */
export const checkHealth = () =>
  apiClient.get('/health');

export default apiClient;
