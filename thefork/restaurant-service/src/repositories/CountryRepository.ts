import {BaseRepository} from './BaseRepository'
import {Country} from '../entities/Country'

export class CountryRepository extends BaseRepository<Country> {
    async getByCountryCodes(countryCodes: string[]): Promise<Country[]> {
        return this.qb.whereIn('country_code', countryCodes)
    }
}