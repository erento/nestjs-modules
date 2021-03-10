import {AUSTRIAN_LANG_OBJECT, BRITISH_LANG_OBJECT, GERMAN_LANG_OBJECT, SWISS_LANG_OBJECT, US_LANG_OBJECT} from './constants/language-object.const';
import {LanguageObject} from './interfaces';
import {LanguageObjectParamPipe} from './language-object-param.pipe';

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
        [{lang: 'en-GB'}, BRITISH_LANG_OBJECT],
        [{lang: 'de-CH'}, SWISS_LANG_OBJECT],
        [{lang: 'de-AT'}, AUSTRIAN_LANG_OBJECT],
        [{lang: 'de'}, GERMAN_LANG_OBJECT],
        [{lang: 'en'}, BRITISH_LANG_OBJECT],
        [{lang: 'CH'}, SWISS_LANG_OBJECT],
        [{lang: 'US'}, US_LANG_OBJECT],
        [{lang: 'abc'}, GERMAN_LANG_OBJECT],
    ])('should transform query params properly', (input: any, expected: LanguageObject): void => {
        expect(pipe.transform(input)).toEqual(expect.objectContaining(expected));
    });
});
