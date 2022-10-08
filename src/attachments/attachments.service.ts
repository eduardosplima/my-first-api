import { readFile } from 'fs/promises';
import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MultipartFileDto } from '../commom/dto/multipart-file.dto';
import { DomainsService } from '../domains/domains.service';
import { User } from '../users/entities/user.entity';
import { Attachment } from './entities/attachment.entity';
import { InvalidMimeTypeException } from './exceptions/invalid-mime-type.exception';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentsRepository: Repository<Attachment>,
    private readonly domainsService: DomainsService,
  ) {}

  async create(dto: MultipartFileDto, user: User): Promise<number> {
    const mimeType = await this.domainsService.getMimeTypeByDesc(dto.mimetype);
    if (!mimeType) {
      throw new InvalidMimeTypeException(`Invalid mimetype '${dto.mimetype}'`);
    }

    const attachment = new Attachment();
    attachment.name = dto.filenameClient;
    attachment.file = await readFile(dto.filepath);
    attachment.mimeType = mimeType;
    attachment.createdAt = new Date();
    attachment.user = user;

    const result = await this.attachmentsRepository.insert(attachment);

    return result.identifiers[0].id;
  }

  async findById(id: number, user: User): Promise<Attachment> {
    return this.attachmentsRepository.findOne({
      where: { id, user },
      relations: ['mimeType'],
    });
  }

  async getByIds(ids: number[]): Promise<Attachment[]> {
    if (ids?.length > 0) {
      return this.attachmentsRepository.find({
        where: { id: In(ids) },
        loadRelationIds: true,
      });
    }

    return [];
  }

  // TODO: Expurgo de registros fantasmas
}
