import {CAMPANDA_DEFAULT_LOCALE, CAMPANDA_LOCALE_ARRAY, ERENTO_DEFAULT_LOCALE, ERENTO_LOCALE_ARRAY} from './constants';
import {LocaleParamPipe} from './locale-param.pipe';

describe('LocaleParamPipe', (): void => {
    test.each<[any]>([
        [undefined],
        [null],
        [{}],
        [{lang: 'de-DE'}],
        [{lang: 'de-CH'}],
        [{lang: 'de-AT'}],
        [{lang: 'en-GB'}],
        [{lang: 'en-US'}],
        [{lang: 'de'}],
        [{lang: 'en'}],
        [{lang: 'abc'}],
        [{lang: 'en_GB'}], // fails to find it returns default
        [{lang: 'es-ES'}], // fails to find it returns default
        [{lang: 'es'}], // fails to find it returns default
    ])('should transform erento locale params properly', (input: any): void => {
        const pipe: LocaleParamPipe = new LocaleParamPipe(ERENTO_LOCALE_ARRAY, ERENTO_DEFAULT_LOCALE);
        expect(pipe.transform(input)).toMatchSnapshot();
    });

    test.each<[any]>([
        [undefined],
        [null],
        [{}],
        [{lang: 'de_DE'}],
        [{lang: 'de_CH'}],
        [{lang: 'de_AT'}],
        [{lang: 'en_GB'}],
        [{lang: 'en_US'}],
        [{lang: 'es_ES'}],
        [{lang: 'fr_FR'}],
        [{lang: 'it_IT'}],
        [{lang: 'de'}],
        [{lang: 'en'}],
        [{lang: 'es'}],
        [{lang: 'fr'}],
        [{lang: 'it'}],
        [{lang: 'abc'}],
        [{lang: 'en-GB'}], // fails to find it returns default
    ])('should transform campanda locale params properly', (input: any): void => {
        const pipe: LocaleParamPipe = new LocaleParamPipe(CAMPANDA_LOCALE_ARRAY, CAMPANDA_DEFAULT_LOCALE);
        expect(pipe.transform(input)).toMatchSnapshot();
    });
});
