const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
    connectionURL, 
    {useNewUrlParser: true},
    (error, client) => {
        if(error) return console.log(`Could not connect + ${error}`)
        console.log('Connected');
        const db = client.db(databaseName);
        //insertTasks(db);
        //findTasks(db);
        //updateUser(db);
        //UpdateAllTasksToComplete(db);
        deleteTasks(db);
    }
);

function updateUser(db) {
    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID('5df79e50b1dab71c27f43493')
    }, {
       $set: {
           name: 'Jimbo'
       } 
    })
    updatePromise.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });  
}

function findTasks(db) {
    
    db.collection('Tasks').find({completed: 'No'}).toArray().then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(`Cannot find documents ${error}`);
    });

}

function deleteTasks(db) {

    db.collection('Tasks').deleteMany({description: 'Oracle course'}).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(`Cannot delete documents ${error}`);
    });

}

function UpdateAllTasksToComplete(db) {
    db.collection('Tasks').updateMany({completed: 'No'}, {$set: {completed: 'Yes'}}).then((result) => {
        console.log(`Updated all tasks to complete`);
    }).catch((error) => {
        console.log(`Cannot update all tasks ${error}`);
    });
}

function insertTasks(db) {

    const tasks = [
        {
            description: 'Go course',
            completed: 'No'
        },
        {
            description: 'Oracle course',
            completed: 'No'
        }    
    ];
    
    db.collection('Tasks').insertMany(tasks).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(`Could not insert tasks + ${error}`);
    });

}