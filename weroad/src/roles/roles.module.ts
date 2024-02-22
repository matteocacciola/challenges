import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { AccessControlService } from '../auth/access-control.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [
    AccessControlService,
    RolesService,
    RolesResolver,
    UsersService,
    AuthService,
  ],
})
export class RolesModule {}
