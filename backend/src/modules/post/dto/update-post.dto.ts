import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  content: string;
}
