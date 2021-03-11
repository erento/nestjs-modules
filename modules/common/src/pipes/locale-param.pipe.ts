import {Injectable, PipeTransform} from '@nestjs/common';
import {LocaleObject} from './interfaces';

@Injectable()
export class LocaleParamPipe implements PipeTransform<Record<string, any>, LocaleObject> {
    private separator: string;

    /**
     * Delimiters can be dashes or underscores but must match between defaultLocale and other locales
     * @constructor
     * @param {string[]} locales Array of allowed locale strings e.g. [de-DE] or [en_GB]
     * @param {string} defaultLocale  Default locale e.g. de-DE or en_GB
     */
    constructor (private locales: string[], private defaultLocale: string) {
        const regex: RegExp = /^[a-zA-Z]{2}(?<separator>[-_])[a-zA-Z]{2}$/;
        const separator: string | undefined = defaultLocale.match(regex)?.groups?.separator;
        this.separator = separator ?? '-';
    }

    public transform (query: Record<string, any>): LocaleObject {
        if (!query?.locale) {
            return this.createLocaleObject(this.defaultLocale, '');
        }

        const selectedByIsoCode: string | undefined = this.locales.find(
            (isoCode: string): boolean => isoCode === query.locale,
        );

        if (selectedByIsoCode !== undefined) {
            return this.createLocaleObject(selectedByIsoCode, query.locale);
        }

        const selectedByLocale: string | undefined = this.locales.find(
            (isoCode: string): boolean => isoCode.split(this.separator)[0] === query.locale,
        );

        if (selectedByLocale !== undefined) {
            return this.createLocaleObject(selectedByLocale, query.locale);
        }

        return this.createLocaleObject(this.defaultLocale, query.locale);
    }

    private createLocaleObject (isoCode: string, original: string): LocaleObject {
        return {
            locale: isoCode,
            lang: isoCode.split(this.separator)[0],
            territory: isoCode.split(this.separator)[1],
            original,
        };
    }
}
