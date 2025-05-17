import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
import { User } from '../dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 메타데이터에서 필요한 역할 목록을 가져옴
    const requiredRoles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // 역할 제한이 없으면 통과
    }

    // 2. 요청한 사용자의 역할을 가져옴
    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('No user role found in request.');
    }

    // 3. 사용자의 역할이 필요한 역할에 포함되는지 확인
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Role ${user.role} is not allowed.`);
    }

    return true;
  }
}
