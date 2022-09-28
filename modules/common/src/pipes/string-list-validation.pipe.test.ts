import {StringListValidationPipe} from './string-list-validation.pipe';

describe('StringListValidationPipe', (): void => {
    let pipe: StringListValidationPipe;

    beforeEach((): void => {
        pipe = new StringListValidationPipe();
    });

    test.each<[string | undefined, string[]]>([
        ['something', ['something']],
        ['something,', ['something']],
        [',something', ['something']],
        ['something,something else', ['something', 'something else']],
        [',,,,something,,,,something else,,,', ['something', 'something else']],
        ['', []],
        [',,,,', []],
        [undefined, []],
    ])(
        'should transform string to value properly',
        (input: string | undefined, expected: string[]): void => {
            expect(pipe.transform(input)).toEqual(expected);
        },
    );
});
