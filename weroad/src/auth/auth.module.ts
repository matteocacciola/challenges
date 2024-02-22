import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configDotenv } from 'dotenv';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import { AccessControlService } from './access-control.service';

configDotenv();

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [UsersService, AuthService, AccessControlService, AuthResolver],
})
export class AuthModule {}
