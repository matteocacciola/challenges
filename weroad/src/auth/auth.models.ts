import { Role } from '../roles/roles.entity';

export type UserStore = {
  email: string;
  roles: Role[];
};
