import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardService } from './reward.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { RewardTypeDto } from './dto/reward-type.dto';
import { User } from './dto/user.dto';

interface Req extends Request {
  user: User;
}

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  /**
   * 보상 생성
   * @param dto
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('create')
  create(@Body() dto: CreateRewardDto) {
    return this.rewardService.create(dto);
  }

  /**
   * 리워드 타입 생성
   * @param req
   * @param rewardType
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('type')
  createRewardType(@Request() req: Req, @Body() rewardType: RewardTypeDto) {
    return this.rewardService.createRewardType(req.user.email, rewardType);
  }
}
