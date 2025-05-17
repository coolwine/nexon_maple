import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { EventController } from './event.controller';
import { RewardController } from './reward.controller';
import { RewardRequestController } from './reward-request.controller';
import { AppService } from './app.service';
import { EventService } from './event.service';
import { RewardService } from './reward.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Event, EventSchema } from './schemas/event.schema';
import { RewardRequestService } from './reward-request.service';
import { Reward, RewardSchema } from './schemas/reward.schema';
import {
  RewardRequest,
  RewardRequestSchema,
} from './schemas/reward-request.schema';
import { RewardType, RewardTypeSchema } from './schemas/reward-type.schema';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017/event'),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: RewardType.name, schema: RewardTypeSchema },
    ]),
  ],
  controllers: [
    AppController,
    EventController,
    RewardController,
    RewardRequestController,
  ],
  providers: [
    AppService,
    EventService,
    RewardService,
    RewardRequestService,
    JwtStrategy,
  ],
})
export class AppModule {}
