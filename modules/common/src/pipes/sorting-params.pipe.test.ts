import {SortingParams, SortingParamsPipe} from './sorting-params.pipe';

describe('SortingParamsPipe', (): void => {
    let pipe: SortingParamsPipe;

    beforeEach((): void => {
        pipe = new SortingParamsPipe();
    });

    test.each<[any, SortingParams]>([
        [undefined, {sort: undefined, direction: <any> undefined}],
        [null, {sort: undefined, direction: <any> undefined}],
        [{sort: undefined}, {sort: undefined, direction: <any> undefined}],
        [{sort: null}, {sort: undefined, direction: <any> undefined}],
        [{sort: 'Id,ASC'}, {sort: 'Id', direction: 'asc'}],
        [{sort: 'Id,DESC'}, {sort: 'Id', direction: 'desc'}],
        [{sort: 'Id,abc'}, {sort: 'Id', direction: <any> undefined}],
        [{sort: 'Id,asc'}, {sort: 'Id', direction: 'asc'}],
        [{sort: 'Id,desc'}, {sort: 'Id', direction: 'desc'}],
        [{sort: 'Id,aSC'}, {sort: 'Id', direction: 'asc'}],
        [{sort: 'Id,dESC'}, {sort: 'Id', direction: 'desc'}],
        [{sort: 'Created,asc'}, {sort: 'Created', direction: 'asc'}],
        [{sort: 'Created,desc'}, {sort: 'Created', direction: 'desc'}],
    ])('should transform query params properly', (input: any, expected: SortingParams): void => {
        expect(pipe.transform(input)).toEqual(expected);
    });
});
