import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import { Artist } from '../models';
import { ArtistService } from '../services';

@Injectable()
export class ArtistLoader implements NestDataLoader<number, Artist> {
  constructor(private readonly artistService: ArtistService) {}

  generateDataLoader(): DataLoader<number, Artist> {
    return new DataLoader<number, Artist>(async (trackIds) => {
      const artistMap: Record<number, Artist> =
        await this.artistService.getMappedArtistsByTrackIds(trackIds);

      return trackIds.map((trackId) => artistMap[trackId]);
    });
  }
}
