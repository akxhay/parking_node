const {Sequelize} = require("sequelize");

const databaseName = "parking_management"
const userName = "postgres"
const password = "airtel"
const host = "localhost"
const port = 5432
const dialect = "postgres"

const sequelize = new Sequelize(databaseName, userName, password, {
    host: host,
    port: port,
    dialect: dialect,
    define: {
        underscored: true, // Add this option to use lowercase table names
    },
    logging: console.log,
});

module.exports = sequelize;
