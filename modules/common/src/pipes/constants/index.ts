export enum ErentoLocales {
    deDe = 'de-DE',
    deCh = 'de-CH',
    deAt = 'de-AT',
    enGb = 'en-GB',
    enUs = 'en-US',
}

export enum CampandaLocales {
    deDe = 'de_DE',
    deCh = 'de_CH',
    deAt = 'de_AT',
    enGb = 'en_GB',
    enUs = 'en_US',
    frFr = 'fr_FR',
    esEs = 'es_ES',
    itIt = 'it_IT',
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
