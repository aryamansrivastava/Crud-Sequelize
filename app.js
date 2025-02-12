const {sequelize} = require("./config/database");
const express = require('express');
const {dbConnection} = require('./config/database');
// const { userModel } = require('./models/userModel');
const {router} = require('./routes/user');

const app = express();

app.use(express.json());

app.use('/', router);

app.listen(4000, async() => {
    console.log('Server is listening at port 4000');
    try{
    await dbConnection();
    sequelize.sync()
        .then(() => console.log("Database connected successfully!"))
        .catch(err => {console.error("Database cannot be connected", err); throw new Error(err)});}catch(e){
            console.error(e);
            process.exit(1);
        }
});

// password MS Sql server -> Aryaman@1234