import {Knex} from 'knex'
import {BaseRepository} from './BaseRepository'
import {Restaurant} from '../entities/Restaurant'
import {Filter} from '../types/Filter'
import {Pagination} from '../types/Pagination'
import {OrderBy} from '../types/OrderBy'

export class RestaurantRepository extends BaseRepository<Restaurant> {
    async findPaginated(pagination: Pagination, filter: Filter, sort: OrderBy): Promise<Restaurant[]> {
        const {limit = 20, page = 1} = pagination || {}
        const {column = 'name', orientation = 'ASC'} = sort || {}

        if (page <= 0 || limit <= 0) {
            throw Error('Invalid pagination')
        }

        const offset = (page - 1) * limit
        return (
            await this.filter(filter)
                .modify(function (queryBuilder) {
                    queryBuilder
                        .select('restaurant.*')
                        .distinct()
                        .orderBy(column, orientation)
                })
                .offset(offset)
                .limit(limit)
        )
    }

    async count(filter: Filter): Promise<number> {
        return (
            await this.filter(filter)
                .modify(function (queryBuilder) {
                    queryBuilder
                        .countDistinct('restaurant.*')
                        .first()
                })
        ).count
    }

    private filter(filter: Filter): Knex.QueryBuilder {
        const {withImages, name} = filter || {}

        return this.qb
            .modify(function (queryBuilder) {
                if (typeof withImages === 'boolean') {
                    queryBuilder
                        .leftJoin(
                            'restaurant_has_image',
                            'restaurant.restaurant_uuid',
                            'restaurant_has_image.restaurant_uuid'
                        )
                        .modify(function (queryBuilder) {
                            if (withImages) {
                                queryBuilder.whereNotNull('restaurant_has_image.image_uuid')
                            } else {
                                queryBuilder.whereNull('restaurant_has_image.image_uuid')
                            }
                        })
                }
                if (name) {
                    queryBuilder.where('restaurant.name', 'ilike', `%${name}%`)
                }
            })
    }
}