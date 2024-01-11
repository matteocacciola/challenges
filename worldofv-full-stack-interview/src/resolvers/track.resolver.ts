import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Loader } from 'nestjs-dataloader/dist';
import * as DataLoader from 'dataloader';
import { GetTracksInput } from '../inputs/track.input';
import { Artist } from '../entities';
import { Track } from '../models';
import { TrackService } from '../services';
import { ArtistLoader } from '../loaders';

@Resolver(() => Track)
export class TrackResolver {
  constructor(private readonly trackService: TrackService) {}

  @Query(() => [Track])
  async getTracks(@Args('filter') filter: GetTracksInput): Promise<Track[]> {
    const tracks = await this.trackService.getTracks(filter);
    // Map the retrieved tracks to the desired DTO format
    return tracks.map((track) => ({
      id: track.TrackId,
      name: track.Name,
      price: track.UnitPrice,
      duration: track.Milliseconds / 1000,
      genre: track.Genre.Name,
    }));
  }

  @ResolveField(() => Artist)
  async artist(
    @Parent() track: Track,
    @Loader(ArtistLoader) artistLoader: DataLoader<number, Artist>,
  ) {
    return artistLoader.load(track.id);
  }
}
