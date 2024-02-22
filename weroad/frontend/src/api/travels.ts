import { api } from "./api";

export default {
  async createTravel(
    slug: string,
    name: string,
    description: string,
    numberOfDays: number,
    moods: {
      nature: number,
      history: number,
      party: number,
      relax: number,
      culture: number,
    },
    isPublic?: boolean,
  ) {
    const response = await api({
      query: `
        mutation CreateTravel {
          createTravel (
            input: {
              isPublic: ${isPublic ?? false}
              slug: "${slug}"
              name: "${name}"
              description: "${description}"
              numberOfDays: ${numberOfDays}
              moods: {
                nature: ${moods.nature}
                history: ${moods.history}
                party: ${moods.party}
                relax: ${moods.relax}
                culture: ${moods.culture}
              }
            }
          ) {
            id
            isPublic
            slug
            name
            description
            numberOfDays
            moods {
              nature
              history
              party
              relax
              culture
            }
            numberOfNights
          }
        }
      `,
    });
    return response.createTravel;
  },

  async deleteTravel(id: string) {
    const response = await api({
      query: `
        mutation DeleteTravel {
          deleteTravel(
            input: {
              id: "${id}"
            }
          ) {
            id
            isDeleted
          }
        }
      `,
    });
    return response.deleteTravel;
  },

  async getTravels(page?: number, pageSize?: number) {
    page = page || 1;
    pageSize = pageSize || 10;
    const response = await api({
      query: `
        query GetTravels {
          getTravels(
            filter: {
              pagination: {
                page: ${page}
                pageSize: ${pageSize}
              }
            }
          ) {
            items {
              id
              isPublic
              slug
              name
              description
              numberOfDays
              moods {
                nature
                history
                party
                relax
                culture
              }
              numberOfNights
              tours {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
              }
            }
            totalItems
          }
        }
      `,
    });
    return { result: response.getTravels, page, pageSize };
  },

  async getAll() {
    const response = await api({
      query: `
        query GetAllTravels {
          getAllTravels {
            id
            isPublic
            slug
            name
            description
            numberOfDays
            moods {
              nature
              history
              party
              relax
              culture
            }
            numberOfNights
          }
        }
      `,
    });
    return response.getAllTravels;
  },
};
