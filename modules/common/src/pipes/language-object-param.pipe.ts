import {Injectable, PipeTransform} from '@nestjs/common';
import {ISO_LANGUAGE_CODES} from './constants/iso-language-codes.const';
import {LanguageObject} from './interfaces';

const DEFAULT_ISO_CODE: string = 'de-DE';

@Injectable()
export class LanguageObjectParamPipe implements PipeTransform<Record<string, any>, LanguageObject> {
    public transform (query: Record<string, any>): LanguageObject {
        if (!query?.lang) {
            return this.createLanguageObject(DEFAULT_ISO_CODE, '');
        }

        const selectedByIsoCode: string | undefined = ISO_LANGUAGE_CODES.find(
            (isoCode: string): boolean => isoCode === query.lang,
        );

        if (selectedByIsoCode !== undefined) {
            return this.createLanguageObject(selectedByIsoCode, query.lang);
        }

        const selectedByLocale: string | undefined = ISO_LANGUAGE_CODES.find(
            (isoCode: string): boolean => isoCode.split('-')[0] === query.lang,
        );

        if (selectedByLocale !== undefined) {
            return this.createLanguageObject(selectedByLocale, query.lang);
        }

        return this.createLanguageObject(DEFAULT_ISO_CODE, query.lang);
    }

    private createLanguageObject (isoCode: string, original: string): LanguageObject {
        return <LanguageObject> {
            full: isoCode,
            locale: isoCode.split('-')[0],
            culture: isoCode.split('-')[1],
            original,
        };
    }
}
