export interface Reader<T> {
    find(item: Partial<T>): Promise<T[]>

    findOne(id: string | Partial<T>): Promise<T>
}