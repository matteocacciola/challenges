export type PlayerType = {
  name: string;
  points: number;
};

export const rankPlayers = (players: PlayerType[]): PlayerType[] => {
  return players
    .sort((a, b): number => {
      return (a.points === b.points ? +(a.name > b.name) : +( a.points < b.points)) || -1;
    })
    .map((player, i, players) => ({
      ...player,
      position: i && players[i - 1].points === player.points ? i : i + 1
    }));
};
