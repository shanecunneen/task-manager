const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// GET /tasks/
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt_asc (or _desc)
router.get('/tasks', auth, async (req,res) => {

    const match = {};
    const sort = {};

    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {

        // two ways to do this. One way is to find based on a user
        //const tasks = await Task.find({owner: req.user._id});
        // second way is as follows
        await req.user.populate({
            path: 'tasks',
            match,
            // limit the number of tasks returned
            // skip a number of tasks
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();    
    }
});

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid ID');
    
    try {
        // Make sure the task has actually been created by the logged in user
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task) return res.status(404).send();
        res.send(task);
    } catch(e) {
        res.status(500).send();    
    }

});

router.post('/tasks', auth, async (req,res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(`Could not create task: ${e}`);
    }
});

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'complete'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send(`Error: Invalid update operation`);

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if (!task) res.status(404).send(); 

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task) res.status(404).send();

        res.status(200).send(task);
    } catch(e) {
        res.status(400).send();
    }
});

module.exports=router;
