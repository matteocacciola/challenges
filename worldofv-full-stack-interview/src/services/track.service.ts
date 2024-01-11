import { Injectable } from '@nestjs/common';
import { GetTracksInput } from '../inputs/track.input';
import { Track } from '../entities';
import { TrackRepository } from '../repositories';

@Injectable()
export class TrackService {
  constructor(private readonly repository: TrackRepository) {}

  async getTracks(filter: GetTracksInput): Promise<Track[]> {
    return this.repository.findTracks(filter);
  }
}
