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

        const page: number = parseInt(query.page, 10) || 1;
        const size: number = parseInt(query.size, 10) || this.defaultSize;

        return {
            page: page > 0 ? page : 1,
            size: size > 0 ? size : this.defaultSize,
        };
    }
}
