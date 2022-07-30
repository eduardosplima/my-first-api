import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ErrorResponseDto } from '../commom/dto/error-response.dto';
import { AuthService } from './auth.service';
import { SigninResultDto } from './dto/signin-result.dto';
import { SigninDto } from './dto/signin.dto';
import { InvalidPasswordException } from './exceptions/invalid-password.exception';
import { LoginNotFoundException } from './exceptions/login-not-found.exception';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ErrorResponseDto,
  })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: SigninDto): Promise<SigninResultDto> {
    let result: SigninResultDto;

    try {
      result = await this.authService.signin(body);
    } catch (error) {
      if (
        error instanceof LoginNotFoundException ||
        error instanceof InvalidPasswordException
      ) {
        throw new BadRequestException('Usuário e/ou senha inválidos');
      }

      throw error;
    }

    return result;
  }
}
