import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardTypeDto } from './dto/reward-type.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { RewardType, RewardTypeDocument } from './schemas/reward-type.schema';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(RewardType.name)
    private rewardTypeModel: Model<RewardTypeDocument>,
  ) {}

  async create(rewardDto: CreateRewardDto): Promise<Reward> {
    if (!rewardDto?.eventId || !rewardDto?.name) {
      throw new ConflictException('Event id is not valid.');
    }

    // 이벤트 존재 체크
    const exists = await this.eventModel.exists({ _id: rewardDto.eventId });
    if (!exists) {
      throw new ConflictException('Event not found.');
    }

    const rewardTypeExists = await this.isExistsRewardType(rewardDto.type);
    if (!rewardTypeExists) {
      throw new ConflictException(
        `Reward type "${rewardDto.type}" does not exist`,
      );
    }

    return await this.rewardModel.create({
      ...rewardDto,
      eventId: new Types.ObjectId(rewardDto.eventId),
    });
  }

  /**
   * 리워드 타입 존재여부
   * @param type
   * @private
   */
  private async isExistsRewardType(type: string) {
    if (!type) {
      throw new ConflictException(`Reward type required`);
    }

    return this.rewardTypeModel.exists({ type });
  }

  /**
   * 리워드 타입 생성
   * @param createdBy
   * @param rewardType
   */
  async createRewardType(createdBy: string, rewardType: RewardTypeDto) {
    const exist = await this.isExistsRewardType(rewardType?.type);
    if (exist) {
      throw new ConflictException(
        `Reward type "${rewardType.type}" already exist`,
      );
    }
    return this.rewardTypeModel.create({ ...rewardType, createdBy });
  }
}
