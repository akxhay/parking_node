const {DataTypes} = require("sequelize");
const sequelize = require("../config"); // Import your Sequelize instance

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
    foreignKey: 'parkingLotId', // Make sure this matches the actual foreign key in your database
    onDelete: 'CASCADE',
});

const Floor = sequelize.define(
    "Floor",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // This line makes id auto-increment
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Add other fields specific to Floor here
    },
    {
        timestamps: false, // Disable automatic timestamps
    }
);

Floor.belongsTo(ParkingLot, {
    as: "parkingLot",
    foreignKey: "parkingLotId",
});

Floor.hasMany(ParkingSlot, {
    as: 'parkingSlots',
    foreignKey: 'floorId', // Make sure this matches the actual foreign key in your database
    onDelete: 'CASCADE',
});


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
        isOccupied: {
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

ParkingSlot.belongsTo(Floor, {
    as: "floor",
    foreignKey: "floorId",
});

module.exports = ParkingSlot;
module.exports = Floor;
module.exports = ParkingLot;
