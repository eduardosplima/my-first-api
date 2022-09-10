import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Multipart } from '../commom/decorators/multipart.decorator';
import { ReqUser } from '../commom/decorators/req-user.decorator';
import { ErrorResponseDto } from '../commom/dto/error-response.dto';
import { User } from '../users/entities/user.entity';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentResultDto } from './dto/create-attachment-result.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { InvalidMimeTypeException } from './exceptions/invalid-mime-type.exception';

@ApiBearerAuth()
@ApiTags('anexos')
@UseGuards(JwtAuthGuard)
@Controller('anexos')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorResponseDto,
  })
  @Post()
  @Multipart()
  async create(
    @Body() body: CreateAttachmentDto,
    @ReqUser() user: User,
  ): Promise<CreateAttachmentResultDto> {
    let id: number;

    try {
      id = await this.attachmentsService.create(body.file, user);
    } catch (error) {
      if (error instanceof InvalidMimeTypeException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }

    return { id };
  }
}
