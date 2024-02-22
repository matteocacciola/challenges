import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { metadata } from './utils/config';
import { TravelsResolver } from '../src/travels/travels.resolver';
import { CreateTravelInput } from '../src/travels/graphql/inputs.types';
import { Travel } from '../src/travels/travels.entity';
import { Mood } from '../src/travels/travels.enums';
import {
  truncate,
  prepareDatabase,
  flushDatabase,
  timeout,
  disconnect,
} from './utils/helpers';

describe('TravelsResolver (Integration)', () => {
  let app: INestApplication,
    resolver: TravelsResolver,
    entityManager: EntityManager;

  beforeAll(async () => {
    const module = await Test.createTestingModule(metadata).compile();

    app = module.createNestApplication();
    await app.init();

    resolver = module.get<TravelsResolver>(TravelsResolver);
    entityManager = module.get<EntityManager>(EntityManager);

    await prepareDatabase(entityManager);
  }, timeout);

  afterAll(async () => {
    await flushDatabase(entityManager);
    await disconnect(app, entityManager);
  }, timeout);

  afterEach(async () => {
    await truncate(entityManager, 'travels');
  }, timeout);

  it(
    'should create a travel',
    async () => {
      const input: CreateTravelInput = {
        isPublic: true,
        slug: 'test-travel',
        name: 'Test Travel CREATE',
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

      const createdTravel = await resolver.createTravel(input);
      expect(createdTravel).toBeDefined();
      expect(createdTravel.id).toBeDefined();
      expect(createdTravel.name).toEqual(input.name);
      expect(createdTravel.slug).toEqual(input.slug);
    },
    timeout,
  );

  it(
    'should delete a travel',
    async () => {
      const travel: CreateTravelInput = {
        isPublic: true,
        slug: 'test-travel',
        name: 'Test Travel DELETE',
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
      const createdTravel = await entityManager.save(Travel, travel);

      await resolver.deleteTravel({ id: createdTravel.id });
      const retrievedTravel = await entityManager.findOne(Travel, {
        where: { id: createdTravel.id },
      });
      expect(retrievedTravel).toBeNull();
    },
    timeout,
  );

  it(
    'should get paginated travels',
    async () => {
      await entityManager.save(Travel, {
        isPublic: true,
        slug: 'first-test-travel',
        name: 'First Test Travel',
        description: 'First Test Travel Description',
        numberOfDays: 5,
        moods: {
          [Mood.NATURE]: 50,
          [Mood.RELAX]: 50,
          [Mood.HISTORY]: 50,
          [Mood.CULTURE]: 50,
          [Mood.PARTY]: 50,
        },
      });
      await entityManager.save(Travel, {
        isPublic: true,
        slug: 'second-test-travel',
        name: 'Second Test Travel',
        description: 'Second Test Travel Description',
        numberOfDays: 4,
        moods: {
          [Mood.NATURE]: 40,
          [Mood.RELAX]: 30,
          [Mood.HISTORY]: 50,
          [Mood.CULTURE]: 20,
          [Mood.PARTY]: 10,
        },
      });

      // get both travels due to pageSize
      const paginatedTravels = await resolver.getTravels({
        pagination: {
          page: 1,
          pageSize: 10,
        },
      });
      expect(paginatedTravels).toBeDefined();
      expect(paginatedTravels.items).toBeDefined();
      expect(paginatedTravels.totalItems).toBeDefined();
      expect(paginatedTravels.items.length).toEqual(2);
      expect(paginatedTravels.totalItems).toEqual(2);

      // get only first travel due to pageSize
      const againPaginatedTravels = await resolver.getTravels({
        pagination: {
          page: 1,
          pageSize: 1,
        },
      });
      expect(againPaginatedTravels).toBeDefined();
      expect(againPaginatedTravels.items).toBeDefined();
      expect(againPaginatedTravels.totalItems).toBeDefined();
      expect(againPaginatedTravels.items.length).toEqual(1);
      expect(againPaginatedTravels.totalItems).toEqual(2);
    },
    timeout,
  );

  it(
    'should get all travels',
    async () => {
      await entityManager.save(Travel, {
        isPublic: true,
        slug: 'first-test-travel',
        name: 'First Test Travel',
        description: 'First Test Travel Description',
        numberOfDays: 5,
        moods: {
          [Mood.NATURE]: 50,
          [Mood.RELAX]: 50,
          [Mood.HISTORY]: 50,
          [Mood.CULTURE]: 50,
          [Mood.PARTY]: 50,
        },
      });
      await entityManager.save(Travel, {
        isPublic: true,
        slug: 'second-test-travel',
        name: 'Second Test Travel',
        description: 'Second Test Travel Description',
        numberOfDays: 4,
        moods: {
          [Mood.NATURE]: 40,
          [Mood.RELAX]: 30,
          [Mood.HISTORY]: 50,
          [Mood.CULTURE]: 20,
          [Mood.PARTY]: 10,
        },
      });

      const travels = await resolver.getAllTravels();
      expect(travels).toBeDefined();
      expect(travels.length).toEqual(2);
    },
    timeout,
  );
});
