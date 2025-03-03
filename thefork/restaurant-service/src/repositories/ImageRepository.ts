import {BaseRepository} from './BaseRepository'
import {RestaurantImage} from '../entities/RestaurantImage'

export class ImageRepository extends BaseRepository<RestaurantImage> {
    async getByRestaurantUuids(restaurantsUuids: string[]): Promise<RestaurantImage[]> {
        return this.qb.whereIn('restaurant_uuid', restaurantsUuids)
    }
}