import { IsString, IsNotEmpty } from 'class-validator';

export class RewardTypeDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
