import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  getAccessToken,
  gql,
  prepareDatabase,
  truncate,
  flushDatabase,
  timeout,
  disconnect,
} from './utils/helpers';
import { AuthResolver } from '../src/auth/auth.resolver';
import { UsersResolver } from '../src/users/users.resolver';
import { Role } from '../src/roles/roles.enums';
import { metadata } from './utils/config';
import { Travel } from '../src/travels/travels.entity';
import { CreateTravelInput } from '../src/travels/graphql/inputs.types';
import { Mood } from '../src/travels/travels.enums';

describe('GraphQL Tours module (e2e)', () => {
  let app: INestApplication,
    module: TestingModule,
    resolver: AuthResolver,
    entityManager: EntityManager,
    travel: CreateTravelInput;

  beforeAll(async () => {
    module = await Test.createTestingModule(metadata).compile();

    app = module.createNestApplication();
    await app.init();

    resolver = module.get<AuthResolver>(AuthResolver);
    entityManager = module.get<EntityManager>(EntityManager);

    await prepareDatabase(entityManager);

    travel = {
      isPublic: true,
      slug: 'test-travel',
      name: 'Test Travel',
      description: 'Test Travel Description',
      numberOfDays: 5,
      moods: {
        [Mood.NATURE]: 50,
        [Mood.RELAX]: 50,
        [Mood.HISTORY]: 50,
        [Mood.CULTURE]: 50,
        [Mood.PARTY]: 50,
      },
    };
  }, timeout);

  afterAll(async () => {
    await flushDatabase(entityManager);
    await disconnect(app, entityManager);
  }, timeout);

  afterEach(async () => {
    await truncate(entityManager, 'travels');
    await truncate(entityManager, 'users');
  }, timeout);

  describe('createTravel', () => {
    it(
      'should create a travel',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation CreateTravel {
              createTravel (
                input: {
                  isPublic: true
                  slug: "testslug-2"
                  name: "Travel di Test 22 da GraphQL"
                  description: "Questa è la descrizione"
                  numberOfDays: 2
                  moods: {
                    nature: 10
                    history: 30
                    party: 40
                    relax: 90
                    culture: 8
                  }
                }
              ) {
                id
                isPublic
                slug
                name
                description
                numberOfDays
                moods {
                  nature
                  history
                  party
                  relax
                  culture
                }
                numberOfNights
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createTravel).toEqual(
              expect.objectContaining({ slug: 'testslug-2' }),
            );
          });
      },
      timeout,
    );

    it(
      'should not create a travel because of invalid token',
      async () => {
        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer invalid-token`)
          .send({
            query: `
            mutation CreateTravel {
              createTravel (
                input: {
                  isPublic: true
                  slug: "testslug-2"
                  name: "Travel di Test 22 da GraphQL"
                  description: "Questa è la descrizione"
                  numberOfDays: 2
                  moods: {
                    nature: 10
                    history: 30
                    party: 40
                    relax: 90
                    culture: 8
                  }
                }
              ) {
                id
                isPublic
                slug
                name
                description
                numberOfDays
                moods {
                  nature
                  history
                  party
                  relax
                  culture
                }
                numberOfNights
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual('Unauthorized');
          });
      },
      timeout,
    );

    it(
      'should not create a travel because of invalid role',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.EDITOR,
          'editor1@test.com',
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation CreateTravel {
              createTravel (
                input: {
                  isPublic: true
                  slug: "testslug-2"
                  name: "Travel di Test 22 da GraphQL"
                  description: "Questa è la descrizione"
                  numberOfDays: 2
                  moods: {
                    nature: 10
                    history: 30
                    party: 40
                    relax: 90
                    culture: 8
                  }
                }
              ) {
                id
                isPublic
                slug
                name
                description
                numberOfDays
                moods {
                  nature
                  history
                  party
                  relax
                  culture
                }
                numberOfNights
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual('Forbidden resource');
          });
      },
      timeout,
    );

    it(
      'should not create a travel because another one with the same name already exists',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
          'test3@test.com',
        );

        const createdTravel = await entityManager.save(Travel, travel);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation CreateTravel {
              createTravel (
                input: {
                  isPublic: true
                  slug: "testslug-2"
                  name: "${createdTravel.name}"
                  description: "Questa è la descrizione"
                  numberOfDays: 2
                  moods: {
                    nature: 10
                    history: 30
                    party: 40
                    relax: 90
                    culture: 8
                  }
                }
              ) {
                id
                isPublic
                slug
                name
                description
                numberOfDays
                moods {
                  nature
                  history
                  party
                  relax
                  culture
                }
                numberOfNights
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors.length).toBeGreaterThan(0);
          });
      },
      timeout,
    );
  });

  describe('deleteTravel', () => {
    it(
      'should delete a travel',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
        );

        const createdTravel = await entityManager.save(Travel, travel);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation DeleteTravel {
              deleteTravel(
                input: {
                  id: "${createdTravel.id}"
                }
              ) {
                id
                isDeleted
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.deleteTravel).toEqual({
              id: `${createdTravel.id}`,
              isDeleted: true,
            });
          });
      },
      timeout,
    );

    it(
      'should not delete a travel because of invalid token',
      async () => {
        const createdTravel = await entityManager.save(Travel, travel);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer invalid-token`)
          .send({
            query: `
            mutation DeleteTravel {
              deleteTravel(
                input: {
                  id: "${createdTravel.id}"
                }
              ) {
                id
                isDeleted
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual('Unauthorized');
          });
      },
      timeout,
    );

    it(
      'should not delete a travel because of invalid role',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.EDITOR,
          'editor2@test.com',
        );
        const createdTravel = await entityManager.save(Travel, travel);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation DeleteTravel {
              deleteTravel(
                input: {
                  id: "${createdTravel.id}"
                }
              ) {
                id
                isDeleted
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual('Forbidden resource');
          });
      },
      timeout,
    );
  });
});
