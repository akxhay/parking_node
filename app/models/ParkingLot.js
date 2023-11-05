const {DataTypes} = require("sequelize");
const sequelize = require("../config"); // Import your Sequelize instance
const Floor = require("./Floor"); // Import the Floor model

const ParkingLot = sequelize.define(
    "ParkingLot",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // This line makes id auto-increment
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        timestamps: false, // Disable automatic timestamps
    }
);
ParkingLot.hasMany(Floor, {
    as: 'floors',
    foreignKey: 'parkingLotId',
    onDelete: 'CASCADE',
});

module.exports = ParkingLot;
