import gql from "graphql-tag"
import { query, mutate } from "./api"
import type {
  CreateTourInput,
  PaginatedToursOutput,
  TourOutput,
  UpdateTourInput
} from "../graphql/types"

type GetPaginatedToursInput = {
  slug: string,
  priceFrom?: number,
  priceTo?: number,
  startingDate?: Date,
  endingDate?: Date,
  page?: number,
  pageSize?: number,
  orderDirection?: string,
};

export default {
  async createTour(
    { travelId, name, startingDate, endingDate, price, currency }: {
      travelId: string
      name: string,
      startingDate: Date,
      endingDate: Date,
      price: number,
      currency?: string
    }): Promise<TourOutput | null> {
    currency = currency ?? "EUR"
    const result = await mutate<CreateTourInput, { createTour: TourOutput }>(
      gql`
          mutation CreateTour($travelId: String!, $name: String!, $startingDate: DateTime!, $endingDate: DateTime!, $price: Float!, $currency: String!) {
              createTour (input: {
                  travelId: $travelId
                  name: $name
                  startingDate: $startingDate
                  endingDate: $endingDate
                  price: $price,
                  currency: $currency
              }) {
                  id,
                  name,
                  startingDate,
                  endingDate,
                  price,
                  currency
              }
          }`,
      { travelId, name, startingDate, endingDate, price, currency }
    )
    return result?.createTour || null
  },

  async updateTour(
    { id, name, startingDate, endingDate, price, currency }: {
      id: string,
      name?: string,
      startingDate?: Date,
      endingDate?: Date,
      price?: number,
      currency?: string
    }): Promise<TourOutput | null> {
    name = name ? name : null
    currency = currency ?? "EUR"
    price = price ? price : null
    const result = await mutate<UpdateTourInput, { updateTour: TourOutput }>(
      gql`
          mutation UpdateTour($id: String!, $name: String, $startingDate: DateTime, $endingDate: DateTime, $price: Float, $currency: String) {
              updateTour (
                  input: {
                      id: $id
                      name: $name
                      startingDate: $startingDate
                      endingDate: $endingDate
                      price: $price
                      currency: $currency
                  }
              ) {
                  id,
                  name,
                  startingDate,
                  endingDate,
                  price,
                  currency
              }
          }`,
      { id, name, startingDate, endingDate, price, currency }
    )
    return result?.updateTour || null
  },

  async getTours(
    { slug, page, pageSize, priceFrom, priceTo, startingDate, endingDate, orderDirection }: {
      slug: string,
      page?: number,
      pageSize?: number,
      priceFrom?: number,
      priceTo?: number,
      startingDate?: Date,
      endingDate?: Date,
      orderDirection?: string
    }): Promise<{ result: PaginatedToursOutput, page: number, pageSize: number }> {
    page = page ? page : 1
    pageSize = pageSize ? pageSize : 10
    priceFrom = priceFrom ? priceFrom : null
    priceTo = priceTo ? priceTo : null
    orderDirection = orderDirection ? `"${orderDirection}"` : "ASC"
    if (priceFrom && priceTo && priceFrom > priceTo) {
      throw new Error("Price from must be less than or equal to price to")
    }
    if (startingDate && endingDate && startingDate > endingDate) {
      throw new Error("Starting date must be before ending date")
    }
    if (priceFrom || priceTo || startingDate || endingDate) {
      orderDirection = "ASC"
    }

    const result = await query<GetPaginatedToursInput, { getTours: PaginatedToursOutput }>(
      gql`
          query GetTours($slug: String!, $priceFrom: Float, $priceTo: Float, $startingDate: DateTime, $endingDate: DateTime, $page: Int, $pageSize: Int, $orderDirection: String) {
              getTours (
                  filter: {
                      slug: $slug,
                      filters: {
                          priceFrom: $priceFrom,
                          priceTo: $priceTo,
                          startingDate: $startingDate,
                          endingDate: $endingDate
                      },
                      pagination: {
                          page: $page,
                          pageSize: $pageSize
                      },
                      order: {
                          column: "price",
                          orientation: $orderDirection
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
          }`,
      { slug, priceFrom, priceTo, startingDate, endingDate, page, pageSize, orderDirection }
    )
    return { result: result.getTours, page, pageSize }
  },

  async getTour(id: string): Promise<TourOutput | null> {
    const result = await query<{ id: string }, { getTour: TourOutput }>(
      gql`
        query GetTour($id: String!) {
            getTour (
                filter: {
                    id: $id
                }
            ) {
                id,
                name,
                startingDate,
                endingDate,
                price,
                currency
            }
        }`,
      { id })
    return result?.getTour || null
  }
}
