import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, ConflictException } from '@nestjs/common';
import {
  RewardRequest,
  RewardRequestDocument,
} from './schemas/reward-request.schema';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private requestModel: Model<RewardRequestDocument>,
  ) {}

  async requestReward(
    userId: string,
    eventIdStr: string,
  ): Promise<RewardRequest> {
    const eventId = new Types.ObjectId(eventIdStr);
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
