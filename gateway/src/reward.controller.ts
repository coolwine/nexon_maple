import {
  Get,
  Body,
  Headers,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from './constants';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
  constructor(private readonly service: RewardService) {}

  /**
   * 보상 생성
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  @Post('create')
  async createReward(
    @Headers('authorization') auth: string,
    @Body() body: any,
  ): Promise<any> {
    return this.service.createReward(auth, body);
  }

  /**
   * 보상 요청
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('request')
  async requestReward(
    @Headers('authorization') auth: string,
    @Body() body: any,
  ): Promise<any> {
    return this.service.requestReward(auth, body);
  }

  /**
   * 보상 요청 내역 조회
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get('history')
  async rewardHistory(@Headers('authorization') auth: string): Promise<any> {
    return this.service.rewardHistory(auth);
  }

  /**
   * 보상 요청 내역 조회
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AUDITOR)
  @Get('history/all')
  async rewardHistoryAll(@Headers('authorization') auth: string): Promise<any> {
    return this.service.rewardHistoryAll(auth);
  }

  /**
   * 보상 타입 생성
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('type')
  async createRewardType(
    @Headers('authorization') auth: string,
    @Body() body: any,
  ): Promise<any> {
    return this.service.createRewardType(auth, body);
  }
}
