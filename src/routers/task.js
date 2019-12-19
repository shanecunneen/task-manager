const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const mongoose = require('mongoose');


router.get('/tasks', async (req,res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send();    
    }
});

router.get('/tasks/:id', async (req,res) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid ID');
    
    try {
        const task = await Task.findById(_id);
        if(!task) return res.status(404).send();
        res.send(task);
    } catch(e) {
        res.status(500).send();    
    }

});

router.post('/tasks', async (req,res) => {

    try {
        const task = await new Task(req.body).save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(`Could not create task: ${e}`);
    }
});

router.patch('/tasks/:id', async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'complete'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send(`Error: Invalid update operation`);

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!task) res.status(404).send() 
        res.send(task);
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});

router.delete('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task) res.status(404).send();
        res.status(200).send(task);
    } catch(e) {
        res.status(400).send();
    }
});

module.exports=router;
