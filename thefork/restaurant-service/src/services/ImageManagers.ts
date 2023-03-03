import {Image} from '../types/Image'
import axios from 'axios'
import {configuration} from '../config'

export interface ImageManager {
    fetchUrls(): Promise<Image[]>
}

class RemoteSource implements ImageManager {
    async fetchUrls(): Promise<Image[]> {
        const images = await axios.get(configuration.images.origin)
        return images.data.images
    }
}

export const managers: object = {
    remote: new RemoteSource()
}