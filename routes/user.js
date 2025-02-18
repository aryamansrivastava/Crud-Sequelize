const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.post('/create', userController.createUser);

router.get('/getuser/:id', userController.getUserById );

router.get('/getallusers', userController.getUsers);

router.delete("/delete/:id", userController.deleteUser);

router.put("/update/:id", userController.updateUser);

router.get('/hello', userController.sayHello);

module.exports = {router};