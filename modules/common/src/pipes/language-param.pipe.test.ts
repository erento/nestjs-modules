import {LanguageParamPipe} from './language-param.pipe';

describe('LanguageParamPipe', (): void => {
    let pipe: LanguageParamPipe;

    beforeEach((): void => {
        pipe = new LanguageParamPipe();
    });

    test.each<[any, string]>([
        [undefined, 'de-DE'],
        [null, 'de-DE'],
        [{}, 'de-DE'],
        [{lang: 'de-DE'}, 'de-DE'],
        [{lang: 'en-GB'}, 'en-GB'],
        [{lang: 'de-CH'}, 'de-CH'],
        [{lang: 'de-AT'}, 'de-AT'],
        [{lang: 'abc'}, 'de-DE'],
    ])('should transform query params properly', (input: any, expected: string): void => {
        expect(pipe.transform(input)).toEqual(expected);
    });
});
