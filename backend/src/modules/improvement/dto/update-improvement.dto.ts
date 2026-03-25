import { IsEnum, IsOptional } from 'class-validator';
import { ImprovementStatus } from '../../../common/enums';

export class UpdateImprovementDto {
  @IsEnum(ImprovementStatus)
  @IsOptional()
  status?: ImprovementStatus;
}
