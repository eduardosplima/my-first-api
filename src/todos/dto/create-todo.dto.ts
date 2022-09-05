import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

import { ApiHideProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiHideProperty()
  @IsEmpty()
  user: number;
}
