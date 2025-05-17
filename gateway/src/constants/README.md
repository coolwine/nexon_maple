# Constants Management in NestJS

This directory contains centralized constants for the application. Managing constants in a centralized way provides several benefits:

1. **Consistency**: Ensures the same values are used throughout the application
2. **Maintainability**: Makes it easier to update values in one place
3. **Type Safety**: Using enums and typed objects provides better type checking
4. **Documentation**: Constants can be documented with comments

## Structure

The constants are organized into different files based on their domain:

- `roles.constants.ts`: Constants related to user roles and permissions
- `auth.constants.ts`: Constants related to authentication and authorization
- `api.constants.ts`: Constants related to API endpoints and HTTP
- `index.ts`: Central export point for all constants

## Usage

Import constants from the central export point:

```typescript
import { UserRole, API_ENDPOINTS } from './constants';

@Roles(UserRole.ADMIN)
@Get(API_ENDPOINTS.AUTH.ADMIN)
getAdminData() {
  // ...
}
```

## Adding New Constants

When adding new constants:

1. Place them in the appropriate domain file
2. If creating a new domain, add a new file and export it from `index.ts`
3. Use descriptive names and add comments
4. Consider using enums for related constants
5. Group related constants in objects

## Best Practices

- Use uppercase for constant names (e.g., `USER_ROLES`)
- Use PascalCase for enum names (e.g., `UserRole`)
- Use descriptive names that indicate the purpose
- Add comments to explain the purpose and usage
- Keep constants organized by domain
