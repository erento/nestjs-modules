import {EnvironmentType} from '../environments/interfaces';
import {
    arrayDifference,
    arrayIntersection,
    batchArray,
    cleanNullValues,
    createBuffer,
    deepCopyObj,
    fillArrayWithIndices,
    getDateStringOrUndefined,
    getPropertyOrFallback,
    getPropertyOrFallbackOrUndefined,
    getPropertyOrUndefined,
    getTrueOrUndefined,
    isUuid,
    oneLine,
    parseDateOrUndefined,
    replaceEmptyStringValuesWithNull,
    requiredEnvProdVariable,
    requiredEnvVariable,
    slugifyText,
    waitForMs,
} from './utils';
import DoneCallback = jest.DoneCallback;

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('utils', (): void => {
    describe('buffer', (): void => {
        test('create', (): void => {
            const base64: string = 'YWhveQ==';
            const buffer: Buffer | undefined = createBuffer(base64);

            expect(buffer)
                .toBeInstanceOf(Buffer);
            expect(buffer.toString())
                .toMatchSnapshot();
        });

        test('create with wrong data', (): void => {
            expect(createBuffer('not a base 64'))
                .toBeInstanceOf(Buffer);
            expect((): Buffer => createBuffer(<any> null))
                .toThrowErrorMatchingSnapshot();
            expect((): Buffer => createBuffer(<any> undefined))
                .toThrowErrorMatchingSnapshot();
        });
    });

    describe('array', (): void => {
        test('difference', (): void => {
            expect(arrayDifference(['a', 'b'], ['b', 'c']))
                .toMatchSnapshot();
            expect(arrayDifference(['a', 'b'], []))
                .toMatchSnapshot();
            expect(arrayDifference(['a', 'b'], ['a', 'b']))
                .toMatchSnapshot();
        });

        test('intersection', (): void => {
            expect(arrayIntersection(['a', 'b'], ['b', 'c']))
                .toMatchSnapshot();
            expect(arrayIntersection(['a', 'b'], ['c', 'd']))
                .toMatchSnapshot();
            expect(arrayIntersection([{a: 'a'}], [{a: 'a'}]))
                .toMatchSnapshot();

            const value: any = {b: 'b'};
            expect(arrayIntersection(['a', value, 'b'], [value, 'b']))
                .toMatchSnapshot();
        });

        test('intersection is unique', (): void => {
            expect(arrayIntersection(['a', 12], ['c', 12, 'd', 12]))
                .toMatchSnapshot();
        });
    });

    describe('object', (): void => {
        test('copy', (): void => {
            const objA: any = {a: {a: 1}, b: {b: 1}, c: 1};
            const copy: any = deepCopyObj(objA);
            expect(copy)
                .toMatchSnapshot();
            objA.a.a = 'changed value';
            expect(copy)
                .toMatchSnapshot();
        });

        test('copy not an object', (): void => {
            expect(deepCopyObj(undefined))
                .toMatchSnapshot();
            expect(deepCopyObj(null))
                .toMatchSnapshot();
            expect(deepCopyObj(NaN))
                .toMatchSnapshot();
            expect(deepCopyObj(''))
                .toMatchSnapshot();
            expect(deepCopyObj('some string'))
                .toMatchSnapshot();
            expect(deepCopyObj(1))
                .toMatchSnapshot();
        });
    });

    describe('undefined or value', (): void => {
        test('get any value or undefined', (): void => {
            expect(getPropertyOrUndefined('some test'))
                .toMatchSnapshot();
            expect(getPropertyOrUndefined({some: 'thing', other: 'thing'}))
                .toMatchSnapshot();
            expect(getPropertyOrUndefined(null))
                .toMatchSnapshot();
            expect(getPropertyOrUndefined(undefined))
                .toMatchSnapshot();
        });

        test('get date string or undefined', (): void => {
            const testEpoch: number = 1539952471893;
            expect(getDateStringOrUndefined('some test'))
                .toMatchSnapshot();
            expect(getDateStringOrUndefined(null))
                .toEqual(undefined);
            expect(getDateStringOrUndefined(new Date(testEpoch)))
                .toMatchSnapshot();
            // special case for dummy dates set as default if there is no timestamp existing
            expect(getDateStringOrUndefined(new Date(0)))
                .toMatchSnapshot();
        });

        test('get true or undefined', (): void => {
            expect(getTrueOrUndefined(false))
                .toMatchSnapshot();
            expect(getTrueOrUndefined(true))
                .toMatchSnapshot();
        });

        test('parse date or undefined', (): void => {
            expect(parseDateOrUndefined('xx-x-x-x'))
                .toMatchSnapshot();
            expect(parseDateOrUndefined(undefined))
                .toMatchSnapshot();
            expect(parseDateOrUndefined('1977-10-11'))
                .toMatchSnapshot();
        });
    });

    test('isUuid', (): void => {
        expect(isUuid('11111111-2222-3333-4444-555555555555'))
            .toBe(true);
        expect(isUuid(''))
            .toBe(false);
        expect(isUuid(null))
            .toBe(false);
        expect(isUuid(undefined))
            .toBe(false);
        expect(isUuid('123456789'))
            .toBe(false);
    });

    test('cleanNullValues', (): void => {
        expect(cleanNullValues({test: null}))
            .toMatchSnapshot();
        expect(cleanNullValues({test: undefined}))
            .toMatchSnapshot();
        expect(cleanNullValues({test: 123, property: null}))
            .toMatchSnapshot();
        expect(cleanNullValues(null))
            .toMatchSnapshot();
        expect(cleanNullValues(undefined))
            .toMatchSnapshot();
        expect(cleanNullValues({test: null, another: null}))
            .toMatchSnapshot();
    });

    test('replaceEmptyStringValuesWithNull', (): void => {
        expect(replaceEmptyStringValuesWithNull(null))
            .toMatchSnapshot();
        expect(replaceEmptyStringValuesWithNull({test: '', property: undefined}))
            .toMatchSnapshot();
        expect(replaceEmptyStringValuesWithNull({test: '', property: null}))
            .toMatchSnapshot();
        expect(replaceEmptyStringValuesWithNull({test: '', property: null, element: 'is-good'}))
            .toMatchSnapshot();
        expect(replaceEmptyStringValuesWithNull({test: 1, property: null, element: 'is-good'}))
            .toMatchSnapshot();
    });

    describe('property or fallback or undefined', (): void => {
        test('return truthy properties except of empty string', (): void => {
            expect(getPropertyOrFallbackOrUndefined('some'))
                .toEqual('some');
            expect(getPropertyOrFallbackOrUndefined(true))
                .toBe(true);
        });

        test('return undefined on falsy properties except of false', (): void => {
            expect(getPropertyOrFallbackOrUndefined(undefined))
                .toBeUndefined();
            expect(getPropertyOrFallbackOrUndefined(null))
                .toBeUndefined();
        });

        test('return undefined on empty string', (): void => {
            expect(getPropertyOrFallbackOrUndefined(''))
                .toBeUndefined();
        });

        test('return false on false', (): void => {
            expect(getPropertyOrFallbackOrUndefined(false))
                .toBe(false);
        });

        test('return fallback if it\'s given and the property is undefined', (): void => {
            expect(getPropertyOrFallbackOrUndefined(undefined, 'some'))
                .toBe('some');
        });

        test('return undefined if fallback is falsy', (): void => {
            expect(getPropertyOrFallbackOrUndefined(undefined, undefined))
                .toBeUndefined();
            expect(getPropertyOrFallbackOrUndefined(undefined, null))
                .toBeUndefined();
        });

        test('return undefined if fallback is empty string', (): void => {
            expect(getPropertyOrFallbackOrUndefined(undefined, ''))
                .toBeUndefined();
        });
    });

    describe('property or fallback', (): void => {
        test('return value if it is truthy except of empty string', (): void => {
            expect(getPropertyOrFallback('some', 'thing'))
                .toBe('some');
            expect(getPropertyOrFallback(true, false))
                .toBe(true);
        });

        test('return fallback on falsy properties except of false', (): void => {
            expect(getPropertyOrFallback(undefined, 'thing'))
                .toBe('thing');
            expect(getPropertyOrFallback(null, 'thing'))
                .toBe('thing');
        });

        test('return fallback on empty string', (): void => {
            expect(getPropertyOrFallback('', 'thing'))
                .toBe('thing');
        });

        test('return value on false', (): void => {
            expect(getPropertyOrFallback(false, true))
                .toBe(false);
        });
    });

    describe('fillArrayWithIndices', (): void => {
        test('should return an array with indices providing a length', (): void => {
            expect(fillArrayWithIndices(5))
                .toMatchSnapshot();
        });

        test('should return an empty array on zero length', (): void => {
            expect(fillArrayWithIndices(0))
                .toMatchSnapshot();
        });

        test('should return an empty array on undefined length', (): void => {
            expect(fillArrayWithIndices())
                .toMatchSnapshot();
        });
    });

    describe('batchArray', (): void => {
        test('empty array', (): void => {
            expect(batchArray<string>([], 2))
                .toEqual([]);
        });

        test('longer array', (): void => {
            expect(batchArray<string>(['a', 'b', 'c', 'd', 'e'], 2))
                .toEqual([
                    ['a', 'b'],
                    ['c', 'd'],
                    ['e'],
                ]);
        });
    });

    describe('requiredEnvVariable', (): void => {
        test('it returns process.env variable, if it exists', (): void => {
            // eslint-disable-next-line no-underscore-dangle
            process.env.__TESTING_PROPERTY = 'some-value';

            expect(requiredEnvVariable('__TESTING_PROPERTY'))
                .toBe('some-value');
        });

        test('it throws for missing environment variables', (): void => {
            process.env.NODE_ENV = EnvironmentType.BETA;
            expect((): string => requiredEnvVariable('__NOT_EXISTING'))
                .toThrowError('Missing environment variable "__NOT_EXISTING"!');
            process.env.NODE_ENV = EnvironmentType.TEST;
        });
    });

    describe('requiredEnvProdVariable', (): void => {
        test('it returns process.env variable, if environment is production', (): void => {
            // eslint-disable-next-line no-underscore-dangle
            process.env.__TESTING_PROPERTY = 'some-value';

            expect(requiredEnvProdVariable('__TESTING_PROPERTY', EnvironmentType.PROD))
                .toBe('some-value');
        });

        test('it returns null, if environment is not production', (): void => {
            expect(requiredEnvProdVariable('__NOT_EXISTING', EnvironmentType.BETA))
                .toBe(undefined);
        });

        test('it throws for missing environment variables on production', (): void => {
            process.env.NODE_ENV = EnvironmentType.PROD;
            expect((): string => requiredEnvVariable('__NOT_EXISTING'))
                .toThrowError('Missing environment variable "__NOT_EXISTING"!');
            process.env.NODE_ENV = EnvironmentType.TEST;
        });
    });

    describe('oneLine', (): void => {
        test('it converts multiline strings to one line and trims them', (): void => {
            expect(oneLine(``))
                .toEqual('');
            expect(oneLine(`      Hello,\n            World           `))
                .toEqual('Hello, World');
            expect(oneLine(`\nSELECT *\nFROM "user"\n WHERE field = 'value';`))
                .toEqual('SELECT * FROM "user" WHERE field = \'value\';');
            expect(oneLine(`
                SELECT *
                FROM "user"
                WHERE field = 'value'
                    AND other_field = 'other_value        with_spaces'
                LIMIT 10;
            `))
                .toEqual('SELECT * FROM "user" WHERE field = \'value\' AND other_field = \'other_value        with_spaces\' LIMIT 10;');
            expect(oneLine(`UPDATE "user" SET field='multi word value with any amount  of    spaces'`))
                .toEqual(`UPDATE "user" SET field='multi word value with any amount  of    spaces'`);
            expect(oneLine(`UPDATE "user" SET\n field='multi word value with any amount  of    spaces'`))
                .toEqual(`UPDATE "user" SET field='multi word value with any amount  of    spaces'`);
        });
    });

    describe('waitForMs', (): void => {
        test('it waits using setTimeout', (done: DoneCallback): void => {
            const callback: jest.Mock = jest.fn();
            waitForMs(100)
                .then((): void => {
                    done();
                });

            expect(setTimeout)
                .toHaveBeenCalledWith(expect.any(Function), 100);
            expect(callback).not.toHaveBeenCalled();

            jest.runAllTimers();
        });
    });

    describe('slugifyText', (): void => {
        test('should replace umlaut characters with normalized counterparts', (): void => {
            expect(slugifyText('ä', 'de'))
                .toEqual('ae');
            expect(slugifyText('ö', 'de'))
                .toEqual('oe');
            expect(slugifyText('ü', 'de'))
                .toEqual('ue');
            expect(slugifyText('ß', 'de'))
                .toEqual('ss');
            expect(slugifyText('é', 'de'))
                .toEqual('e');

            expect(slugifyText('märz', 'de'))
                .toEqual('maerz');
            expect(slugifyText('Köln', 'de'))
                .toEqual('koeln');
            expect(slugifyText('München', 'de'))
                .toEqual('muenchen');
            expect(slugifyText('Nußloch', 'de'))
                .toEqual('nussloch');
            expect(slugifyText('Créteil', 'de'))
                .toEqual('creteil');
        });

        test('should ignore capitalization', (): void => {
            expect(slugifyText('Köln', 'de'))
                .toEqual(slugifyText('köln', 'de'));
            expect(slugifyText('München', 'de'))
                .toEqual(slugifyText('münchen', 'de'));
            expect(slugifyText('ÜÄÖ', 'de'))
                .toEqual(slugifyText('üäö', 'de'));
        });

        test('should normalize city name', (): void => {
            expect(slugifyText('München  ', 'de'))
                .toEqual('muenchen');
        });

        test('should normalize city name, remove hyphens and spaces', (): void => {
            expect(slugifyText(' - köln -- ', 'de'))
                .toEqual('koeln');
        });

        test('should normalize city name, remove hyphens, slashes, underscores and spaces', (): void => {
            expect(slugifyText(' bad -  / _ ReichenHall  ', 'de'))
                .toEqual('bad-reichenhall');
        });

        test('should normalize city name that includes brackets', (): void => {
            expect(slugifyText(' bad -  / _ (ReichenHall)  ', 'de'))
                .toEqual('bad-reichenhall');
        });

        test('should slugify city name', (): void => {
            expect(slugifyText('München', 'de'))
                .toEqual('muenchen');
            expect(slugifyText('Bad ReichenHall', 'de'))
                .toEqual('bad-reichenhall');
            expect(slugifyText('Neustadt an der Weinstraße', 'de'))
                .toEqual('neustadt-an-der-weinstrasse');
        });

        test('should throw on slugify undefined', (): void => {
            expect((): string => slugifyText(<any> undefined, 'de'))
                .toThrow(new Error('slugify: string argument expected'));
        });
    });
});
