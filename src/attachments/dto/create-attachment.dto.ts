import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { MultipartFileDto } from '../../commom/dto/multipart-file.dto';

export class CreateAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => MultipartFileDto)
  file: MultipartFileDto;
}
