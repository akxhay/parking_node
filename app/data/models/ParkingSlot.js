const {DataTypes} = require("sequelize");
const sequelize = require("../../config/Database"); // Import your Sequelize instance

const ParkingSlot = sequelize.define(
    "ParkingSlot",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // This line makes id auto-increment
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
        timestamps: false, // Disable automatic timestamps
    }
);

module.exports = ParkingSlot;
