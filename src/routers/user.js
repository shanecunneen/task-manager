const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

router.post('/users', async (req,res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(400).send(`Could not create user: ${e}`);
    }    

});

router.get('/users', async (req,res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.status(500).send();
    }

});
/*     User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(500).send();
    }); */


router.get('/users/:id', async (req,res) => {

    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).send('Invalid ID');
    
    try {
        const user = await User.findById(_id);
        if(!user) return res.status(404).send();
        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
     
 /*    User.findById(_id).then((user) => {
        if(!user) return res.status(404).send();
        res.send(user);
    }).catch((e) => {
        console.log(e);
        res.status(500).send();
    }); */
});

router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) res.status(404).send();
        res.status(200).send(user);
    } catch(e) {
        res.status(400).send();
    }
})

router.patch('/users/:id', async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send(`Error: Invalid update operation`);

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!user) res.status(404).send() 
        res.send(user);
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});

module.exports=router