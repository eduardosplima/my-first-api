import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { MimeType } from './entities/mime-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MimeType])],
  providers: [DomainsService],
  controllers: [DomainsController],
  exports: [DomainsService],
})
export class DomainsModule {}
