import {BooleanOrUndefinedParamsPipe} from './boolean-or-undefined-param.pipe';

describe('BooleanOrUndefinedParamsPipe', (): void => {
    let pipe: BooleanOrUndefinedParamsPipe;

    beforeEach((): void => {
        pipe = new BooleanOrUndefinedParamsPipe('online');
    });

    test.each<[any, boolean | undefined]>([
        [undefined, undefined],
        [null, undefined],
        [{online: 'true'}, true],
        [{online: 'false'}, false],
        [{online: 'abc'}, undefined],
    ])('should transform query params properly', (input: any, expected: boolean | undefined): void => {
        expect(pipe.transform(input))
            .toEqual(expected);
    });
});
