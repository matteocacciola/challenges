import {gql} from 'apollo-server-express'

export const typeDefs = gql`
    type Country {
        code: String!
        locales: [String!]!
    }

    type Restaurant {
        restaurantUuid: String!
        name: String!
        country: Country!
        images: [String]
        allowReview: Boolean!
    }

    type Pagination {
        total: Int!
        pageCount: Int!
        currentPage: Int
    }

    input PaginationInput {
        limit: Int
        page: Int
    }

    input RestaurantsFilter {
        name: String
        withImages: Boolean
    }

    input OrderBy {
        column: String
        orientation: String
    }
    
    type Info {
        restaurants: [Restaurant]
        pagination: Pagination
    }

    type Query {
        info(pagination: PaginationInput, filter: RestaurantsFilter, orderBy: OrderBy): Info 
    }
`