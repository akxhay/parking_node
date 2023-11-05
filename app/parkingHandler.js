const ParkingLot = require("./models/Model");
const Floor = require("./models/Floor");
const ParkingSlot = require("./models/ParkingSlot");
const CustomError = require("./error/CustomError");
const sequelize = require("./config");
const GenericConstants = require("./constants/GenericConstants")
const ParkingService = require("./ParkingService");

module.exports = {
    createParkingLot: async (parkingLotRequestDto) => {
        const existed = await ParkingService.findParkingLotByName(parkingLotRequestDto.name)
        if (existed) {
            throw new CustomError("Parking lot is already present with this name", 400);
        }
        const lot = await ParkingService.createParkingLot(parkingLotRequestDto)
        return await ParkingService.fetchParkingLotById(lot.id);
    },

    fetchParkingLots: async (pageNumber, pageSize) => {
        try {
            const response = await parkingService.fetchParkingLots(
                new PageRequest(pageNumber, pageSize, "id", "DESC")
            );
            return response;
        } catch (error) {
            log.error("Error fetching parking lots:", error);
            throw new Error("Error fetching parking lots");
        }
    },

    deleteParkingLot: async (id) => {
        try {
            return "Parking lot deleted successfully";
        } catch (error) {
            log.error("Error deleting parking lot:", error);
            throw new Error("Error deleting parking lot");
        }
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
