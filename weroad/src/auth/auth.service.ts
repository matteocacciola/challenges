import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { Request } from 'express';
import { Login } from './graphql/inputs.types';
import { AccessTokenOutput } from './graphql/objects.types';
import { UserStore } from './auth.models';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';

configDotenv();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login({ email, password }: Login): Promise<AccessTokenOutput> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_EXPIRE || '7d',
      }),
    };
  }

  public async getAuthenticatedUser(
    request: Request,
  ): Promise<UserStore | null> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      return null;
    }
    try {
      const jwtUser = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });

      const user = await this.userRepository.findOneBy({
        email: jwtUser.email,
      });
      return {
        email: user.email,
        roles: user.roles,
      };
    } catch {
      return null;
    }
  }
}
