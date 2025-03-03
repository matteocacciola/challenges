import {loadCountries} from './Country'
import {loadImagesUrls} from './Image'

export const loaders = () => ({
    loadCountries: loadCountries(),
    loadImages: loadImagesUrls()
})