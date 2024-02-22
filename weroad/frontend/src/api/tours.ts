import { api } from "./api";

export default {
  async createTour(
    travelId: string,
    name: string,
    startingDate: Date,
    endingDate: Date,
    price: number,
    currency?: string,
  ) {
    currency = currency ?? 'EUR';
    const response = await api({
      query: `
        mutation CreateTour {
          createTour (
            input: {
              travelId: "${travelId}"
              name: "${name}"
              startingDate: "${startingDate.toISOString()}"
              endingDate: "${endingDate.toISOString()}"
              price: ${price},
              currency: "${currency}"
            }
          ) {
            id,
            name,
            startingDate,
            endingDate,
            price,
            currency
          }
        }
      `,
    });
    return response.createTour;
  },

  async updateTour(
    id: string,
    name?: string,
    startingDate?: Date,
    endingDate?: Date,
    price?: number,
    currency?: string,
  ) {
    name = name ? `"${name}"` : null;
    currency = currency ?? "EUR";
    const startingDateString = startingDate
      ? `"${startingDate.toISOString()}"`
      : null;
    const endingDateString = endingDate
      ? `"${endingDate.toISOString()}"`
      : null;
    price = price ? price : null;
    const response = await api({
      query: `
        mutation UpdateTour {
          updateTour (
            input: {
              id: "${id}"
              name: ${name}
              startingDate: ${startingDateString}
              endingDate: ${endingDateString}
              price: ${price},
              currency: "${currency}"
            }
          ) {
            id,
            name,
            startingDate,
            endingDate,
            price,
            currency
          }
        }
      `,
    });
    return response.updateTour;
  },

  async getTours(
    slug: string,
    page?: number,
    pageSize?: number,
    priceFrom?: number,
    priceTo?: number,
    startingDate?: Date,
    endingDate?: Date,
    orderDirection?: string,
  ) {
    page = page ? page : 1;
    pageSize = pageSize ? pageSize : 10;
    const startingDateString = startingDate
      ? `"${startingDate.toISOString()}"`
      : null;
    const endingDateString = endingDate
      ? `"${endingDate.toISOString()}"`
      : null;
    priceFrom = priceFrom ? priceFrom : null;
    priceTo = priceTo ? priceTo : null;
    orderDirection = orderDirection ? `"${orderDirection}"` : "ASC";
    if (priceFrom && priceTo && priceFrom > priceTo) {
      throw new Error("Price from must be less than or equal to price to");
    }
    if (startingDate && endingDate && startingDate > endingDate) {
      throw new Error("Starting date must be before ending date");
    }
    if (priceFrom || priceTo || startingDate || endingDate) {
      orderDirection = "ASC";
    }

    const response = await api({
      query: `
        query GetTours {
          getTours (
            filter: {
              slug: "${slug}",
              filters: {
                priceFrom: ${priceFrom},
                priceTo: ${priceTo},
                startingDate: ${startingDateString},
                endingDate: ${endingDateString}
              },
              pagination: {
                page: ${page},
                pageSize: ${pageSize}
              },
              order: {
                column: "price",
                orientation: "${orderDirection}"
              }
            }
          ) {
            items {
              id,
              name,
              startingDate,
              endingDate,
              price,
              currency
            }
            totalItems
          }
        }
      `,
    });
    return { result: response.getTours, page, pageSize };
  },


  async getTour(id: string) {
    const response = await api({
      query: `
        query GetTour {
          getTour (
            filter: {
              id: "${id}"
            }
          ) {
            id,
            name,
            startingDate,
            endingDate,
            price,
            currency
          }
        }
      `,
    });
    return response.getTour;
  },
};
