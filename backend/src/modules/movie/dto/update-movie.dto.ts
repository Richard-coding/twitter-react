import { IsString, IsOptional, IsUrl, IsInt, Min, Max, MinLength, MaxLength } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  genre?: string;
}
