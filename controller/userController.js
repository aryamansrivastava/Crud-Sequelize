const { userModel } = require("../models/userModel");
const validator = require("validator");

// Create a new user
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Validation checks
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        if (!validator.isLength(password, { min: 6 })) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
    
        const newUser = await userModel.create({ firstName, lastName, email, password });
        res.status(201).json({ message: "User created successfully", user: newUser });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json({ data: users });
    } catch (err) {
        res.status(500).json({message: "Error fetching users", error: err.message});
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userModel.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({data: user });
    } catch (err) {
        res.status(500).json({message: "Error fetching user", error: err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        // console.log(req.params.id);
        const user = await userModel.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const userDeleted = await user.destroy();
        res.status(200).json({message: "User deleted successfully!"});
    } catch (err) {
        res.status(500).json({message: "Some Error occured while deleting the user", error: err.message});
    }
};

// update user by Id
const updateUser = async(req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Validate input
        if (!firstName || !lastName || !email) {
          return res.status(400).json({ message: "First name, last name, and email are required" });
        }
        if (!validator.isEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
    
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        if (password) {
          if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
          }
          user.password = password;
        }
    
        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

module.exports = { getUsers, createUser, getUserById, deleteUser, updateUser };