import {KnexConnection} from '../common/db'
import DataLoader from 'dataloader'
import {CountryRepository} from '../repositories/CountryRepository'

export const loadCountries = function () {
    return new DataLoader(async (keys: any) => {
        const repository = new CountryRepository(KnexConnection, 'country'),
            countries = await repository.getByCountryCodes(keys)
        return keys.map((k: string) => countries.find((c) => c.country_code === k))
    })
}