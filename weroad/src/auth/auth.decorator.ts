import { SetMetadata } from '@nestjs/common';
import { Role } from '../roles/roles.enums';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLE_KEY = 'role';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
