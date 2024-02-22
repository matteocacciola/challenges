import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  getAccessToken,
  gql,
  prepareDatabase,
  flushDatabase,
  truncate,
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
import { CreateTourInput } from '../src/tours/graphql/inputs.types';
import { Tour } from '../src/tours/tours.entity';

describe('GraphQL Tours module (e2e)', () => {
  let app: INestApplication,
    module: TestingModule,
    resolver: AuthResolver,
    entityManager: EntityManager,
    createdTravel: Travel;

  beforeAll(async () => {
    module = await Test.createTestingModule(metadata).compile();

    app = module.createNestApplication();
    await app.init();

    resolver = module.get<AuthResolver>(AuthResolver);
    entityManager = module.get<EntityManager>(EntityManager);

    await prepareDatabase(entityManager);

    const travel: CreateTravelInput = {
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
    createdTravel = await entityManager.save(Travel, travel);
  }, timeout);

  afterAll(async () => {
    await flushDatabase(entityManager);
    await disconnect(app, entityManager);
  }, timeout);

  afterEach(async () => {
    await truncate(entityManager, 'tours');
    await truncate(entityManager, 'users');
  }, timeout);

  describe('createTour', () => {
    it(
      'should create a tour',
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
            mutation CreateTour {
              createTour (
                input: {
                  travelId: "${createdTravel.id}"
                  name: "Tour da GraphQL"
                  startingDate: "2022-01-01"
                  endingDate: "2022-01-31"
                  price: 900,
                  currency: "USD"
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createTour).toEqual(
              expect.objectContaining({
                name: 'Tour da GraphQL',
                price: 900,
                currency: 'USD',
              }),
            );
          });
      },
      timeout,
    );

    it(
      'should not create a tour because of invalid token',
      async () => {
        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer invalid-token`)
          .send({
            query: `
            mutation CreateTour {
              createTour (
                input: {
                  travelId: "${createdTravel.id}"
                  name: "Tour da GraphQL"
                  startingDate: "2022-01-01"
                  endingDate: "2022-01-31"
                  price: 900
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
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
      'should not create a tour because of invalid role',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.EDITOR,
          'editor_tour@test.com',
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation CreateTour {
              createTour (
                input: {
                  travelId: "${createdTravel.id}"
                  name: "Tour da GraphQL"
                  startingDate: "2022-01-01"
                  endingDate: "2022-01-31"
                  price: 900
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
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
      'should not create a tour because of not existing travel',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
          'test3@test.com',
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation CreateTour {
              createTour (
                input: {
                  travelId: "12345667890"
                  name: "Tour da GraphQL 2"
                  startingDate: "2022-01-01"
                  endingDate: "2022-01-31"
                  price: 900
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual(
              'Travel with ID 12345667890 not found.',
            );
          });
      },
      timeout,
    );
  });

  describe('updateTour', () => {
    it(
      'should update a tour',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
        );

        const input: CreateTourInput = {
          travelId: createdTravel.id,
          name: 'Test Tour',
          startingDate: new Date('2023-01-01'),
          endingDate: new Date('2023-01-05'),
          price: 100,
        };
        const createdTour = await entityManager.save(Tour, input);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation UpdateTour {
              updateTour (
                input: {
                  id: "${createdTour.id}"
                  price: 250
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateTour).toEqual(
              expect.objectContaining({ price: 250 }),
            );
          });
      },
      timeout,
    );

    it(
      'should not update a tour because of invalid token',
      async () => {
        const input: CreateTourInput = {
          travelId: createdTravel.id,
          name: 'Test Tour',
          startingDate: new Date('2023-01-01'),
          endingDate: new Date('2023-01-05'),
          price: 100,
        };
        const createdTour = await entityManager.save(Tour, input);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer invalid-token`)
          .send({
            query: `
            mutation UpdateTour {
              updateTour (
                input: {
                  id: "${createdTour.id}"
                  price: 250
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
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
      'should not update a tour because of invalid role',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.GUEST,
          'guest@test.com',
        );
        const input: CreateTourInput = {
          travelId: createdTravel.id,
          name: 'Test Tour',
          startingDate: new Date('2023-01-01'),
          endingDate: new Date('2023-01-05'),
          price: 100,
        };
        const createdTour = await entityManager.save(Tour, input);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation UpdateTour {
              updateTour (
                input: {
                  id: "${createdTour.id}"
                  price: 250
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
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
      'should not update a tour because of not existing tour',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
          'test3@test.com',
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            mutation UpdateTour {
              updateTour (
                input: {
                  id: "123456789"
                  price: 250
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toEqual(
              'Tour with ID 123456789 not found.',
            );
          });
      },
      timeout,
    );
  });

  describe('getTour', () => {
    it(
      'should get a tour',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
        );

        const input: CreateTourInput = {
          travelId: createdTravel.id,
          name: 'Test Tour',
          startingDate: new Date('2023-01-01'),
          endingDate: new Date('2023-01-05'),
          price: 10000,
        };
        const createdTour = await entityManager.save(Tour, input);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            query GetTour {
              getTour (
                filter: {
                  id: "${createdTour.id}"
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
              }
            }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getTour).toEqual(
              expect.objectContaining({ price: 100 }),
            );
          });
      },
      timeout,
    );

    it(
      'should not get a tour because of invalid token',
      async () => {
        const input: CreateTourInput = {
          travelId: createdTravel.id,
          name: 'Test Tour',
          startingDate: new Date('2023-01-01'),
          endingDate: new Date('2023-01-05'),
          price: 100,
        };
        const createdTour = await entityManager.save(Tour, input);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer invalid-token`)
          .send({
            query: `
            query GetTour {
              getTour (
                filter: {
                  id: "${createdTour.id}"
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
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
      'should not get a tour because of invalid role',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.GUEST,
          'guest@test.com',
        );
        const input: CreateTourInput = {
          travelId: createdTravel.id,
          name: 'Test Tour',
          startingDate: new Date('2023-01-01'),
          endingDate: new Date('2023-01-05'),
          price: 100,
        };
        const createdTour = await entityManager.save(Tour, input);

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            query GetTour {
              getTour (
                filter: {
                  id: "${createdTour.id}"
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
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
      'should not get a tour because of not existing tour',
      async () => {
        const accessToken = await getAccessToken(
          resolver,
          module.get<UsersResolver>(UsersResolver),
          Role.ADMIN,
          'test3@test.com',
        );

        return request(app.getHttpServer())
          .post(gql)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `
            query GetTout {
              getTour (
                filter: {
                  id: "be573a87-70a4-4258-b3de-842e4400698d"
                }
              ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
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
});
