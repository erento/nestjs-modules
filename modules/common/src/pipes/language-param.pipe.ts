import {Injectable, PipeTransform} from '@nestjs/common';

const GERMAN_LANG_ISO_CODE: string = 'de-DE';
const isoLanguages: string[] = [
    'de-DE',
    'de-CH',
    'de-AT',
    'en-GB',
    'en-US',
];

@Injectable()
export class LanguageParamPipe implements PipeTransform<{[name: string]: any}, string> {
    public transform (query: {[name: string]: any}): string {
        if (!query) {
            return GERMAN_LANG_ISO_CODE;
        }

        return isoLanguages.includes(query.lang) ? query.lang : GERMAN_LANG_ISO_CODE;
    }
}
