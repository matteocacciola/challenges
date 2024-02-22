import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { metadata } from './utils/config';
import { AuthResolver } from '../src/auth/auth.resolver';
import {
  disconnect,
  flushDatabase,
  prepareDatabase,
  timeout,
} from './utils/helpers';
import { User } from '../src/users/users.entity';
import { Role } from '../src/roles/roles.entity';
import { encrypt } from '../src/app.helpers';

describe('AuthResolver (Integration)', () => {
  let app: INestApplication,
    resolver: AuthResolver,
    entityManager: EntityManager;

  beforeAll(async () => {
    const module = await Test.createTestingModule(metadata).compile();

    app = module.createNestApplication();
    await app.init();

    resolver = module.get<AuthResolver>(AuthResolver);
    entityManager = module.get<EntityManager>(EntityManager);

    await prepareDatabase(entityManager);

    const role = await entityManager.findOne(Role, {
      where: { name: 'admin' },
    });
    await entityManager.save(User, {
      email: 'test@test.com',
      password: await encrypt('password'),
      roles: [role],
    });
  }, timeout);

  afterAll(async () => {
    await flushDatabase(entityManager);
    await disconnect(app, entityManager);
  }, timeout);

  it(
    'should login',
    async () => {
      const token = await resolver.login({
        email: 'test@test.com',
        password: 'password',
      });
      expect(token).toBeDefined();
      expect(token).toHaveProperty('accessToken');
    },
    timeout,
  );

  it(
    'should not login because of invalid email',
    async () => {
      expect.assertions(2);
      try {
        await resolver.login({
          email: 'test1@test.com',
          password: 'password',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    },
    timeout,
  );

  it(
    'should not login because of invalid password',
    async () => {
      expect.assertions(2);
      try {
        await resolver.login({
          email: 'test@test.com',
          password: 'password1',
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    },
    timeout,
  );
});
