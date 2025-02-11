const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const userModel = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
})

module.exports = {userModel};