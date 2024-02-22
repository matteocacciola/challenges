import { EntityManager } from 'typeorm';
import { Role } from '../../src/roles/roles.enums';
import { UsersResolver } from '../../src/users/users.resolver';
import { AuthResolver } from '../../src/auth/auth.resolver';
import { INestApplication } from '@nestjs/common';

export const truncate = async (entityManager: EntityManager, table: string) => {
  await entityManager.query(`TRUNCATE TABLE ${table} CASCADE;`);
};

export const loadRoles = async (entityManager: EntityManager) => {
  await entityManager.query(
    `INSERT INTO "roles" (name) VALUES ('${Role.ADMIN}'), ('${Role.EDITOR}'), ('${Role.GUEST}')`,
  );
};

export const getAccessToken = async (
  authResolver: AuthResolver,
  usersResolver: UsersResolver,
  role: Role,
  email?: string,
  password?: string,
) => {
  email = email ?? 'test@test.com';
  password = password ?? 'password';

  await usersResolver.createUser({ email, password, roles: [role] });
  const { accessToken } = await authResolver.login({ email, password });

  return accessToken;
};

export const prepareDatabase = async (entityManager: EntityManager) => {
  await entityManager.connection.synchronize(true);
  await loadRoles(entityManager);
};

export const flushDatabase = async (entityManager: EntityManager) => {
  await truncate(entityManager, 'users_roles_roles');
  await truncate(entityManager, 'users');
  await truncate(entityManager, 'roles');
  await truncate(entityManager, 'tours');
  await truncate(entityManager, 'travels');
};

export const sleep = (ms: number): Promise<any> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const disconnect = async (
  app: INestApplication,
  entityManager: EntityManager,
): Promise<void> => {
  await entityManager.connection.destroy();
  await app.close();
};

export const timeout = 20000;

export const gql = '/graphql';
