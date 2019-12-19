require('../src/db/mongoose');

const Task = require('../src/models/task');

Task.findByIdAndDelete('5dfa400ec585ba2bec2d6154').then((task) => {
    console.log(`Deleted ${task}`);
    return Task.countDocuments({});
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})