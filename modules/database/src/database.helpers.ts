type EnumFunction<T = string[]> = (enumeration: any) => T;

const getCleanStringKeys: EnumFunction = (enumeration: any): string[] => {
    const objKeys: string[] = Object.keys(enumeration);

    return objKeys
        .filter((value: string): boolean => isNaN(+value))
        .map((value: string): string => enumeration[value]);
};

export const getEnumValues: EnumFunction = (enumeration: any): string[] => {
    const enumerationObj: string[] = JSON.parse(JSON.stringify(enumeration));

    return getCleanStringKeys(enumerationObj);
};

export const getMaxLengthOfEnumValues: EnumFunction<number> = (enumeration: any): number => {
    const enumerationValuesLengths: number[] = getEnumValues(enumeration)
        .map((enumerationValue: string): number => enumerationValue.length);

    if (enumerationValuesLengths.indexOf(<any> undefined) !== -1) {
        throw new Error(`Enumeration can contain only string values to get a max length.`);
    }

    return Math.max(...enumerationValuesLengths);
};
