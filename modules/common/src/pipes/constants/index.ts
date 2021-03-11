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

export enum ErentoLanguages {
    de = 'de',
    en = 'en',
}

export enum CampandaLanguages {
    de = 'de',
    en = 'en',
    fr = 'fr',
    es = 'es',
    it = 'it',
}

export const CAMPANDA_LOCALE_ARRAY: string[] = Object.values(CampandaLocales);
export const CAMPANDA_DEFAULT_LOCALE: string = CampandaLocales.deDe;

export const ERENTO_LOCALE_ARRAY: string[] = Object.values(ErentoLocales);
export const ERENTO_DEFAULT_LOCALE: string = ErentoLocales.deDe;
