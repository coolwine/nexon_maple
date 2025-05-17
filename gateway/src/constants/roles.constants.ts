/**
 * Constants related to user roles and permissions
 */

// Role metadata key used in decorators
export const ROLES_KEY = 'roles';

// User role types
export enum UserRole {
  ADMIN = 'ADMIN', // 모든 기능 접근 가능
  USER = 'USER', // 보상 요청 가능
  OPERATOR = 'OPERATOR', // 이벤트/보상 등록
  AUDITOR = 'AUDITOR', // 보상 이력 조회만 가능
}

// Error messages related to roles
export const ROLE_ERROR_MESSAGES = {
  FORBIDDEN: 'You do not have permission.',
};
