import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './travels.entity';
import {
  CreateTravelInput,
  DeleteTravelInput,
  GetPaginatedTravelsInput,
} from './graphql/inputs.types';
import { Mood } from './travels.enums';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
  ) {}

  getRepository(): Repository<Travel> {
    return this.travelRepository;
  }

  async createTravel(data: CreateTravelInput): Promise<Travel> {
    try {
      const { moods, ...rest } = data;

      const moodsObject: { [key in Mood]: number } | NonNullable<unknown> = {};
      for (const mood of Object.values(Mood)) {
        moodsObject[mood] = moods[mood];
      }

      const travel = this.travelRepository.create({
        ...rest,
        moods: moodsObject,
      });

      return this.travelRepository.save(travel);
    } catch (error) {
      throw new Error(
        `Something went wrong when creating a new travel: ${error}`,
      );
    }
  }

  async deleteTravel(data: DeleteTravelInput): Promise<boolean> {
    try {
      await this.travelRepository.delete(data.id);
      return true;
    } catch (error) {
      throw new Error(
        `Something went wrong when deleting travel with id ${data.id}: ${error}`,
      );
    }
  }

  async getTravels({
    pagination,
  }: GetPaginatedTravelsInput): Promise<Travel[]> {
    try {
      const { page, pageSize } = pagination;
      return this.travelRepository.find({
        skip: (page - 1) * pageSize,
        take: pageSize,
        relations: ['tours'],
        where: this.getIsPublicWhereClause(),
      });
    } catch (error) {
      throw new Error(`Something went wrong when getting travels: ${error}`);
    }
  }

  public getIsPublicWhereClause(): object {
    return {
      isPublic: true,
    };
  }
}
