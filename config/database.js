const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('MyDatabase', 'sa', 'Aryaman@1234', {
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
});

const dbConnection = async() => {
    try {
        await sequelize.authenticate();
        // console.log("db connected");
    }
    catch (err) {
        console.log('Unable to connect DB', err);
    }
};

module.exports = {
    dbConnection, 
    sequelize,
}
