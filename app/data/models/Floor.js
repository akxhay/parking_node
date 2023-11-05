const { DataTypes } = require("sequelize");
const sequelize = require("../../config/Database"); // Import your Sequelize instance
const ParkingSlot = require("./ParkingSlot"); // Import the Floor model

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

Floor.hasMany(ParkingSlot, {
    as: 'parkingSlots',
    foreignKey: 'floorId', // Make sure this matches the actual foreign key in your database
    onDelete: 'CASCADE',
});
module.exports = Floor;
