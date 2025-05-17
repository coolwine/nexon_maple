import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { APP_MESSAGES, USER_FIELDS, UserRole } from './constants';
import { Roles } from './roles.decorator';
import { AuthService, Resister } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

interface RequestWithUser extends Request {
  user: {
    [USER_FIELDS.USER_ID]: string;
    [USER_FIELDS.EMAIL]: string;
    [USER_FIELDS.ROLE]: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 내 정보
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  /**
   * 유저 등록
   * @param body
   */
  @Post('register')
  async register(@Body() body: Resister): Promise<any> {
    return this.authService.register(body);
  }

  /**
   * 로그인 요청
   * @param body
   */
  @Post('login')
  async login(@Body() body: LoginDto): Promise<any> {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdminData() {
    return { message: APP_MESSAGES.ADMIN_ONLY };
  }
}
