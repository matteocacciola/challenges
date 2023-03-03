export class RestaurantImage {
    private readonly _restaurant_uuid: string
    private readonly _image_uuid: string

    constructor(restaurantUuid: string, imageUuid: string) {
        this._restaurant_uuid = restaurantUuid
        this._image_uuid = imageUuid
    }

    get restaurant_uuid(): string {
        return this._restaurant_uuid
    }

    get image_uuid(): string {
        return this._image_uuid
    }
}
