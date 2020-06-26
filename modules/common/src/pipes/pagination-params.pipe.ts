import {Injectable, PipeTransform} from '@nestjs/common';
import {PaginationParams} from './interfaces';

@Injectable()
export class PaginationParamsPipe implements PipeTransform<any, PaginationParams> {
    constructor (private defaultSize: number = 10) {}

    public transform (query: any): PaginationParams {
        if (!query) {
            return {
                page: 1,
                size: this.defaultSize,
            };
        }

        return {
            page: parseInt(query.page, 10) || 1,
            size: parseInt(query.size, 10) || this.defaultSize,
        };
    }
}
