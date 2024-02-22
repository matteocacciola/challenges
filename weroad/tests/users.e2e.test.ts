import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  getAccessToken,
  gql,
  truncate,
  prepareDatabase,
  flushDatabase,
  timeout,
  disconnect,
} from './utils/helpers';
import { AuthResolver } from '../src/auth/auth.resolver';
import { UsersResolver } from '../src/users/users.resolver';
import { Role } from '../src/roles/roles.enums';
import { metadata } from './utils/config';

describe('GraphQL Users module (e2e)', () => {
  let app: INestApplication,
    module: TestingModule,
    resolver: AuthResolver,
    entityManager: EntityManager;

  beforeAll(async () => {
    module = await Test.createTestingModule(metadata).compile();

    app = module.createNestApplication();
    await app.init();

    resolver = module.get<AuthResolver>(AuthResolver);
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

  describe('createUser', () => {
    const query = {
      query: `
        mutation CreateUser {
          createUser(
            input: {
              email: "test2@test.com"
              password: "ciaociao"
              roles: ["editor"]
            }
          ) {
            id
            email
            roles
          }
        }
      `,
    };

    it(
      'should create an user',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(query)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createUser).toEqual({
              id: expect.any(String),
              email: 'test2@test.com',
              roles: ['editor'],
            });
          });
      },
      timeout,
    );

    it(
      'should not create an user because of invalid token',
      async () => {
        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer invalid-token`)
          .send(query)
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual('Unauthorized');
          });
      },
      timeout,
    );

    it(
      'should not create an user because of invalid role',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.EDITOR,
          'editor_user@test.com',
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(query)
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual('Forbidden resource');
          });
      },
      timeout,
    );
  });
});
