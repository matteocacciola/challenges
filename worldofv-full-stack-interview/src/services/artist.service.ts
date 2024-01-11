import { Injectable } from '@nestjs/common';
import { Artist } from '../models';
import { TrackRepository } from '../repositories';

@Injectable()
export class ArtistService {
  constructor(private readonly repository: TrackRepository) {}

  async getMappedArtistsByTrackIds(
    trackIds: readonly number[],
  ): Promise<Record<number, Artist>> {
    const tracks = await this.repository.findTracksByArtistIds(trackIds);
    const artistMap: Record<number, Artist> = {};

    tracks.forEach((track) => {
      artistMap[track.TrackId] = {
        id: track.Album.Artist.ArtistId,
        name: track.Album.Artist.Name,
      };
    });

    return artistMap;
  }
}
