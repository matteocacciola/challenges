import {managers as imageManagers, ImageManager} from '../services/ImageManagers'
import {isKeyOfObject} from '../common/helpers'

export class ImageSourceFactory {
    create(type: string): ImageManager {
        if (isKeyOfObject(type, imageManagers)) {
            return imageManagers[type]
        }

        throw Error('Image Manager not existing')
    }
}