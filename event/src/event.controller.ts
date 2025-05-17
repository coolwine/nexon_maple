import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { User } from './dto/user.dto';

interface Req extends Request {
  user: User;
}

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async search(@Param('id') id: string) {
    return this.eventService.searchById(id);
  }

  /**
   * 이벤트 생성
   * @param req
   * @param dto
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post()
  create(@Request() req: Req, @Body() dto: CreateEventDto) {
    dto.createdAt = new Date().toISOString();
    dto.createdBy = req.user.email;
    return this.eventService.create(dto);
  }

  /**
   * 이벤트 전체 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  summaryList() {
    return this.eventService.summaryList();
  }
}
