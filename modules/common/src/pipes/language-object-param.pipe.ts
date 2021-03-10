import {Injectable, PipeTransform} from '@nestjs/common';
import {ISO_LANGUAGE_CODES} from './constants/iso-language-codes.const';
import {LanguageObject} from './interfaces';

const GERMAN_LOCALE: string = 'de-DE';

@Injectable()
export class LanguageObjectParamPipe implements PipeTransform<Record<string, any>, LanguageObject> {
    public transform (query: Record<string, any>): LanguageObject {
        if (!query?.lang) {
            return this.createLanguageObject(GERMAN_LOCALE, '');
        }

        let selectedLocale: string | undefined = ISO_LANGUAGE_CODES.find(
            (isoCode: string): boolean => isoCode === query.lang,
        );

        if (selectedLocale !== undefined) {
            return this.createLanguageObject(selectedLocale, query.lang);
        }

        selectedLocale = ISO_LANGUAGE_CODES.find(
            (isoCode: string): boolean => isoCode.split('-')[0] === query.lang,
        );

        if (selectedLocale !== undefined) {
            return this.createLanguageObject(selectedLocale, query.lang);
        }

        return this.createLanguageObject(GERMAN_LOCALE, query.lang);
    }

    private createLanguageObject (isoCode: string, original: string = ''): LanguageObject {
        return <LanguageObject> {
            full: isoCode,
            language: isoCode.split('-')[0],
            culture: isoCode.split('-')[1],
            original,
        };
    }
}
