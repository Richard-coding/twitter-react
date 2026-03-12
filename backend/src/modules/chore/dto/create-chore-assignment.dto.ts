import { IsUUID, IsDateString } from 'class-validator';

export class CreateChoreAssignmentDto {
  @IsUUID()
  choreId: string;

  @IsUUID()
  assignedToId: string;

  @IsDateString()
  dueDate: string;
}
