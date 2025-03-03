import {Country} from './Country'

export class Restaurant {
    private readonly _restaurant_uuid: string
    private readonly _name: string
    private readonly _country_code: string
    private readonly _images?: Array<string>

    constructor(uuid: string, name: string, country: Country, images: Array<string> = []) {
        this._restaurant_uuid = uuid
        this._name = name
        this._country_code = country.country_code
        this._images = images
    }

    get restaurant_uuid(): string {
        return this._restaurant_uuid
    }

    get name(): string {
        return this._name
    }

    get country_code(): string {
        return this._country_code
    }

    get images(): Array<string> {
        return this._images ?? []
    }
}