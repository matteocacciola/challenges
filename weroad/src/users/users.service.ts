import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserInput } from './graphql/inputs.types';
import { Role } from '../roles/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    let roles: Role[] = [];
    try {
      roles = await Promise.all(
        data.roles.map((roleName) =>
          this.roleRepository.findOneOrFail({ where: { name: roleName } }),
        ),
      );
    } catch (error) {
      throw new Error(`One or more roles in ${data.roles} not found.`);
    }

    let newUser: User;
    try {
      newUser = this.userRepository.create({
        email: data.email,
        password: data.password,
        roles: roles,
      });
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    return this.userRepository.save(newUser);
  }
}
