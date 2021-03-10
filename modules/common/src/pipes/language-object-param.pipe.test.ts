import {LanguageObjectParamPipe} from './language-object-param.pipe';

describe('LanguageObjectParamPipe', (): void => {
    let pipe: LanguageObjectParamPipe;

    beforeEach((): void => {
        pipe = new LanguageObjectParamPipe();
    });

    test.each<[any]>([
        [undefined],
        [null],
        [{}],
        [{lang: 'de-DE'}],
        [{lang: 'de-CH'}],
        [{lang: 'de-AT'}],
        [{lang: 'en-GB'}],
        [{lang: 'en-US'}],
        [{lang: 'es-ES'}],
        [{lang: 'fr-FR'}],
        [{lang: 'it-IT'}],
        [{lang: 'de'}],
        [{lang: 'en'}],
        [{lang: 'es'}],
        [{lang: 'fr'}],
        [{lang: 'it'}],
        [{lang: 'abc'}],
    ])('should transform query params properly', (input: any): void => {
        expect(pipe.transform(input)).toMatchSnapshot();
    });
});
