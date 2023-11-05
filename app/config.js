const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("parking_management", "postgres", "airtel", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  define: {
    underscored: true, // Add this option to use lowercase table names
  },
});

module.exports = sequelize;
