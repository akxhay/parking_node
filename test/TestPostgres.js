const Redis = require('ioredis');
const {expect} = require('chai');

const sequelize = require("../src/config/Database")

describe('Sequelize Configuration', () => {
    it('should connect to the PostgreSQL database', async () => {
        try {
            await sequelize.authenticate();
            expect(true).to.be.true;
        } catch (error) {
            expect.fail('Failed to connect to the PostgreSQL database');
        } finally {
            await sequelize.close();
        }
    });

    it('should have underscored table names', () => {

        const models = sequelize.models;
        for (const modelName in models) {
            if (Object.hasOwnProperty.call(models, modelName)) {
                const table = models[modelName];
                expect(table.options.underscored).to.be.true;
            }
        }
    });
});
