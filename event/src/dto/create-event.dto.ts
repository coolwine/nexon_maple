import { IsString, IsNotEmpty, IsDateString, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  condition: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsDateString()
  createdAt: string;
}
