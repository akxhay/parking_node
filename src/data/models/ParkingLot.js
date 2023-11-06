const {DataTypes} = require("sequelize");
const sequelize = require("../../config/Database");
const Floor = require("./Floor");

const ParkingLot = sequelize.define(
    "ParkingLot",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        timestamps: false,
    }
);
ParkingLot.hasMany(Floor, {
    as: 'floors',
    foreignKey: 'parkingLotId',
    onDelete: 'CASCADE',
});

module.exports = ParkingLot;
