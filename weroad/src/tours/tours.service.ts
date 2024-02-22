import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from './tours.entity';
import {
  CreateTourInput,
  GetPaginatedToursInput,
  GetTourInput,
  UpdateTourInput,
} from './graphql/inputs.types';
import { Travel } from '../travels/travels.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
  ) {}

  async createTour(data: CreateTourInput): Promise<Tour> {
    const { travelId, ...tourData } = data;
    let travel: Travel;
    try {
      travel = await this.travelRepository.findOneByOrFail({
        id: travelId,
      });
    } catch (error) {
      throw new NotFoundException(`Travel with ID ${travelId} not found.`);
    }

    const tour = this.tourRepository.create({ ...tourData, travel });
    return this.tourRepository.save(tour);
  }

  async updateTour(data: UpdateTourInput): Promise<Tour> {
    const { id, ...tourData } = data;
    let tour: Tour;
    try {
      tour = await this.tourRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`Tour with ID ${id} not found.`);
    }

    tour = this.tourRepository.merge(tour, tourData);
    return this.tourRepository.save(tour);
  }

  async getTour(data: GetTourInput): Promise<Tour> {
    const { id } = data;
    return this.tourRepository.findOneByOrFail({ id });
  }

  async getTours(data: GetPaginatedToursInput): Promise<Tour[]> {
    const { pagination, order } = data;
    const { page, pageSize } = pagination ?? {};
    const { column, orientation } = order ?? {};

    return this.tourRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: this.getToursWhere(data),
      order: {
        [column]: orientation,
      },
    });
  }

  async getToursCount(data: GetPaginatedToursInput): Promise<number> {
    return this.tourRepository.count({ where: this.getToursWhere(data) });
  }

  private getToursWhere(data: GetPaginatedToursInput) {
    const { slug, filters } = data;
    const { priceFrom, priceTo, startingDate, endingDate } = filters ?? {};
    if (startingDate) {
      startingDate.setHours(0, 0, 0, 0);
    }
    if (endingDate) {
      endingDate.setHours(23, 59, 59, 999);
    }

    return {
      travel: { slug },
      ...(priceFrom && !priceTo && { price: MoreThanOrEqual(priceFrom) }),
      ...(priceTo && !priceFrom && { price: LessThanOrEqual(priceTo) }),
      ...(priceFrom && priceTo && { price: Between(priceFrom, priceTo) }),
      ...(startingDate && { startingDate: MoreThanOrEqual(startingDate) }),
      ...(endingDate && { endingDate: LessThanOrEqual(endingDate) }),
    };
  }
}
