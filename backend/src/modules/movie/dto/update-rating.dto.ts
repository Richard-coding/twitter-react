import { IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  score?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
