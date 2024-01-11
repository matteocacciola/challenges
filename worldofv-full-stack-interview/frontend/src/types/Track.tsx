export type Track = {
  id: number;
  name: string;
  price: number;
  duration: number;
  genre: string;
  artist: {
    id: number;
    name: string;
  }
}