const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

// create a user
router.post('/create', userController.createUser);

// read the user
router.get('/getuser/:id', userController.getUserById );

// get all users
router.get('/getallusers', userController.getUsers);

// delete a User by Id
router.delete("/delete/:id", userController.deleteUser);

// update a user by Id
router.put("/update/:id", userController.updateUser);

module.exports = {router};