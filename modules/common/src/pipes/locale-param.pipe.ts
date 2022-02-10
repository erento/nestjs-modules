import {Injectable, PipeTransform} from '@nestjs/common';
import {LocaleObject} from './interfaces';

@Injectable()
export class LocaleParamPipe implements PipeTransform<Record<string, any>, LocaleObject> {
    private separator: string;
    /**
     * Delimiters can be dashes or underscores but must match between defaultLocale and other locales
     *
     * @constructor
     * @param locales Array of allowed locale strings e.g. [de-DE] or [en_GB]
     * @param defaultLocale  Default locale e.g. de-DE or en_GB
     */
    constructor (private defaultLocale: string, private locales: string[]) {
        this.separator = this.createSeparator();
    }

    public transform (query: Record<string, any>): LocaleObject {
        if (!query?.locale) {
            return this.createLocaleObject(this.defaultLocale, '');
        }

        const selectedByLocale: string | undefined = this.locales.find(
            (locale: string): boolean => locale === query.locale,
        );

        if (selectedByLocale !== undefined) {
            return this.createLocaleObject(selectedByLocale, query.locale);
        }

        const selectedByLanguage: string | undefined = this.locales.find(
            (locale: string): boolean => locale.split(this.separator)[0] === query.locale,
        );

        if (selectedByLanguage !== undefined) {
            return this.createLocaleObject(selectedByLanguage, query.locale);
        }

        return this.createLocaleObject(this.defaultLocale, query.locale);
    }

    private createSeparator (): string {
        const regex: RegExp = /^[a-zA-Z]{2}(?<separator>[-_])[a-zA-Z]{2}$/;
        const separator: string | undefined = this.defaultLocale.match(regex)?.groups?.separator;

        return separator ?? '-';
    }

    private createLocaleObject (locale: string, original: string): LocaleObject {
        return {
            locale,
            language: locale.split(this.separator)[0],
            territory: locale.split(this.separator)[1],
            original,
        };
    }
}
