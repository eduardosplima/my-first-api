import { Injectable } from '@nestjs/common';

import { SigninResultDto } from './dto/signin-result.dto';
import { SigninDto } from './dto/signin.dto';
import { InvalidPasswordException } from './exceptions/invalid-password.exception';
import { LoginNotFoundException } from './exceptions/login-not-found.exception';

@Injectable()
export class AuthService {
  async signin(dto: SigninDto): Promise<SigninResultDto> {
    if (dto.login !== 'zava') {
      throw new LoginNotFoundException();
    }
    if (dto.pswd !== 'xxx') {
      throw new InvalidPasswordException();
    }

    return { token: 'dsjafksadjfkljsadkjfkljsdaklf' };
  }
}
