require('../src/db/mongoose');

const User = require('../src/models/user');
const Task = require('../src/models/task');
const user_id = '5dfa4120929bb22ceb0e1cd2';
const task_id = '5dfa3ea63cfd1c2a3e355edc';

// Promise chaining examples
/* User.findByIdAndUpdate(user_id, {age: 1}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 1});
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
}); */

// Example for async / await to update Users
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({age});
    return count;
};

updateAgeAndCount(user_id, 3).then((count) => {
    console.log(`The count is ${count}`);
}).catch((e) => {
    console.log(e);
});

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await User.countDocuments({});
    return count;
};

deleteTaskAndCount(task_id).then((count) => {
    console.log(`The count is ${count}`);
}).catch((e) => {
    console.log(e);
})