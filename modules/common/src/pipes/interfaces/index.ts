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

// Object properties defined as in this wiki article
// https://en.wikipedia.org/wiki/Locale_(computer_software)
export interface LocaleObject {
    locale: string;
    language: string;
    territory: string;
    original: string;
}
