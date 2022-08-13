import { Injectable } from '@nestjs/common';

import { HashBase64Util } from '../commom/utils/hash-base64.util';
import { UsersService } from '../users/users.service';
import { SigninResultDto } from './dto/signin-result.dto';
import { SigninDto } from './dto/signin.dto';
import { InvalidPasswordException } from './exceptions/invalid-password.exception';
import { LoginNotFoundException } from './exceptions/login-not-found.exception';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  async signin(dto: SigninDto): Promise<SigninResultDto> {
    const user = await this.usersService.getByLogin(dto.login);
    if (!user) {
      throw new LoginNotFoundException(
        `Login ${dto.login} não localizado na base de dados`,
      );
    }

    const pswd = await HashBase64Util.hashData(dto.pswd, user.salt);
    if (pswd !== user.pswd) {
      throw new InvalidPasswordException('Senha inválida');
    }

    const token = await this.tokenService.create(user.id, user.login);

    return { token };
  }
}
