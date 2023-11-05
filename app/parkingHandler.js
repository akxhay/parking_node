const CustomError = require("./error/CustomError");
const ParkingService = require("./ParkingService");

module.exports = {
    createParkingLot: async (parkingLotRequestDto) => {
        const existed = await ParkingService.findParkingLotByName(parkingLotRequestDto.name)
        if (existed) {
            throw new CustomError("Parking lot is already present with this name", 400);
        }
        const createdParkingLot = await ParkingService.createParkingLot(parkingLotRequestDto)
        return await ParkingService.fetchParkingLotById(createdParkingLot.id);
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
        try {
            return "availableParkingSlotDto";
        } catch (error) {
            log.error("Error handling parking slot:", error);
            throw new Error("Error handling parking slot");
        }
    },

    releaseParkingSlot: async (id, slotId) => {
        try {
            return "Parking slot freed successfully";
        } catch (error) {
            log.error("Error releasing parking slot:", error);
            throw new Error("Error releasing parking slot");
        }
    },
};
