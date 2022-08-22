import {Injectable, PipeTransform} from '@nestjs/common';

export enum SortingDirectionValue {
    ASC = 'asc',
    DESC = 'desc',
}
export type SortingDirection = SortingDirectionValue.ASC | SortingDirectionValue.DESC;

export interface SortingParams<T = string> {
    sort?: T;
    direction?: SortingDirection | undefined;
}

@Injectable()
export class SortingParamsPipe implements PipeTransform<{[name: string]: any}, SortingParams> {
    public transform (query: {[name: string]: any}): SortingParams {
        if (!query || (query && !query.sort)) {
            return {};
        }

        const sorting: [string, SortingDirection] = query.sort.split(',');
        if (sorting.length === 2) {
            let direction: SortingDirection | undefined = <SortingDirection> sorting[1].toLowerCase();
            direction = direction === SortingDirectionValue.ASC || direction === SortingDirectionValue.DESC ?
                direction :
                undefined;

            return {
                sort: sorting[0],
                direction,
            };
        }

        return {};
    }
}
