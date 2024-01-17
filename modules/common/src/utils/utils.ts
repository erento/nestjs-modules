import slugify from 'slugify';
import {NON_PRODUCTION_NULL_ENVIRONMENT_KEYS} from '../constants';
import {Environments} from '../environments/environments';
import {EnvironmentType} from '../environments/interfaces';
import {UtilsError} from './errors/utils.error';

interface ES7Array extends Array<any> {
    includes (value: any): boolean;
}

export function createBuffer (body: string, encoding: BufferEncoding = 'base64'): Buffer {
    try {
        return Buffer.from(body, encoding);
    } catch {
        throw new UtilsError('Cannot create a buffer.');
    }
}

export function deepCopyObj<T> (sourceObj: T): T | undefined {
    try {
        return JSON.parse(JSON.stringify(sourceObj));
    } catch {
        return undefined;
    }
}

export function arrayIntersection (arr1: any[], arr2: any[]): any[] {
    return arr1.filter((x: any): boolean => (<ES7Array> arr2).includes(x));
}

export function arrayDifference (arr1: any[], arr2: any[]): any[] {
    return arr1
        .filter((x: any): boolean => !(<ES7Array> arr2).includes(x))
        .concat(arr2.filter((x: any): boolean => !(<ES7Array> arr1).includes(x)));
}

export function getPropertyOrUndefined<T> (property: T | null | undefined): T | undefined {
    return (property === null || property === undefined) ? undefined : property;
}

export function getTrueOrUndefined (value: boolean): true | undefined {
    return !value ? undefined : value;
}

export function getDateStringOrUndefined (date: string | Date | null): string | undefined {
    if (date === null) {
        return undefined;
    }

    const parsedDate: Date = new Date(date);
    if (isNaN(parsedDate.valueOf()) || parsedDate.getTime() === 0) {
        return undefined;
    }

    return parsedDate.toISOString();
}

export function parseDateOrUndefined (date?: string): Date | undefined {
    if (date === undefined) {
        return undefined;
    }

    try {
        const parsed: number = Date.parse(date);
        if (isNaN(parsed)) {
            return undefined;
        }

        return new Date(parsed);
    } catch {
        return undefined;
    }
}

export function isUuid (value: string | null | undefined): boolean {
    return !!value && /^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/.test(value);
}

// is used for fields which are saved as JSONB. NULL values have to be cleaned on reading
// default has to be undefined, so the property is not returned
// eslint-disable-next-line @typescript-eslint/ban-types
export function cleanNullValues<T extends Object> (someObject: T | null | undefined): T | undefined {
    if (someObject === null || someObject === undefined) {
        return undefined;
    }

    for (const propName in someObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (someObject.hasOwnProperty(propName) && <any> someObject[propName] === null) {
            delete someObject[propName];
        }
    }

    if (Object.keys(someObject).length === 0) {
        return undefined;
    }

    return someObject;
}

// Is used for apis which provide empty string values as default values.
// Those defaults are converted to null to be able to remove these fields in the database
// eslint-disable-next-line @typescript-eslint/ban-types
export function replaceEmptyStringValuesWithNull<T extends Object> (someObject: T | null): T | null {
    if (someObject === null || Object.keys(someObject).length === 0) {
        return null;
    }

    Object.keys(someObject)
        .forEach((key: string): void => {
            if (!someObject[key] || (undefined !== someObject[key].trim && someObject[key].trim() === '')) {
                someObject[key] = null;
            }
        });

    return someObject;
}

// This is for nullable values, false is excluded because it is a valid value
export function getPropertyOrFallbackOrUndefined<V, F> (value: V | undefined | null, fallBack?: F | null): V | F | undefined {
    if (value !== undefined && value !== null && <unknown> value !== '') {
        return value;
    }

    if (fallBack !== undefined && <unknown> fallBack !== '' && fallBack !== null) {
        return fallBack;
    }

    return undefined;
}

// This is for not-nullable values, false is excluded because it is a valid value
export function getPropertyOrFallback<V, F> (value: V | undefined | null, fallBack: F): V | F {
    if (value !== undefined && value !== null && <unknown> value !== '') {
        return value;
    }

    return fallBack;
}

export function fillArrayWithIndices (length: number = 0): number[] {
    /* eslint-disable unicorn/new-for-builtins */
    return [...Array(length)
        .keys()];
}

export function batchArray<T> (items: T[], maxBatchSize: number): T[][] {
    const batches: T[][] = [];

    let currentBatch: number = 0;
    items.forEach((item: T): void => {
        if (batches[currentBatch] && batches[currentBatch].length >= maxBatchSize) {
            ++currentBatch;
        }
        if (!batches[currentBatch]) {
            batches[currentBatch] = [];
        }
        batches[currentBatch].push(item);
    });

    return batches;
}

export function requiredEnvVariable (key: keyof typeof process.env): string {
    if (NON_PRODUCTION_NULL_ENVIRONMENT_KEYS.includes(key.toString()) && Environments.getEnv() !== EnvironmentType.PROD) {
        return <string> process.env[key];
    }

    if (key in process.env && process.env[key]) {
        return <string> process.env[key];
    }

    if (Environments.isTest()) {
        // enables running test directly in IDE in test mode
        return '';
    }

    throw new Error(`Missing environment variable "${key}"!`);
}

export function oneLine (multiline: string): string {
    return multiline
        .replace(/(?:\n(?:\s*))+/g, ' ')
        .trim();
}

export function waitForMs (time: number): Promise<void> {
    return new Promise((resolve: TimerHandler): void => {
        setTimeout(resolve, time);
    });
}

slugify.extend({
    Þ: 'B',
    þ: 'b',
});

export function slugifyText (text: string, locale: string): string {
    const slugifiedText: string = slugify(text, {
        locale,
        lower: true,
        replacement: '-',
    });

    return slugifiedText
        .replace(/[^a-z-]/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/^-/g, '')
        .replace(/-$/g, '');
}
