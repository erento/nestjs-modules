import {Injectable, PipeTransform} from '@nestjs/common';
import {VehicleType} from '../vehicles/interfaces/vehicle';

@Injectable()
export class VehicleTypeValidationPipe implements PipeTransform {
    public transform (vehicleTypeList: string | undefined): VehicleType[] {
        if (vehicleTypeList === undefined) {
            return [];
        }
        const allVehicleTypes: string[] = Object.values(VehicleType);

        return vehicleTypeList.split(',').map((vehicleType: string): VehicleType => {
            if (allVehicleTypes.includes(vehicleType)) {
                return <VehicleType> vehicleType;
            }
            throw new Error(`Unrecognized vehicleType: '${vehicleType}'`);
        });
    }
}
