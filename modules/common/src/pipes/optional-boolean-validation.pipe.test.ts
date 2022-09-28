import {OptionalBooleanValidationPipe} from './optional-boolean-validation.pipe';

describe('OptionalBooleanValidationPipe', (): void => {
    let pipe: OptionalBooleanValidationPipe;

    beforeEach((): void => {
        pipe = new OptionalBooleanValidationPipe();
    });

    test.each<[string | undefined, boolean | undefined]>([
        ['true', true],
        ['false', false],
        [undefined, undefined],
    ])(
        'should transform string to value properly',
        (input: string | undefined, expected: boolean | undefined): void => {
            expect(pipe.transform(input)).toEqual(expected);
        },
    );
    test('should fail on empty string', (): void => {
        expect((): boolean | undefined => pipe.transform('')).toThrowErrorMatchingSnapshot();
    });
    test('should fail on invalid string', (): void => {
        expect((): boolean | undefined => pipe.transform('asdf')).toThrowErrorMatchingSnapshot();
    });
});
