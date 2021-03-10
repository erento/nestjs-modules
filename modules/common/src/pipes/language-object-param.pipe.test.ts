import {LANGUAGES} from './constants/language-object.const';
import {LanguageObject} from './interfaces';
import {LanguageObjectParamPipe} from './language-object-param.pipe';

const GERMAN_LANG_OBJECT: LanguageObject = LANGUAGES[0];
const SWISS_LANG_OBJECT: LanguageObject = LANGUAGES[1];
const AUSTRIAN_LANG_OBJECT: LanguageObject = LANGUAGES[2];
const BRITISH_LANG_OBJECT: LanguageObject = LANGUAGES[3];
const US_LANG_OBJECT: LanguageObject = LANGUAGES[4];
const FRENCH_LANG_OBJECT: LanguageObject = LANGUAGES[5];
const SPANISH_LANG_OBJECT: LanguageObject = LANGUAGES[6];
const ITALIAN_LANG_OBJECT: LanguageObject = LANGUAGES[7];

describe('LanguageObjectParamPipe', (): void => {
    let pipe: LanguageObjectParamPipe;

    beforeEach((): void => {
        pipe = new LanguageObjectParamPipe();
    });

    test.each<[any, LanguageObject]>([
        [undefined, GERMAN_LANG_OBJECT],
        [null, GERMAN_LANG_OBJECT],
        [{}, GERMAN_LANG_OBJECT],
        [{lang: 'de-DE'}, GERMAN_LANG_OBJECT],
        [{lang: 'de-CH'}, SWISS_LANG_OBJECT],
        [{lang: 'de-AT'}, AUSTRIAN_LANG_OBJECT],
        [{lang: 'en-GB'}, BRITISH_LANG_OBJECT],
        [{lang: 'en-US'}, US_LANG_OBJECT],
        [{lang: 'es-ES'}, SPANISH_LANG_OBJECT],
        [{lang: 'fr-FR'}, FRENCH_LANG_OBJECT],
        [{lang: 'it-IT'}, ITALIAN_LANG_OBJECT],
        [{lang: 'de'}, GERMAN_LANG_OBJECT],
        [{lang: 'en'}, BRITISH_LANG_OBJECT],
        [{lang: 'es'}, SPANISH_LANG_OBJECT],
        [{lang: 'fr'}, FRENCH_LANG_OBJECT],
        [{lang: 'it'}, ITALIAN_LANG_OBJECT],
        [{lang: 'abc'}, GERMAN_LANG_OBJECT],
    ])('should transform query params properly', (input: any, languageObject: LanguageObject): void => {
        const expected: LanguageObject = {
            ...languageObject,
            original: input?.lang !== undefined ? input.lang : '',
        };
        expect(pipe.transform(input)).toEqual(expected);
    });
});
