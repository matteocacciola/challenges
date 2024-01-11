import { graphql } from '../composables/graphql';

export const fetchTracks = async (page: number, pageSize: number) => {
  const response = await graphql(
    `
      query GetTracks($page: Int, $pageSize: Int) {
        getTracks(filter: { page: $page, pageSize: $pageSize }) {
          id
          name
          price
          duration
          genre
          artist {
            id
            name
          }
        }
      }
    `,
    {
      page,
      pageSize: pageSize,
    },
  );

  return response.getTracks;
}