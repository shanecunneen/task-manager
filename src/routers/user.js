const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const multer = require('multer'); 

/* router.post('/users', async (req,res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(400).send(`Could not create user: ${e}`);
    }    
});
 */
router.post('/users', createUser);

async function createUser(req, res) {
    const user = new User(req.body);
    console.log(`User to be stored: ${user}`);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(e) {
        res.status(400).send(`Could not create user: ${e}`);
    }
}

router.post('/users/logon', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(e) {
        console.log(`logon error ${e}`);
        res.status(400).send();

    }
});

router.post('/users/logout', auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // return false for the matching token so as it is removed
            return token.token != req.token;
        })
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/logoutall', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});


// pass in auth function as middleware to run before
// actually doing the routing
router.get('/users/me', auth , async (req,res) => {
    res.send(req.user);
});


// In reality, you would not have a route like this
// which allows a query by ID as really you would only
// want a user to be able to access their own account
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

});

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch(e) {
        res.status(500).send();
    }
})

router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send(`Error: Invalid update operation`);

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.update();

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        //if (!user) res.status(404).send() 
        res.send(req.user);
    } catch(e) {
        console.log(e);
        res.status(400).send();
    }
});

// Allows the upload of a file to a directory called 'avatar'
const upload = multer({
    dest: 'avatar',
    limits: {
        fileSize: 1000000    // in bytes so 1000000 = 1MB
    },
    fileFilter(req, file, cb) {    // limit the upload to certain file types
        if(!file.originalname.endsWith('.pdf')) { 
            // could use a regular expression
            // e.g file.originalname.match(/\.(jpg|jpeg|png)$/)
            return cb(new Error('Please upload a PDF'))
        }
        
        cb(undefined, true); // the error is undefined
    } 
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();   // returns a HTTP 200 response
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message});
}

);

module.exports=router