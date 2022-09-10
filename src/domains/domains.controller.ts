import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DomainsService } from './domains.service';
import { DomainDto } from './dto/domain.dto';

@ApiTags('dominios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dominios')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Get('mime-types')
  async getMimeTypes(): Promise<DomainDto[]> {
    return this.domainsService.getMimeTypes();
  }
}
