/**
 * Constants related to authentication and authorization
 */

// Authentication strategy names
export const AUTH_STRATEGIES = {
  JWT: 'jwt',
};

// JWT configuration
export const JWT_CONFIG = {
  DEFAULT_SECRET: 'supersecret',
};

// JWT payload field names
export const JWT_PAYLOAD_FIELDS = {
  USER_ID: 'sub',
  EMAIL: 'email',
  ROLE: 'role',
};

// User object field names
export const USER_FIELDS = {
  USER_ID: 'userId',
  EMAIL: 'email',
  ROLE: 'role',
};
