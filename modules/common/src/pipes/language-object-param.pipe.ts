import {Injectable, PipeTransform} from '@nestjs/common';
import {LANGUAGES} from './constants/language-object.const';
import {LanguageObject} from './interfaces';

const GERMAN_LANG_OBJECT: LanguageObject = LANGUAGES[0];

@Injectable()
export class LanguageObjectParamPipe implements PipeTransform<Record<string, any>, LanguageObject> {
    public transform (query: Record<string, any>): LanguageObject {
        if (!query?.lang) {
            return GERMAN_LANG_OBJECT;
        }

        let selectedLanguage: LanguageObject | undefined = LANGUAGES.find(
            (languageObject: LanguageObject): boolean => languageObject.full === query.lang,
        );

        if (selectedLanguage !== undefined) {
            return {
                ...selectedLanguage,
                original: query.lang,
            };
        }

        selectedLanguage = LANGUAGES.find(
            (languageObject: LanguageObject): boolean => languageObject.locale === query.lang,
        );

        if (selectedLanguage !== undefined) {
            return {
                ...selectedLanguage,
                original: query.lang,
            };
        }

        return {
            ...GERMAN_LANG_OBJECT,
            original: query.lang,
        };
    }
}
