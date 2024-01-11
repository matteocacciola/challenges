import React, { useState, useEffect } from 'react';
import { Track } from '../types/Track';
import { fetchTracks } from '../api/Tracks';

const TracksList = ({ pageSize }: { pageSize: number }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const loadTracks = async () => {
      const tracks = await fetchTracks(page, pageSize);
      setTracks(tracks);
    };

    loadTracks();
  }, [page, pageSize]);

  return (
    <div>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>
            {track.name} - {track.genre} ({track.duration} seconds, ${track.price}). Artist: {track.artist.name}
          </li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)} disabled={tracks.length < pageSize}>Next</button>
    </div>
  );
};

export default TracksList;
