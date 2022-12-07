import {getEnumValues, getMaxLengthOfEnumValues} from './enum.utils';

enum EnumEmpty {}

enum EnumWithStrings {
    A = 'some text',
    B = 'some longer text',
    C = 'some even longer text',
}

enum EnumWithNumbers {
    A = 1,
    B = 100,
    C = 10000,
}

enum EnumWithMixedValues {
    A = 1,
    B = 100,
    C = 10000,
    D = 'some text',
    E = 'some longer text',
    F = 'some even longer text',
}

describe('Enum utils', (): void => {
    test('should get values from empty enumeration', (): void => {
        expect(getEnumValues(EnumEmpty))
            .toEqual([]);
    });

    test('should get values from string enumeration', (): void => {
        expect(getEnumValues(EnumWithStrings))
            .toMatchSnapshot();
    });

    test('should get values from number enumeration', (): void => {
        expect(getEnumValues(EnumWithNumbers))
            .toMatchSnapshot();
    });

    test('should get values from mixed enumeration', (): void => {
        expect(getEnumValues(EnumWithMixedValues))
            .toMatchSnapshot();
    });

    test('should get max length of enumeration', (): void => {
        expect(getMaxLengthOfEnumValues(EnumWithStrings))
            .toBe(21);
        expect((): number => getMaxLengthOfEnumValues(EnumWithNumbers))
            .toThrowErrorMatchingSnapshot();
        expect((): number => getMaxLengthOfEnumValues(EnumWithMixedValues))
            .toThrowErrorMatchingSnapshot();
    });
});
