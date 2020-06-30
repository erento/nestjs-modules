import {OffsetAndLimit, PaginatedResponse, PaginationParams} from '../pipes/interfaces';

export function getPaginationQuery (params?: PaginationParams): OffsetAndLimit {
    if (!params) {
        return {};
    }

    return {
        offset: Math.max(params.page - 1, 0) * params.size,
        limit: params.size,
    };
}

export function mapToPaginationResponse<T> (paginationParams: PaginationParams, count: number, results: T[]): PaginatedResponse<T> {
    return {
        page: paginationParams.page,
        pages: Math.ceil(count / paginationParams.size),
        results,
        size: paginationParams.size,
        total: count,
    };
}
