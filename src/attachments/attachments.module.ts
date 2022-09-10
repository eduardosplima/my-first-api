import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DomainsModule } from '../domains/domains.module';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './entities/attachment.entity';

@Module({
  imports: [DomainsModule, TypeOrmModule.forFeature([Attachment])],
  providers: [AttachmentsService],
  controllers: [AttachmentsController],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
