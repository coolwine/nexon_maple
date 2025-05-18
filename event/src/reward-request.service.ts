import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  RewardRequest,
  RewardRequestDocument,
} from './schemas/reward-request.schema';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private requestModel: Model<RewardRequestDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async requestReward(
    userId: string,
    eventIdStr: string,
  ): Promise<RewardRequest> {
    const eventId = new Types.ObjectId(eventIdStr);
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    if (event.endDate < new Date()) {
      throw new ConflictException('Event is over.');
    }

    const exists = await this.requestModel.exists({ userId, eventId });
    if (exists) {
      const reason = 'Already requested.';
      await this.requestModel.create({
        userId,
        eventId,
        status: 'FAILED',
        reason,
      });
      throw new ConflictException(reason);
    }

    // 지금은 조건 검증 생략 또는 always true
    const status = 'SUCCESS';
    const result = new this.requestModel({
      userId,
      eventId,
      status,
      reason: 'Achieved successfully.',
    });
    return result.save();
  }

  // 본인 이력
  async findUserHistory(userId: string) {
    return await this.requestModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  // 전체 이력
  async findAllHistory() {
    return await this.requestModel.find().sort({ createdAt: -1 }).exec();
  }
}
