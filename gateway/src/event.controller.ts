import {
  Get,
  Body,
  Headers,
  Controller,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from './constants';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvent(@Headers('authorization') auth: string): Promise<any> {
    return this.eventService.list(auth);
  }

  /**
   * 특정 이벤트 세부내용 조회
   * @param auth
   * @param id
   */
  @Get(':id')
  async detailEvent(
    @Headers('authorization') auth: string,
    @Param('id') id: string,
  ): Promise<any> {
    return this.eventService.detail(auth, id);
  }

  /**
   * 이벤트 등록
   * @param auth
   * @param body
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  @Post()
  async createEvent(
    @Headers('authorization') auth: string,
    @Body() body: any,
  ): Promise<any> {
    return this.eventService.create(auth, body);
  }
}
