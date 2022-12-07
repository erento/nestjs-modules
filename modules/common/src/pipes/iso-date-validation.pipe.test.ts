import * as moment from 'moment-timezone';
import {IsoDateValidationPipe} from './iso-date-validation.pipe';

describe('IsoDateValidationPipe', (): void => {
    let pipe: IsoDateValidationPipe;

    beforeEach((): void => {
        pipe = new IsoDateValidationPipe();
    });

    test.each<[string | undefined, moment.Moment]>([
        ['2021-10-18T22:00:00.000Z', moment('2021-10-18T22:00:00.000Z')],
    ])(
        'should transform date string value properly',
        (input: string | undefined, expected: moment.Moment): void => {
            expect(pipe.transform(input))
                .toEqual(expected);
        },
    );

    test.each<[string | undefined, Error]>([
        ['some-bad-string', new Error('value is not a date: \'some-bad-string\'')],
        [undefined, new Error('value is not a date: \'undefined\'')],
    ])(
        'should throw on bad date string value',
        (input: string | undefined, error: Error): void => {
            expect((): moment.Moment => pipe.transform(input))
                .toThrow(error);
        },
    );

    test('Encoded value has to be properly decoded', (): void => {
        expect(pipe.transform('2022-02-08T00%3A00%3A00.000%2B00%3A00')
            ?.format())
            .toEqual('2022-02-08T00:00:00+01:00');
    });

    describe('Move time with offset to Europe/Berlin timezone', (): void => {
        test('UTC - February', (): void => {
            expect(pipe.transform('2022-02-08T00:00:00.000+00:00')
                ?.format())
                .toEqual('2022-02-08T00:00:00+01:00');
        });

        test('UTC - April', (): void => {
            expect(pipe.transform('2022-04-06T00:00:00.000+00:00')
                ?.format())
                .toEqual('2022-04-06T00:00:00+02:00');
        });

        test('CET - February', (): void => {
            expect(pipe.transform('2022-02-08T00:00:00.000+01:00')
                ?.format())
                .toEqual('2022-02-08T00:00:00+01:00');
        });

        test('CEST - April', (): void => {
            expect(pipe.transform('2022-04-05T00:00:00.000+02:00')
                ?.format())
                .toEqual('2022-04-05T00:00:00+02:00');
        });
    });
});
