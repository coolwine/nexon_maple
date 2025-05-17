import { IsMongoId } from 'class-validator';

export class RequestRewardDto {
  @IsMongoId()
  eventId: string;
}
