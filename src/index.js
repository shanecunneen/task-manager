const express = require('express');
require('./db/mongoose');
const mongodb = require('mongodb');
const User = require('./models/user');
const Task = require('./models/task');
const ObjectID = mongodb.ObjectID;
const mongoose = require('mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT ||  3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Task Manager server is up on port ${port}` );
});