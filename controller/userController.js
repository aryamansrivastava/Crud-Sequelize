const { userModel } = require("../models/userModel");

// Create a new user
const createUser = async (req, res) => {
    try {
        const user = await userModel.create(req.body);
        res.status(200).json({message: "User created successfully", data: user});
        const saveduser = await user.save();
    } catch (err) {
        res.status(401).json({message: "Error in creating the user", error: err.message});
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json({ data: users });
    } catch (err) {
        res.status(401).json({message: "Error fetching users", error: err.message});
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
        res.status(401).json({message: "Error fetching user", error: err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log(req.params.id);
        const user = await userModel.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const userDeleted = await user.destroy();
        res.status(200).json({message: "User deleted successfully!"});
    } catch (err) {
        res.status(401).json({message: "Some Error occured while deleting the user", error: err.message});
    }
};

// update user by Id
const updateUser = async(req, res) => {
    try{
        const user = await userModel.findByPk(req.params.id);

        Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

        await user.save();

        res.json({
            message: `${user.firstName}, your Profile Updated Successfully`,
            data: user,
        });
    }
    catch(err) {
        res.status(401).json({message: "Error updating the user", error: err.message});
    }
};

module.exports = { getUsers, createUser, getUserById, deleteUser, updateUser };