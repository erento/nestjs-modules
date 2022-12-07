import {OptionalIntValidationPipe} from './optional-int-validation.pipe';

describe('OptionalIntValidationPipe', (): void => {
    let pipe: OptionalIntValidationPipe;

    beforeEach((): void => {
        pipe = new OptionalIntValidationPipe();
    });

    test.each<[string | undefined, number | undefined]>([
        ['-1', -1],
        ['0', 0],
        ['1', 1],
        ['1234567890', 1234567890],
        ['1234.56789', 1234],
        [undefined, undefined],
    ])(
        'should transform string to value properly',
        (input: string | undefined, expected: number | undefined): void => {
            expect(pipe.transform(input))
                .toEqual(expected);
        },
    );
    test('should fail on empty string', (): void => {
        expect((): number | undefined => pipe.transform(''))
            .toThrowErrorMatchingSnapshot();
    });
    test('should fail on invalid string', (): void => {
        expect((): number | undefined => pipe.transform('asdf'))
            .toThrowErrorMatchingSnapshot();
    });
});
