/**
 * Constants related to API endpoints and HTTP
 */

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    ME: 'me',
    ADMIN: 'admin',
  },
  SERVICES: {
    AUTH_SERVICE: 'http://auth:3000/auth',
  },
};

// HTTP error messages
export const HTTP_ERROR_MESSAGES = {
  AUTH_ERROR: 'Auth Error',
};

// HTTP status codes
export const HTTP_STATUS = {
  SERVER_ERROR: 500,
};

// Application messages
export const APP_MESSAGES = {
  ADMIN_ONLY: 'Only admins can see this.',
};
