import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { EventController } from './event.controller';
import { RewardController } from './reward.controller';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';
import { RewardService } from './reward.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AxiosToHttpFilter } from './axios.filter';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    EventController,
    RewardController,
  ],
  providers: [
    JwtStrategy,
    AppService,
    AuthService,
    RewardService,
    EventService,
    {
      provide: APP_FILTER,
      useClass: AxiosToHttpFilter,
    },
  ],
})
export class AppModule {}
