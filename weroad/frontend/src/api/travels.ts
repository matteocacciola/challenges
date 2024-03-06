import gql from "graphql-tag"
import { query, mutate } from "./api"
import type {
  DeletedTravelOutput,
  DeleteTravelInput,
  PaginatedTravelsOutput,
  TravelOutput,
  MoodsInput
} from "../graphql/types"

type CreateTravelInput = {
  slug: string,
  name: string,
  description: string,
  numberOfDays: number,
  isPublic?: boolean,
  moods: MoodsInput,
};

type GetPaginatedTravelsInput = {
  page?: number,
  pageSize?: number,
}

export default {
  async createTravel(
    { slug, name, description, numberOfDays, moods, isPublic }: {
      slug: string,
      name: string,
      description: string,
      numberOfDays: number,
      moods: MoodsInput,
      isPublic?: boolean
    }): Promise<TravelOutput | null> {
    const response = await mutate<CreateTravelInput, { createTravel: TravelOutput }>(
      gql`
        mutation CreateTravel($isPublic: Boolean!, $slug: String!, $name: String!, $description: String!, $numberOfDays: Int!, $moods: MoodsInput!) {
            createTravel (input: {
                isPublic: $isPublic
                slug: $slug
                name: $name
                description: $description
                numberOfDays: $numberOfDays
                moods: $moods
            }) {
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
        }`,
      { isPublic, slug, name, description, numberOfDays, moods })
    return response?.createTravel || null
  },

  async deleteTravel(id: string): Promise<DeletedTravelOutput | null> {
    const response = await mutate<DeleteTravelInput, { deleteTravel: DeletedTravelOutput }>(
      gql`
        mutation DeleteTravel($id: String!) {
            deleteTravel(input: { id: $id }) {
                id
                isDeleted
            }
        }`,
      { id })
    return response?.deleteTravel || null
  },

  async getTravels({ page, pageSize }: { page?: number, pageSize?: number }): Promise<{
    result: PaginatedTravelsOutput,
    page: number,
    pageSize: number
  } | null> {
    page = page || 1
    pageSize = pageSize || 10
    const result = await query<GetPaginatedTravelsInput, { getTravels: PaginatedTravelsOutput }>(
      gql`
        query GetTravels($page: Int!, $pageSize: Int!) {
            getTravels(
                filter: {
                    pagination: {
                        page: $page
                        pageSize: $pageSize
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
        }`,
      { page, pageSize })
    return { result: result.getTravels, page, pageSize }
  },

  async getAll(): Promise<TravelOutput[]> {
    const result = await query<{}, { getAllTravels: TravelOutput[] }>(
      gql`
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
        }`)
    return result?.getAllTravels || []
  }
}
