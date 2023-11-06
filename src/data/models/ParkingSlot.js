const {DataTypes} = require("sequelize");
const sequelize = require("../../config/Database");

const ParkingSlot = sequelize.define(
    "ParkingSlot",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        slotType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slotNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        occupied: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        numberPlate: {
            type: DataTypes.STRING,
            unique: true,
        },
        arrivedAt: {
            type: DataTypes.BIGINT,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = ParkingSlot;
