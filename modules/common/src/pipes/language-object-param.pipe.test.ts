import {LanguageObject} from './interfaces';
import {LanguageObjectParamPipe} from './language-object-param.pipe';

describe('LanguageObjectParamPipe', (): void => {
    let pipe: LanguageObjectParamPipe;

    beforeEach((): void => {
        pipe = new LanguageObjectParamPipe();
    });

    test.each<[any, string]>([
        [undefined, 'de-DE'],
        [null, 'de-DE'],
        [{}, 'de-DE'],
        [{lang: 'de-DE'}, 'de-DE'],
        [{lang: 'de-CH'}, 'de-CH'],
        [{lang: 'de-AT'}, 'de-AT'],
        [{lang: 'en-GB'}, 'en-GB'],
        [{lang: 'en-US'}, 'en-US'],
        [{lang: 'es-ES'}, 'es-ES'],
        [{lang: 'fr-FR'}, 'fr-FR'],
        [{lang: 'it-IT'}, 'it-IT'],
        [{lang: 'de'}, 'de-DE'],
        [{lang: 'en'}, 'en-GB'],
        [{lang: 'es'}, 'es-ES'],
        [{lang: 'fr'}, 'fr-FR'],
        [{lang: 'it'}, 'it-IT'],
        [{lang: 'abc'}, 'de-DE'],
    ])('should transform query params properly', (input: any, locale: string): void => {
        const expected: LanguageObject = {
            full: locale,
            locale: locale.split('-')[0],
            culture: locale.split('-')[1],
            original: input?.lang !== undefined ? input.lang : '',
        };
        expect(pipe.transform(input)).toEqual(expected);
    });
});
