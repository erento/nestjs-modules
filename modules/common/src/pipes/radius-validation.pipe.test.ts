import {RadiusValidationPipe} from './radius-validation.pipe';

describe('RadiusValidationPipe', (): void => {
    let pipe: RadiusValidationPipe;

    beforeEach((): void => {
        pipe = new RadiusValidationPipe();
    });

    test.each<[string | undefined, number | undefined]>([
        ['0', undefined],
        [undefined, undefined],
        ['30', 30],
        ['100', 100],
        ['-1', undefined],
    ])('should transform radius value properly', (input: string | undefined, expected: number | undefined): void => {
        expect(pipe.transform(input)).toEqual(expected);
    });
});
