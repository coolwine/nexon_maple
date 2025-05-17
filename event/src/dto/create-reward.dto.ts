import { IsString, IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { RewardType } from '../schemas/reward.schema';

export class CreateRewardDto {
  @IsMongoId()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  type: RewardType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  quantity: number;
}
