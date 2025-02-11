const express = require('express');
const { createUser, getUserById, getUsers, updateUser, deleteUser } = require('../controller/userController');

const router = express.Router();

// create a user
router.post('/create', createUser);

// read the user
router.get('/getuser/:id', getUserById );

// get all users
router.get('/getallusers', getUsers);

// delete a User by Id
router.delete("/delete/:id", deleteUser);

// update a user by Id
router.put("/update/:id", updateUser);

module.exports = {router};