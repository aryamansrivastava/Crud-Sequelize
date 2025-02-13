const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");
const validator = require("validator");

const userModel = sequelize.define('user', {
    firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "First name is required" },
    },
  },
   lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Last name is required" },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Invalid email format" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 30], msg: "Password must be between 6 and 30 characters" },
    },
  },
  //  gender: {
  //   type: DataTypes.ENUM("male", "female", "other"),
  //   allowNull: false,
  //   validate: {
  //     isIn: {
  //       args: [["male", "female", "other"]],
  //       msg: "Gender must be 'Male', 'Female', or 'Other'",
  //     },
  //   },
  // },
  // age: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   validate: {
  //     isInt: { msg: "Age must be a number" },
  //     min: { args: [18], msg: "Age must be at least 18" },
  //     max: { args: [100], msg: "Age must be at most 100" },
  //   },
  // },
})

module.exports = {userModel};