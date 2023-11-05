const CustomError = require("../data/error/CustomError");
const ParkingService = require("../services/ParkingService");
const validSizes = ["s", "m", "l", "xl"];
const validDate = /^\d*$/;
const RedisHelper = require("../helper/RedisHelper");

const validateNumberPlate = async (numberPlate) => {
    const numberPlateParkingSlot = await ParkingService.findByNumberPlate(numberPlate);
    if (numberPlateParkingSlot) {
        const floor = await ParkingService.findFloorById(numberPlateParkingSlot.floorId);

        const floorName = floor.floorName;
        const parkingLot = await ParkingService.findParkingLotById(floor.parkingLotId);
        const parkingLotName = parkingLot.name;
        const slotType = numberPlateParkingSlot.slotType;
        const slotNumber = numberPlateParkingSlot.slotNumber;

        throw new CustomError("Car is already parked \n" +
            "Please find parking information below \n" +
            "Parking Lot Name: " + parkingLotName + "\n" +
            "floor Name: " + floorName + "\n" +
            "Slot Type: " + slotType + "\n" +
            "Slot Number: " + slotNumber, 500);
    }
};

module.exports = {
    createParkingLot: async (parkingLotRequestDto) => {
        const existed = await ParkingService.findParkingLotByName(parkingLotRequestDto.name)
        if (existed) {
            throw new CustomError("Parking lot is already present with this name", 400);
        }
        const createdParkingLot = await ParkingService.createParkingLot(parkingLotRequestDto)
        const parkingLotResponse = await ParkingService.fetchParkingLotById(createdParkingLot.id);
        RedisHelper.addParkingSpotsInQueueIfNotExists(parkingLotResponse);
        return parkingLotResponse;
    },

    fetchParkingLots: async (pageNumber, pageSize) => {
        if (pageSize == null || pageSize < 1) {
            throw new CustomError("pageSize should be greater than 0")
        }
        if (pageNumber == null || pageNumber < 0) {
            throw new CustomError("pageSize should be greater than 0")
        }
        const {total, parkingLots} = await ParkingService.fetchParkingLots(
            pageNumber, pageSize
        );
        return {"totalPages": Math.ceil(total / pageSize), "totalElements": total, "parkingLots": parkingLots};
    },

    deleteParkingLot: async (id) => {
        const parkingLot = await ParkingService.findParkingLotById(id);
        if (!parkingLot) {
            throw new CustomError("Parking Slot was not deleted", 400);
        }
        await ParkingService.deleteParkingLot(id);
        return 'Parking lot deleted successfully';
    },

    getParkingSlot: async (id, size, numberPlate, arrivedAt) => {
        if (!numberPlate) {
            throw new CustomError("Car cannot be parked without number plate", 400);
        }
        if (!arrivedAt) {
            throw new CustomError("Arrived time is not present in header", 400);
        }
        if (!validDate.test(arrivedAt)) {
            throw new CustomError("Arrived time is invalid", 400);
        }
        if (!validSizes.includes(size)) {
            throw new CustomError("size should in " + validSizes, 400);
        }
        await validateNumberPlate(numberPlate);
        let suitableSlotId = await RedisHelper.findSuitableSlot(id, size)
        if (!suitableSlotId) {
            throw new CustomError("Parking Slot is not available", 500);
        }
        const count = await ParkingService.park(suitableSlotId, numberPlate, arrivedAt);
        if (count === 0) {
            throw new CustomError("Car cannot be parked at this moment, Please try again", 500);
        }
        return await ParkingService.findParkingSlotById(suitableSlotId);
    },

    releaseParkingSlot: async (id, slotId) => {
        const parkingLot = await ParkingService.findParkingLotById(id);
        if (!parkingLot) {
            throw new CustomError("Invalid parking lot", 500);
        }
        const parkingSlot = await ParkingService.findParkingSlotById(slotId);
        if (!parkingSlot) {
            throw new CustomError("Invalid parking slot", 500);
        }
        const count = await ParkingService.releaseParkingLot(id, slotId);
        if (count === 0) {
            throw new CustomError("Parking Slot could not be released", 500);
        }
        RedisHelper.addParkingSpotInQueue(id, parkingSlot.slotType, slotId)

        return "Parking slot freed successfully";
    },
};
