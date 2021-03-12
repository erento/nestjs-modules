export enum ErentoLocale {
    DeDe = 'de-DE',
    DeCh = 'de-CH',
    DeAt = 'de-AT',
    EnGb = 'en-GB',
    EnUs = 'en-US',
}

export enum CampandaLocale {
    DeDe = 'de_DE',
    DeCh = 'de_CH',
    DeAt = 'de_AT',
    EnGb = 'en_GB',
    EnUs = 'en_US',
    FrFr = 'fr_FR',
    EsEs = 'es_ES',
    ItIt = 'it_IT',
}

export enum ErentoLanguage {
    De = 'de',
    En = 'en',
}

export enum CampandaLanguage {
    De = 'de',
    En = 'en',
    Fr = 'fr',
    Es = 'es',
    It = 'it',
}

export const CAMPANDA_LOCALE_ARRAY: string[] = Object.values(CampandaLocale);
export const CAMPANDA_DEFAULT_LOCALE: string = CampandaLocale.DeDe;

export const ERENTO_LOCALE_ARRAY: string[] = Object.values(ErentoLocale);
export const ERENTO_DEFAULT_LOCALE: string = ErentoLocale.DeDe;
