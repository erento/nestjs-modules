import {CAMPANDA_DEFAULT_LOCALE, CAMPANDA_LOCALE_ARRAY, ERENTO_DEFAULT_LOCALE, ERENTO_LOCALE_ARRAY} from './constants';
import {LocaleParamPipe} from './locale-param.pipe';

describe('LocaleParamPipe', (): void => {
    test.each<[any]>([
        [undefined],
        [null],
        [{}],
        [{locale: 'de-DE'}],
        [{locale: 'de-CH'}],
        [{locale: 'de-AT'}],
        [{locale: 'en-GB'}],
        [{locale: 'en-US'}],
        [{locale: 'de'}],
        [{locale: 'en'}],
        [{locale: 'abc'}],
        [{locale: 'en_GB'}], // fails to find it returns default
        [{locale: 'es-ES'}], // fails to find it returns default
        [{locale: 'es'}], // fails to find it returns default
    ])('should transform erento locale params properly', (input: any): void => {
        const pipe: LocaleParamPipe = new LocaleParamPipe(ERENTO_DEFAULT_LOCALE, ERENTO_LOCALE_ARRAY);
        expect(pipe.transform(input))
            .toMatchSnapshot();
    });

    test.each<[any]>([
        [undefined],
        [null],
        [{}],
        [{locale: 'de_DE'}],
        [{locale: 'de_CH'}],
        [{locale: 'de_AT'}],
        [{locale: 'en_GB'}],
        [{locale: 'en_US'}],
        [{locale: 'es_ES'}],
        [{locale: 'fr_FR'}],
        [{locale: 'it_IT'}],
        [{locale: 'de'}],
        [{locale: 'en'}],
        [{locale: 'es'}],
        [{locale: 'fr'}],
        [{locale: 'it'}],
        [{locale: 'abc'}],
        [{locale: 'en-GB'}], // fails to find it returns default
    ])('should transform campanda locale params properly', (input: any): void => {
        const pipe: LocaleParamPipe = new LocaleParamPipe(CAMPANDA_DEFAULT_LOCALE, CAMPANDA_LOCALE_ARRAY);
        expect(pipe.transform(input))
            .toMatchSnapshot();
    });

    test.each<[any]>([
        [undefined],
        [null],
        [{}],
        [{countryBasedLocale: 'de_DE'}],
        [{countryBasedLocale: 'de_CH'}],
        [{countryBasedLocale: 'de_AT'}],
        [{countryBasedLocale: 'en_GB'}],
        [{countryBasedLocale: 'en_US'}],
        [{countryBasedLocale: 'es_ES'}],
        [{countryBasedLocale: 'fr_FR'}],
        [{countryBasedLocale: 'it_IT'}],
        [{countryBasedLocale: 'de'}],
        [{countryBasedLocale: 'en'}],
        [{countryBasedLocale: 'es'}],
        [{countryBasedLocale: 'fr'}],
        [{countryBasedLocale: 'it'}],
        [{countryBasedLocale: 'abc'}],
        [{countryBasedLocale: 'en-GB'}], // fails to find it returns default
    ])('should transform campanda locale params properly for different param name', (input: any): void => {
        const pipe: LocaleParamPipe = new LocaleParamPipe(CAMPANDA_DEFAULT_LOCALE, CAMPANDA_LOCALE_ARRAY, 'countryBasedLocale');
        expect(pipe.transform(input))
            .toMatchSnapshot();
    });
});
