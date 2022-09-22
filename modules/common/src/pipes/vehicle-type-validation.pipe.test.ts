import {VehicleType} from '../vehicles/interfaces/vehicle';
import {VehicleTypeValidationPipe} from './vehicle-type-validation.pipe';

describe('VehicleTypeValidationPipe', (): void => {
    let pipe: VehicleTypeValidationPipe;

    beforeEach((): void => {
        pipe = new VehicleTypeValidationPipe();
    });

    test.each<[string | undefined, VehicleType[]]>([
        ['van', [VehicleType.Van]],
        ['cabover', [VehicleType.Cabover]],
        ['semi_integrated', [VehicleType.SemiIntegrated]],
        ['fully_integrated', [VehicleType.FullyIntegrated]],
        ['trailer', [VehicleType.Trailer]],
        ['van,cabover,semi_integrated,fully_integrated,trailer', [
            VehicleType.Van, VehicleType.Cabover, VehicleType.SemiIntegrated, VehicleType.FullyIntegrated, VehicleType.Trailer,
        ]],
        [undefined, []],
    ])(
        'should transform string to value properly',
        (input: string | undefined, expected: VehicleType[]): void => {
            expect(pipe.transform(input)).toEqual(expected);
        },
    );
    test.each<[string | undefined]>([
        ['invalid'],
        ['van,invalid'],
        ['invalid,van'],
        ['van,invalid,cabover'],
        [''],
        [','],
        ['van ,'],
        ['van ,cabover'],
    ])(
        'should throw on invalid strings',
        (input: string | undefined): void => {
            expect((): VehicleType[] => pipe.transform(input)).toThrowErrorMatchingSnapshot();
        },
    );
});
