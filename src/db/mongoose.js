const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;

console.log('Connecting to the DB now.....')
mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true
});