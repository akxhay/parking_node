const { DataTypes } = require("sequelize");
const sequelize = require("../../config/Database");
const ParkingSlot = require("./ParkingSlot");

const Floor = sequelize.define(
  "Floor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Floor.hasMany(ParkingSlot, {
    as: 'parkingSlots',
    foreignKey: 'floorId',
    onDelete: 'CASCADE',
});
module.exports = Floor;
