import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MimeType } from './entities/mime-type.entity';

@Injectable()
export class DomainsService {
  constructor(
    @InjectRepository(MimeType)
    private readonly mimeTypesRepository: Repository<MimeType>,
  ) {}

  async getMimeTypes(): Promise<MimeType[]> {
    return this.mimeTypesRepository.find({ order: { desc: 'ASC' } });
  }

  async getMimeTypeByDesc(desc: string): Promise<MimeType> {
    return this.mimeTypesRepository.findOne({ where: { desc } });
  }
}
