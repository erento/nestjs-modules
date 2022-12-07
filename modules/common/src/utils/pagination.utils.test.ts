import {getPaginationQuery, mapToPaginationResponse} from './pagination.utils';

describe('Pagination utils', (): void => {
    describe('getPaginationQuery', (): void => {
        test('returns empty without params', (): void => {
            expect(getPaginationQuery())
                .toEqual({});
        });

        test('sets offset and limit properly', (): void => {
            expect(getPaginationQuery({page: 0, size: 10}))
                .toEqual({offset: 0, limit: 10});
            expect(getPaginationQuery({page: 1, size: 10}))
                .toEqual({offset: 0, limit: 10});
            expect(getPaginationQuery({page: 2, size: 10}))
                .toEqual({offset: 10, limit: 10});
            expect(getPaginationQuery({page: 2, size: 40}))
                .toEqual({offset: 40, limit: 40});
            expect(getPaginationQuery({page: 2, size: 40}))
                .toEqual({offset: 40, limit: 40});
        });
    });

    describe('mapToPaginatedResponse', (): void => {
        test('maps to paginated response', (): void => {
            expect(mapToPaginationResponse({page: 1, size: 10}, 20, [1, 2, 3]))
                .toMatchSnapshot();
            expect(mapToPaginationResponse({page: 1, size: 10}, 13, [1]))
                .toMatchSnapshot();
            expect(mapToPaginationResponse({page: 5, size: 3}, 50, [1, 2, 3, 4, 5]))
                .toMatchSnapshot();
        });
    });
});
