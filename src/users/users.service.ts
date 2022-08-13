import type { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { HashBase64Util } from '../commom/utils/hash-base64.util';
import type { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<number> {
    const user = this.usersRepository.create(createUserDto);

    user.salt = HashBase64Util.generateSalt(32);
    user.pswd = await HashBase64Util.hashData(createUserDto.pswd, user.salt);

    await this.usersRepository.save(user);
    return user.id;
  }

  async getByLogin(login: string): Promise<User> {
    return this.usersRepository.findOne({ where: { login } });
  }
}
