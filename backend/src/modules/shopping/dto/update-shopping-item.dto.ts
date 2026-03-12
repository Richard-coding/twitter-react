import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateShoppingItemDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  quantity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
