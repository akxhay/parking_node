const Model = require("./models/Model");
const CustomError = require("./error/CustomError");
const sequelize = require("./config");
const GenericConstants = require("./constants/GenericConstants");

module.exports = {
    findParkingLotByName: async (name) => {
        // Check if the parking lot already exists
        return await ParkingLot.findOne({
            where: {
                name: name,
            },
        });
    },

    createParkingLot: async (parkingLotRequestDto) => {
        const {name, floors} = parkingLotRequestDto;
        try {
            let createdParkingLot = null;
            return sequelize.transaction(async (t) => {
                const lot = await Model.create({name}, {transaction: t});
                createdParkingLot = lot;
                for (const floorData of floors) {
                    const floor = await Floor.create({
                        name: floorData.name,
                        parkingLotId: lot.id,
                    }, {transaction: t});

                    for (let i = 0; i < floorData["smallSlots"]; i++) {
                        await ParkingSlot.create({
                            isOccupied: false,
                            slotNumber: i + 1,
                            floorId: floor.id,
                            slotType: GenericConstants.smallSlots,
                        }, {transaction: t});
                    }
                    for (let i = 0; i < floorData["mediumSlots"]; i++) {
                        await ParkingSlot.create({
                            isOccupied: false,
                            slotNumber: i + 1,
                            floorId: floor.id,
                            slotType: GenericConstants.mediumSlots,
                        }, {transaction: t});
                    }
                    for (let i = 0; i < floorData["largeSlots"]; i++) {
                        await ParkingSlot.create({
                            isOccupied: false,
                            slotNumber: i + 1,
                            floorId: floor.id,
                            slotType: GenericConstants.largeSlots,
                        }, {transaction: t});
                    }
                    for (let i = 0; i < floorData["xlargeSlots"]; i++) {
                        await ParkingSlot.create({
                            isOccupied: false,
                            slotNumber: i + 1,
                            floorId: floor.id,
                            slotType: GenericConstants.xlargeSlots,
                        }, {transaction: t});
                    }

                }

            }).then(() => {
                console.log('Transaction was successful');
                return createdParkingLot;
            }).catch((error) => {
                console.error('Transaction failed:', error);
                throw error; // Re-throw the error to be handled by the error handler
            });
        } catch (error) {
            throw error; // Re-throw the error to be handled by the error handler
        }
    },
    fetchParkingLotById: async (id) => {
        return await ParkingLot.findByPk(id, {
            include: [
                {
                    model: Floor,
                    as: 'floors',
                    include: ParkingSlot,
                },
            ]
        });
    },

    fetchParkingLots: async (pageRequest) => {
        try {
            log.info('Fetching parking lots');
            const parkingLots = await parkingRepository.findAll(pageRequest);
            return new Page(
                parkingLots,
                parkingLots.length,
                parkingLots.length,
                parkingLots.map(EntityDtoConverter.parkingLotEntityToDto)
            );
        } catch (error) {
            log.error('Error fetching parking lots:', error);
            throw new Error('Error fetching parking lots');
        }
    },

    deleteParkingLot: async (id) => {
        try {
            log.info(`Deleting parking lot with id: ${id}`);
            const parkingLot = await parkingRepository.findById(id);
            if (!parkingLot) return false;
            await parkingRepository.delete(parkingLot);
            return true;
        } catch (error) {
            log.error('Error deleting parking lot:', error);
            throw new Error('Error deleting parking lot');
        }
    },

    findSuitableSlot: async (id, size) => {
        try {
            log.info(`Finding parking slot with id: ${id}, size: ${size}`);
            let parkingSlot;
            switch (size) {
                case 's':
                    parkingSlot = await parkingSlotRepository.findAvailableSots(id, 's');
                    if (parkingSlot) return parkingSlotEntityToAvailableDto(parkingSlot);
                    break;
                case 'm':
                    parkingSlot = await parkingSlotRepository.findAvailableSots(id, 'm');
                    if (parkingSlot) return parkingSlotEntityToAvailableDto(parkingSlot);
                    break;
                case 'l':
                    parkingSlot = await parkingSlotRepository.findAvailableSots(id, 'l');
                    if (parkingSlot) return parkingSlotEntityToAvailableDto(parkingSlot);
                    break;
                case 'xl':
                    parkingSlot = await parkingSlotRepository.findAvailableSots(id, 'xl');
                    if (parkingSlot) return parkingSlotEntityToAvailableDto(parkingSlot);
                    break;
            }
            return null;
        } catch (error) {
            log.error('Error finding suitable parking slot:', error);
            throw new Error('Error finding suitable parking slot');
        }
    },

    releaseParkingLot: async (id, slotId) => {
        try {
            log.info(`Releasing parking slot with id: ${id}, slotId: ${slotId}`);
            const parkingSlot = await parkingSlotRepository.findById(slotId);
            if (!parkingSlot) {
                log.info('Invalid Slot');
                return 0;
            }
            if (parkingSlot.floor.parkingLot.id !== id) {
                log.info('Slot does not belong to parking lot');
                return 0;
            }
            return unPark(slotId);
        } catch (error) {
            log.error('Error releasing parking slot:', error);
            throw new Error('Error releasing parking slot');
        }
    },

    unPark: async (id) => {
        try {
            return parkingSlotRepository.unPark(id);
        } catch (error) {
            log.error('Error marking parking as unoccupied:', error);
            throw new Error('Error marking parking as unoccupied');
        }
    },

    park: async (id, numberPlate, arrivedAt) => {
        try {
            return parkingSlotRepository.park(id, numberPlate, arrivedAt);
        } catch (error) {
            log.error('Error parking a car:', error);
            throw new Error('Error parking a car');
        }
    },

    parkInfo: async (numberPlate) => {
        try {
            return parkingSlotRepository.findByNumberPlate(numberPlate);
        } catch (error) {
            log.error('Error getting parking slot information:', error);
            throw new Error('Error getting parking slot information');
        }
    },
};
