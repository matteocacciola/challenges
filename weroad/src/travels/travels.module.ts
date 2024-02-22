import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './travels.entity';
import { TravelsService } from './travels.service';
import { TravelsResolver } from './travels.resolver';
import { AccessControlService } from '../auth/access-control.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, User, Role])],
  providers: [
    AccessControlService,
    TravelsService,
    TravelsResolver,
    UsersService,
    AuthService,
  ],
})
export class TravelsModule {}
