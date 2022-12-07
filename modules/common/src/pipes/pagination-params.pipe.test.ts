import {PaginationParams} from './interfaces';
import {PaginationParamsPipe} from './pagination-params.pipe';

const DEFAULT_SIZE: number = 10;

describe('PaginationParamsPipe', (): void => {
    let pipe: PaginationParamsPipe;

    beforeEach((): void => {
        pipe = new PaginationParamsPipe(DEFAULT_SIZE);
    });

    test.each<[any, PaginationParams]>([
        [{page: '0'}, {page: 1, size: DEFAULT_SIZE}],
        [{page: '1'}, {page: 1, size: DEFAULT_SIZE}],
        [{page: 1}, {page: 1, size: DEFAULT_SIZE}],
        [{page: 0}, {page: 1, size: DEFAULT_SIZE}],
        [{page: '2', size: '10'}, {page: 2, size: 10}],
        [{page: 2, size: 10}, {page: 2, size: 10}],
        [{page: 3, size: 0}, {page: 3, size: DEFAULT_SIZE}],
        [{page: 4, size: 1000}, {page: 4, size: 1000}],
        [{page: '-1', size: '-5'}, {page: 1, size: DEFAULT_SIZE}],
        [{page: -1, size: -5}, {page: 1, size: DEFAULT_SIZE}],
    ])('should transform query params properly', (input: any, expected: PaginationParams): void => {
        expect(pipe.transform(input))
            .toEqual(expected);
    });
});
