import {Knex} from 'knex'
import {Writer} from './interfaces/Writer'
import {Reader} from './interfaces/Reader'

export abstract class BaseRepository<T> implements Writer<T>, Reader<T> {
    private readonly knex: Knex
    private readonly table: string

    constructor(knex: Knex, table: string) {
        this.knex = knex
        this.table = table
    }

    get qb(): Knex.QueryBuilder {
        return this.knex(this.table)
    }

    async create(item: Omit<T, 'id'>): Promise<T> {
        const [output] = await this.qb.insert<T>(item).returning('*')

        return output as Promise<T>
    }

    createMany(items: T[]): Promise<T[]> {
        return this.qb.insert<T>(items) as Promise<T[]>
    }

    update(id: string, item: Partial<T>): Promise<boolean> {
        return this.qb
            .where('id', id)
            .update(item)
    }

    delete(id: string): Promise<boolean> {
        return this.qb
            .where('id', id)
            .del()
    }

    find(item: Partial<T>): Promise<T[]> {
        return this.qb
            .where(item)
            .select()
    }

    findOne(id: string | Partial<T>): Promise<T> {
        return typeof id === 'string'
            ? this.qb.where('id', id).first()
            : this.qb.where(id).first()
    }

    async exist(id: string | Partial<T>) {
        const query = this.qb.select<[{ count: number }]>(
            this.knex.raw('COUNT(*)::integer as count')
        )

        if (typeof id !== 'string') {
            query.where(id)
        } else {
            query.where('id', id)
        }

        const exist = await query.first()

        return exist!.count !== 0
    }
}
