const getCleanStringKeys: (enumeration: any) => string[] = (enumeration: any): string[] => {
    const objKeys: string[] = Object.keys(enumeration);

    return objKeys
        .filter((value: string): boolean => isNaN(+value))
        .map((value: string): string => enumeration[value]);
};

export const getEnumValues: (enumeration: any) => string[] = (enumeration: any): string[] => {
    const enumerationObj: string[] = JSON.parse(JSON.stringify(enumeration));

    return getCleanStringKeys(enumerationObj);
};

export const getMaxLengthOfEnumValues: (enumeration: any) => number = (enumeration: any): number => {
    const enumerationValuesLengths: number[] = getEnumValues(enumeration)
        .map((enumerationValue: string): number => enumerationValue.length);

    if (enumerationValuesLengths.includes(<any> undefined)) {
        throw new Error(`Enumeration can contain only string values to get a max length.`);
    }

    return Math.max(...enumerationValuesLengths);
};
