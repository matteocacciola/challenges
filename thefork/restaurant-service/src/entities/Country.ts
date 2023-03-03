export class Country {
    private readonly _country_code: string
    private readonly _locales?: string[]

    constructor(code: string, locales: Array<string> = []) {
        this._country_code = code
        this._locales = locales
    }

    get country_code(): string {
        return this._country_code
    }

    get locales(): string[] {
        return this._locales ?? []
    }
}