import { IsEnum } from 'class-validator';
import { ReactionType } from '../../../common/enums';

export class CreatePostReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
