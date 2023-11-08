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
        return await ParkingLot.findByPk(id);
    },
    findParkingLotByName: async (name) => {
        return await ParkingLot.findOne({
            where: {
                name: name,
            },
        });
    },
    findParkingSlotById: async (id) => {
        return await ParkingSlot.findByPk(id);
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
            throw error;
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
        const parkingLot = await ParkingLot.findByPk(id);
        if (!parkingLot) {
            return 0;
        }
        const [updatedRowsCount] = await ParkingSlot.update({
            occupied: false, numberPlate: null, arrivedAt: null,
        }, {
            where: {id: slotId},
        });
        return updatedRowsCount;
    },


};
