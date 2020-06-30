export interface PaginationParams {
    page: number;
    size: number;
}

export interface PaginatedResponse<T> {
    page: number;
    pages: number;
    size: number;
    total: number;
    results: T[];
}

export interface OffsetAndLimit {
    offset?: number;
    limit?: number;
}
