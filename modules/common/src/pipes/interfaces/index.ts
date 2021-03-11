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
    lang: string;
    territory: string;
    original: string;
}

export enum ErentoLocales {
    deDe = 'de-DE',
    deCH = 'de-CH',
    deAT = 'de-AT',
    enGB = 'en-GB',
    enUS = 'en-US',
}

export enum CampandaLocales {
    deDe = 'de_DE',
    deCH = 'de_CH',
    deAT = 'de_AT',
    enGB = 'en_GB',
    enUS = 'en_US',
    frFR = 'fr_FR',
    esES = 'es_ES',
    itIT = 'it_IT',
}
