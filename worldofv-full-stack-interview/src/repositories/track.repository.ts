import { Injectable } from '@nestjs/common';
import { LessThan, Like, MoreThanOrEqual, DataSource } from 'typeorm';
import { Repository } from './repository';
import { Track } from '../entities';
import { GetTracksInput } from '../inputs/track.input';

@Injectable()
export class TrackRepository extends Repository<Track> {
  constructor(dataSource: DataSource) {
    super(Track, dataSource);
  }

  async findTracksByArtistIds(artistIds: readonly number[]): Promise<Track[]> {
    return this.createQueryBuilder()
      .whereInIds(artistIds)
      .leftJoinAndSelect('Track.Album', 'Album')
      .leftJoinAndSelect('Album.Artist', 'Artist')
      .getMany();
  }

  async findTracks(filter: GetTracksInput): Promise<Track[]> {
    const { artistName, genreName, minPrice, maxPrice, page, pageSize } =
      filter;
    const relations = ['Album', 'Album.Artist', 'Genre'];

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = {
      ...(artistName && {
        Album: { Artist: { Name: Like(`%${artistName}%`) } },
      }),
      ...(genreName && { Genre: { Name: Like(`%${genreName}%`) } }),
      ...(minPrice && { UnitPrice: MoreThanOrEqual(minPrice) }),
      ...(maxPrice && { UnitPrice: LessThan(maxPrice) }),
    };

    return this.find({ relations, where, skip, take });
  }
}
