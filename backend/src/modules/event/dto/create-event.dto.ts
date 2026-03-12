import { IsString, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsDateString()
  startsAt: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  location?: string;
}
