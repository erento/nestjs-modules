import {Injectable, PipeTransform} from '@nestjs/common';
import * as moment from 'moment-timezone';

const TIMEZONE_BERLIN: string = 'Europe/Berlin';
const DATE_IN_DST: string = '2022-06-01';
const DATE_IN_NON_DST: string = '2022-01-01';

@Injectable()
export class IsoDateValidationPipe implements PipeTransform {
    public transform (value: string | undefined): moment.Moment {
        const dateString: string = decodeURIComponent(value || '');
        // this block should be cleaned after some time, it supports the old implementation for old SPA versions
        if (dateString.includes('Z')) {
            const dateIso8601: moment.Moment = moment(value, moment.ISO_8601);
            if (dateIso8601.isValid()) {
                return dateIso8601;
            }

            throw new Error(`value is not a date: '${value}'`);
        }

        const date: moment.Moment = moment.tz(dateString, TIMEZONE_BERLIN);
        if (!date.isValid()) {
            throw new Error(`value is not a date: '${value}'`);
        }

        const dateOffset: number = moment.parseZone(dateString)
            .utcOffset();
        const isInitialDateDst: boolean = date.isDST();
        const berlinOffsetToUtc: number = moment.tz(isInitialDateDst ? DATE_IN_DST : DATE_IN_NON_DST, TIMEZONE_BERLIN)
            .utcOffset();
        const calculatedOffset: number = dateOffset - berlinOffsetToUtc;

        return date.clone()
            .add(calculatedOffset, 'minutes');
    }
}
