import {
  IsArray,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

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

  @IsPositive({ each: true })
  @IsInt({ each: true })
  @IsArray()
  @IsOptional()
  attachments: number[];
}
