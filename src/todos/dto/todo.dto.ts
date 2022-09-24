import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  id: number;

  title: string;

  content: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: Date;

  attachments?: number[];
}
