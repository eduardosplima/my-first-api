import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import authConfig from './config/auth.config';

@Injectable()
export class TokenService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    id: number,
    subject: string,
    payload: Record<string, unknown> = {},
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.config.expiresIn,
      subject,
      jwtid: `${id}`,
    });
  }
}
