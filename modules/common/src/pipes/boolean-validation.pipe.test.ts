import {BooleanValidationPipe} from './boolean-validation.pipe';

describe('BooleanValidationPipe', (): void => {
    let pipe: BooleanValidationPipe;

    beforeEach((): void => {
        pipe = new BooleanValidationPipe();
    });

    test.each<[string | undefined, boolean | undefined]>([
        ['true', true],
        ['false', false],
        [undefined, false],
        ['', false],
        ['asdf', false],
    ])(
        'should transform string to value properly',
        (input: string | undefined, expected: boolean | undefined): void => {
            expect(pipe.transform(input)).toEqual(expected);
        },
    );
});
