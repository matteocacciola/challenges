import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { metadata } from './utils/config';
import { UsersResolver } from '../src/users/users.resolver';
import { User } from '../src/users/users.entity';
import { CreateUserInput } from '../src/users/graphql/inputs.types';
import {
  prepareDatabase,
  truncate,
  timeout,
  flushDatabase,
  disconnect,
} from './utils/helpers';

describe('UsersResolver (Integration)', () => {
  let app: INestApplication,
    resolver: UsersResolver,
    entityManager: EntityManager;

  beforeAll(async () => {
    const module = await Test.createTestingModule(metadata).compile();

    app = module.createNestApplication();
    await app.init();

    resolver = module.get<UsersResolver>(UsersResolver);
    entityManager = module.get<EntityManager>(EntityManager);

    await prepareDatabase(entityManager);
  }, timeout);

  afterAll(async () => {
    await flushDatabase(entityManager);
    await disconnect(app, entityManager);
  }, timeout);

  afterEach(async () => {
    await truncate(entityManager, 'users');
  }, timeout);

  it(
    'should create an user',
    async () => {
      const createdUser = await resolver.createUser({
        email: 'test@test.com',
        password: 'password',
        roles: ['admin'],
      });
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toEqual('test@test.com');

      const savedUser = await entityManager.findOne(User, {
        where: { id: createdUser.id },
      });
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toEqual('test@test.com');
    },
    timeout,
  );

  it(
    'should not create an user when the provided email is already existing',
    async () => {
      expect.assertions(1);
      try {
        const input: CreateUserInput = {
          email: 'test@test.com',
          password: 'password',
          roles: ['admin'],
        };
        await resolver.createUser(input);
        await resolver.createUser({ ...input, password: 'new-password' });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    },
    timeout,
  );
});
