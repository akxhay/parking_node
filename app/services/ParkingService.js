const ParkingLot = require("../data/models/ParkingLot");
const ParkingSlot = require("../data/models/ParkingSlot");
const Floor = require("../data/models/Floor");
const {Op} = require('sequelize');
const sequelize = require("../config/Database");
const GenericConstants = require("../data/constants/GenericConstants");


const getParkingSlot = async (parkingLotId, slotType) => {
    return await ParkingSlot.findOne({
        where: {
            floorId: {
                [Op.in]: [
                    sequelize.literal(`SELECT id FROM floors WHERE parking_lot_id = ${parkingLotId}`),
                ],
            },
            slotType,
            occupied: false,
        },
        order: [['id', 'ASC']],
    });
};



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
        await sequelize.transaction(async (t) => {
            const parkingLot = await ParkingLot.findByPk(id, {
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
            for (const floor of parkingLot.floors) {
                for (const parkingSlot of floor.parkingSlots) {
                    await parkingSlot.destroy({transaction: t});
                }
                await floor.destroy({transaction: t});
            }
            await parkingLot.destroy({transaction: t});
        })
    },

    findByNumberPlate: async (numberPlate) => {
        return await ParkingSlot.findOne({
            where: {
                numberPlate: numberPlate,
            }
        });
    },

    findFloorById: async (id) => {
        return await Floor.findByPk(id);
    },

    findSuitableSlot: async (parkingLotId, size) => {
        let parkingSlot;
            switch (size) {
                case 's':
                    parkingSlot = await getParkingSlot(parkingLotId, "s");
                    if (parkingSlot) return parkingSlot;
                case 'm':
                    parkingSlot = await getParkingSlot(parkingLotId, "m");
                    if (parkingSlot) return parkingSlot;
                case 'l':
                    parkingSlot = await getParkingSlot(parkingLotId, "l");
                    if (parkingSlot) return parkingSlot;
                case 'xl':
                    parkingSlot = await getParkingSlot(parkingLotId, "xl");
                    if (parkingSlot) return parkingSlot;
            }
            return null;
    },
    park: async (id, numberPlate, arrivedAt) => {
        const [updatedRowsCount] = await ParkingSlot.update(
            {
                occupied: true,
                numberPlate: numberPlate,
                arrivedAt: arrivedAt,
            },
            {
                where: {id: id},
            }
        );
        return updatedRowsCount;
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


    parkInfo: async (numberPlate) => {
        try {
            return parkingSlotRepository.findByNumberPlate(numberPlate);
        } catch (error) {
            log.error('Error getting parking slot information:', error);
            throw new Error('Error getting parking slot information');
        }
    },
};
