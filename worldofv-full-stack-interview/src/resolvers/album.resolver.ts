import { Args, Query, Resolver } from '@nestjs/graphql';
import { AlbumService } from '../services';
import { Album } from '../models';

@Resolver(() => Album)
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(() => [Album])
  async getAlbumsForArtist(
    @Args('artistId') artistId: number,
  ): Promise<Album[]> {
    const albums = await this.albumService.getAlbumsForArtist(artistId);
    return albums.map((a) => ({ id: a.AlbumId, title: a.Title }));
  }
}
