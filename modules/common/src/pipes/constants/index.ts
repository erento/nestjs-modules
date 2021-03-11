export enum ErentoLocales {
    DeDe = 'de-DE',
    DeCh = 'de-CH',
    DeAt = 'de-AT',
    EnGb = 'en-GB',
    EnUs = 'en-US',
}

export enum CampandaLocales {
    DeDe = 'de_DE',
    DeCh = 'de_CH',
    DeAt = 'de_AT',
    EnGb = 'en_GB',
    EnUs = 'en_US',
    FrFr = 'fr_FR',
    EsEs = 'es_ES',
    ItIt = 'it_IT',
}

export enum ErentoLanguages {
    De = 'de',
    En = 'en',
}

export enum CampandaLanguages {
    De = 'de',
    En = 'en',
    Fr = 'fr',
    Es = 'es',
    It = 'it',
}

export const CAMPANDA_LOCALE_ARRAY: string[] = Object.values(CampandaLocales);
export const CAMPANDA_DEFAULT_LOCALE: string = CampandaLocales.DeDe;

export const ERENTO_LOCALE_ARRAY: string[] = Object.values(ErentoLocales);
export const ERENTO_DEFAULT_LOCALE: string = ErentoLocales.DeDe;
