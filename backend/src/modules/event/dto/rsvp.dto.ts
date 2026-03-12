import { IsEnum } from 'class-validator';
import { RsvpStatus } from '../../../common/enums';

export class RsvpDto {
  @IsEnum(RsvpStatus)
  status: RsvpStatus;
}
