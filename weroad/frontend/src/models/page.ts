export declare type Page<T> = {
    currentPage: number;
    size: number;
    itemsOnPage: number;
    totalPages: number;
    totalItems: number;
    items: T[];
};
