import { subDays } from 'date-fns';
import { readFile } from 'fs/promises';
import { In, IsNull, LessThanOrEqual, Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { MultipartFileDto } from '../commom/dto/multipart-file.dto';
import { DomainsService } from '../domains/domains.service';
import { User } from '../users/entities/user.entity';
import { Attachment } from './entities/attachment.entity';
import { InvalidMimeTypeException } from './exceptions/invalid-mime-type.exception';

@Injectable()
export class AttachmentsService {
  private readonly logger = new Logger(AttachmentsService.name);

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

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  removeUnusedAttachments() {
    this.attachmentsRepository
      .delete({
        createdAt: LessThanOrEqual(subDays(new Date(), 1)),
        todo: IsNull(),
      })
      .then((result) =>
        this.logger.log(
          `Rotina de expurgo executada, ${result.affected} anexos expurgados`,
        ),
      )
      .catch((error) =>
        this.logger.error(
          `Rotina de expurgo executada com erro: ${error.message}`,
        ),
      );
  }
}
