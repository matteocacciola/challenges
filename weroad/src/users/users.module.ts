import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Role } from '../roles/roles.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AccessControlService } from '../auth/access-control.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [AccessControlService, UsersService, UsersResolver, AuthService],
})
export class UsersModule {}
