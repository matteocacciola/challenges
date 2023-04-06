import {describe, expect, it} from 'vitest';
import {rankPlayers} from '../rank-players';

describe('rank players', () => {
  it('test', () => {
    const players = [
      {
        name: 'John',
        points: 100,
      },
      {
        name: 'Bob',
        points: 130,
      },
      {
        name: 'Mary',
        points: 120,
      },
      {
        name: 'Kate',
        points: 120,
      },
    ];
    const ranks = [
      {
        name: 'Bob',
        points: 130,
        position: 1,
      },
      {
        name: 'Kate',
        points: 120,
        position: 2,
      },
      {
        name: 'Mary',
        points: 120,
        position: 2,
      },
      {
        name: 'John',
        points: 100,
        position: 4,
      },
    ];

    const result = rankPlayers(players);
    expect(result).toEqual(ranks);
  });
});
