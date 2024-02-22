import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from '../travels/travels.entity';
import { Tour } from './tours.entity';
import { ToursService } from './tours.service';
import { ToursResolver } from './tours.resolver';
import { AccessControlService } from '../auth/access-control.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, Tour, User, Role])],
  providers: [
    AccessControlService,
    ToursService,
    ToursResolver,
    UsersService,
    AuthService,
  ],
})
export class ToursModule {}
