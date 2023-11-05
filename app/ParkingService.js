const ParkingLot = require("./models/ParkingLot");
const ParkingSlot = require("./models/ParkingSlot");
const Floor = require("./models/Floor");

const sequelize = require("./config");
const GenericConstants = require("./constants/GenericConstants");

module.exports = {
    findParkingLotById: async (id) => {
        // Check if the parking lot already exists
        return await ParkingLot.findByPk(id);
    },
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

        let createdParkingLot = null;
        return sequelize.transaction(async (t) => {
            const lot = await ParkingLot.create({name}, {transaction: t});
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

    },
    fetchParkingLotById: async (id) => {
        return await ParkingLot.findByPk(id, {
            include: [
                {
                    model: Floor,
                    as: 'floors',
                    include: [
                        {
                            model: ParkingSlot,
                            as: 'parkingSlots',
                        },
                    ],
                },
            ],
        });
    },

    fetchParkingLots: async (pageNumber, pageSize) => {
        const offset = (pageNumber) * pageSize;

        const {count, rows} = await ParkingLot.findAndCountAll({
            offset,
            limit: pageSize,
            include: [
                {
                    model: Floor,
                    as: 'floors',
                    include: [
                        {
                            model: ParkingSlot,
                            as: 'parkingSlots',
                        },
                    ],
                },
            ],
            order: [['id', 'DESC']],
        });
        const parkingLotCount = await ParkingLot.count();

        return {
            total: parkingLotCount,
            parkingLots: rows,
        };

    },

    deleteParkingLot: async (id) => {
        const parkingLot = await ParkingLot.findByPk(id);

        if (!parkingLot) {
            throw new Error('Parking lot not found');
        }

        // Delete the parking lot
        await parkingLot.destroy();
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
