import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  getAccessToken,
  gql,
  prepareDatabase,
  flushDatabase,
  timeout,
  disconnect,
  truncate,
} from './utils/helpers';
import { AuthResolver } from '../src/auth/auth.resolver';
import { UsersResolver } from '../src/users/users.resolver';
import { Role } from '../src/roles/roles.enums';
import { metadata } from './utils/config';

describe('GraphQL Roles module (e2e)', () => {
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
    await truncate(entityManager, 'users_roles_roles');
    await truncate(entityManager, 'users');
  }, timeout);

  describe('getAllRoles', () => {
    const query = {
      query: `
        query GetAllRoles {
          getAllRoles {
            name
          }
        }
      `,
    };

    it(
      'should get all roles',
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
            expect(res.body.data.getAllRoles.length).toEqual(
              Object.keys(Role).length,
            );
          });
      },
      timeout,
    );

    it(
      'should not get all roles because of invalid token',
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
      'should not get all roles because of invalid role of the requesting user',
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

  describe('getLoggedInUserRole', () => {
    const query = {
      query: `
        query GetLoggedInUserRole {
          getLoggedInUserRole {
            name
          }
        }
      `,
    };

    it(
      'should get the role of the logged in user',
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
            expect(res.body.data.getLoggedInUserRole).toEqual(
              expect.objectContaining([
                { name: Role.GUEST },
                { name: Role.EDITOR },
                { name: Role.ADMIN },
              ]),
            );
          });
      },
      timeout,
    );

    it(
      'should get guest role because of no logged in user',
      async () => {
        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer invalid-token`)
          .send(query)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getLoggedInUserRole).toEqual(
              expect.objectContaining([{ name: Role.GUEST }]),
            );
          });
      },
      timeout,
    );
  });
});
