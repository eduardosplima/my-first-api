import { ExtractJwt, Strategy } from 'passport-jwt';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import type { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import authConfig from '../config/auth.config';
import type { JwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    readonly config: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secret,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.getByLogin(payload.sub);
    if (!user) {
      throw new UnauthorizedException(`Invalid ${payload.jti}`);
    }

    return user;
  }
}
