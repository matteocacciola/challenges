import {KnexConnection} from '../common/db'
import DataLoader from 'dataloader'
import {ImageRepository} from '../repositories/ImageRepository'
import {Image} from '../types/Image'
import {ImageSourceFactory} from '../factories/ImageSourceFactory'
import {RestaurantImage} from '../entities/RestaurantImage'
import {configuration} from '../config'

export const loadImagesUrls = function (): DataLoader<string, Image> {
    return new DataLoader<string, Image>(async (keys: any) => {
        const repository = new ImageRepository(KnexConnection, 'restaurant_has_image'),
            images = await repository.getByRestaurantUuids(keys)
        if (!images.length) return keys.map(() => [])

        const imageFactory = new ImageSourceFactory(),
            imageSource = imageFactory.create(configuration.images.source)

        const imagesUrls = await imageSource.fetchUrls()
        return keys.map((k: string) => {
            const imageIds = images.filter(
                (i: RestaurantImage) => i.restaurant_uuid === k
            ).map(
                (ri: RestaurantImage) => ri.image_uuid
            )
            return imagesUrls
                .filter((iu: Image) => imageIds.includes(iu.imageUuid))
                .map((iu) => iu.url)
        })
    })
}