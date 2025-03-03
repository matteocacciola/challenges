import {KnexConnection} from '../common/db'
import {RestaurantRepository} from '../repositories/RestaurantRepository'
import {Pagination} from '../types/Pagination'
import {Filter} from '../types/Filter'
import {Country} from '../entities/Country'
import {Restaurant} from '../entities/Restaurant'
import {OrderBy} from '../types/OrderBy'
import {configuration} from '../config'

const repository = new RestaurantRepository(KnexConnection, 'restaurant')

export const resolvers = {
    Country: {
        code: (parent: Country) => parent.country_code
    },

    Restaurant: {
        restaurantUuid: (parent: Restaurant) => parent.restaurant_uuid,
        images: async (parent: Restaurant, _: any, {loaders}: { loaders: any }) => {
            return loaders.loadImages.load(parent.restaurant_uuid)
        },
        country: async (parent: Restaurant, _: any, {loaders}: { loaders: any }) => {
            return loaders.loadCountries.load(parent.country_code)
        },
        allowReview: (parent: Restaurant) => configuration.countries.review.includes(parent.country_code)
    },

    Query: {
        info: async (
            _: Restaurant,
            {pagination, filter, sort}: { pagination: Pagination; filter: Filter, sort: OrderBy }
        ) => {
            const {page = 1, limit = 20} = pagination || {},
                totalCount = await repository.count(filter),
                pageCount = totalCount === 0 ? totalCount : Math.ceil(totalCount / limit),
                restaurants = await repository.findPaginated(pagination, filter, sort)

            return {
                restaurants,
                pagination: {
                    total: totalCount,
                    pageCount,
                    currentPage: pageCount === 0 ? null : page
                }
            }
        }
    }
}
