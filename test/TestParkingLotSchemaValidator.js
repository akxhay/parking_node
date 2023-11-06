const Joi = require('joi');
const {expect} = require('chai');
const parkingLotSchemaValidator = require('../src/validators/ParkingLotSchemaValidator');

describe('Parking Lot Schema Validation', () => {
    it('should validate a valid parking lot schema', () => {
        const validParkingLot = {
            name: 'Example Parking Lot',
            floors: [
                {
                    name: 'Floor 1',
                    smallSlots: 10,
                    mediumSlots: 20,
                    largeSlots: 15,
                    xlargeSlots: 5,
                },
            ],
        };

        const {error} = parkingLotSchemaValidator.validate(validParkingLot);
        expect(error).to.not.exist;
    });

    it('should not validate when name is missing', () => {
        const parkingLotWithoutName = {
            floors: [
                {
                    name: 'Floor 1',
                    smallSlots: 10,
                    mediumSlots: 20,
                    largeSlots: 15,
                    xlargeSlots: 5,
                },
            ],
        };

        const {error} = parkingLotSchemaValidator.validate(parkingLotWithoutName);
        expect(error).to.exist;
    });

    it('should not validate when floors are missing', () => {
        const parkingLotWithoutFloors = {
            name: 'Example Parking Lot',
        };

        const {error} = parkingLotSchemaValidator.validate(parkingLotWithoutFloors);
        expect(error).to.exist;
    });

    it('should not validate when floors are empty', () => {
        const parkingLotWithEmptyFloors = {
            name: 'Example Parking Lot',
            floors: [],
        };

        const {error} = parkingLotSchemaValidator.validate(parkingLotWithEmptyFloors);
        expect(error).to.exist;
    });

    it('should not validate when floors contain invalid data', () => {
        const parkingLotWithInvalidData = {
            name: 'Example Parking Lot',
            floors: [
                {
                    name: 'Floor 1',
                    smallSlots: 'invalid',
                },
            ],
        };

        const {error} = parkingLotSchemaValidator.validate(parkingLotWithInvalidData);
        expect(error).to.exist;
    });
});
