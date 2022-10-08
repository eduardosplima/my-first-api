import {
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../commom/dto/pagination-query.dto';

export class GetTodosDto extends PaginationQueryDto {
  @ApiProperty({
    required: false,
  })
  @MinLength(3)
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
  })
  @MinLength(3)
  @IsString()
  @IsOptional()
  content: string;

  /**
   * Required when `endDate !== null`
   */
  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  @ValidateIf((_this: GetTodosDto) => !!_this.endDate)
  startDate: string;

  /**
   * Required when `startDate !== null`
   */
  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  @ValidateIf((_this: GetTodosDto) => !!_this.startDate)
  endDate: string;

  @ApiProperty({
    enum: ['title', 'createdAt'],
  })
  @IsIn(['title', 'createdAt'])
  pageSort: string;
}
