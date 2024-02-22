import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { metadata } from './utils/config';
import { ToursResolver } from '../src/tours/tours.resolver';
import { CreateTourInput } from '../src/tours/graphql/inputs.types';
import { Tour } from '../src/tours/tours.entity';
import { CreateTravelInput } from '../src/travels/graphql/inputs.types';
import { Travel } from '../src/travels/travels.entity';
import { Mood } from '../src/travels/travels.enums';
import {
  prepareDatabase,
  truncate,
  flushDatabase,
  timeout,
  disconnect,
} from './utils/helpers';

describe('ToursResolver (Integration)', () => {
  let app: INestApplication,
    resolver: ToursResolver,
    entityManager: EntityManager,
    createdTravel: Travel;

  beforeAll(async () => {
    const module = await Test.createTestingModule(metadata).compile();

    app = module.createNestApplication();
    await app.init();

    resolver = module.get<ToursResolver>(ToursResolver);
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
  }, timeout);

  it(
    'should create a tour',
    async () => {
      const input: CreateTourInput = {
        travelId: createdTravel.id,
        name: 'Test Tour',
        startingDate: new Date('2023-01-01'),
        endingDate: new Date('2023-01-05'),
        price: 100,
      };

      const createdTour = await resolver.createTour(input);
      expect(createdTour).toBeDefined();
      expect(createdTour.id).toBeDefined();
      expect(createdTour.name).toEqual(input.name);

      const savedTour = await entityManager.findOne(Tour, {
        where: { id: createdTour.id },
      });
      expect(savedTour).toBeDefined();
      expect(savedTour.name).toEqual(input.name);
      expect(savedTour.price).toEqual(input.price);
    },
    timeout,
  );

  it(
    'should update a tour',
    async () => {
      const input: CreateTourInput = {
        travelId: createdTravel.id,
        name: 'Test Tour',
        startingDate: new Date('2023-01-01'),
        endingDate: new Date('2023-01-05'),
        price: 10000,
      };
      const createdTour = await entityManager.save(Tour, input);

      const updatedTour = await resolver.updateTour({
        id: createdTour.id,
        name: 'Updated Tour',
      });
      expect(updatedTour).toBeDefined();
      expect(updatedTour.id).toEqual(createdTour.id);
      expect(updatedTour.name).toEqual('Updated Tour');

      const savedTour = await entityManager.findOne(Tour, {
        where: { id: createdTour.id },
      });
      expect(savedTour).toBeDefined();
      expect(savedTour.name).toEqual(updatedTour.name);
      expect(savedTour.price).toEqual(input.price / 100);
    },
    timeout,
  );

  it(
    'should get paginated tours',
    async () => {
      const firstCreatedTour = await entityManager.save(Tour, {
        travelId: createdTravel.id,
        startingDate: new Date('2023-01-01'),
        endingDate: new Date('2023-01-05'),
        price: 100,
        travel: createdTravel,
        name: 'First Test Tour',
      });
      const secondCreatedTour = await entityManager.save(Tour, {
        travelId: createdTravel.id,
        startingDate: new Date('2023-01-01'),
        endingDate: new Date('2023-01-05'),
        price: 200,
        travel: createdTravel,
        name: 'Second Test Tour',
      });

      // get without filters
      const paginatedTours = await resolver.getTours({
        slug: createdTravel.slug,
        pagination: {
          page: 1,
          pageSize: 10,
        },
      });
      expect(paginatedTours).toBeDefined();
      expect(paginatedTours.totalItems).toEqual(2);
      expect(paginatedTours.items.length).toEqual(2);
      expect(paginatedTours.items[0].id).toEqual(firstCreatedTour.id);
      expect(paginatedTours.items[1].id).toEqual(secondCreatedTour.id);

      // filter by price
      const filteredTours = await resolver.getTours({
        slug: createdTravel.slug,
        pagination: {
          page: 1,
          pageSize: 10,
        },
        filters: {
          priceFrom: 150,
        },
      });
      expect(filteredTours).toBeDefined();
      expect(filteredTours.totalItems).toEqual(1);
      expect(filteredTours.items.length).toEqual(1);
      expect(filteredTours.items[0].id).toEqual(secondCreatedTour.id);
      expect(filteredTours.items).not.toContain(firstCreatedTour);

      // return empty array if no tours found
      const emptyTours = await resolver.getTours({
        slug: createdTravel.slug,
        pagination: {
          page: 1,
          pageSize: 10,
        },
        filters: {
          startingDate: new Date(),
        },
      });
      expect(emptyTours).toBeDefined();
      expect(emptyTours.totalItems).toEqual(0);
      expect(emptyTours.items.length).toEqual(0);

      // get ordered by price DESC
      const orderedTours = await resolver.getTours({
        slug: createdTravel.slug,
        pagination: {
          page: 1,
          pageSize: 10,
        },
        order: {
          column: 'price',
          orientation: 'DESC',
        },
      });
      expect(orderedTours).toBeDefined();
      expect(orderedTours.items.length).toEqual(2);
      expect(orderedTours.items.length).toEqual(2);
      expect(orderedTours.items[0].id).toEqual(secondCreatedTour.id);
      expect(orderedTours.items[1].id).toEqual(firstCreatedTour.id);
    },
    timeout,
  );
});
