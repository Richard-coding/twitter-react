import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ChoreFrequency } from '../../../common/enums';

export class CreateChoreDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(ChoreFrequency)
  frequency?: ChoreFrequency;
}
