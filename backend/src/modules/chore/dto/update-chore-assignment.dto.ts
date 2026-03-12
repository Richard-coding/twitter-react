import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class UpdateChoreAssignmentDto {
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
