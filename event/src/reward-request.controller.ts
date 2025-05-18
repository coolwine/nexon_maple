import {
  Get,
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RequestRewardDto } from './dto/request-reward.dto';
import { RewardRequestService } from './reward-request.service';
import { Roles } from './roles.decorator';
import { User } from './dto/user.dto';

interface Req extends Request {
  user: User;
}

@Controller('reward')
export class RewardRequestController {
  constructor(private readonly requestService: RewardRequestService) {}

  /**
   * 보상 요청
   * @param dto
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @Post('request')
  async requestReward(@Body() dto: RequestRewardDto, @Request() req: Req) {
    return this.requestService.requestReward(req.user.userId, dto.eventId);
  }

  /**
   * 유저의 보상 수령 이력조회
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async history(@Request() req: Req) {
    return this.requestService.findUserHistory(req.user.userId);
  }

  /**
   * 감사용 보상 수령 이력 조회
   */
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'AUDITOR')
  @Get('history/all')
  async historyAll() {
    return this.requestService.findAllHistory();
  }
}
