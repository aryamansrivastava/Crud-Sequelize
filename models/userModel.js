const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = sequelize.define("user", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "First name is required" } },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: "Last name is required" } },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: { msg: "Invalid email format" } },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 30], msg: "Password must be between 6 and 30 characters" },
    },
  },
});

// ✅ Hash password before saving user
userModel.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// ✅ Password validation function
userModel.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Generate JWT token function
userModel.prototype.getJWT = function () {
  return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

module.exports = { userModel };