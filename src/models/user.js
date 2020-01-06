const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot be set to "password"');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) throw new Error('Age must be a positive number');
        }
    },
    avatar: {
        type: Buffer   // store an image
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email});
    if(!user) {
        throw new Error('Unable to login');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Password does not match');
    }

    return user;
}

// don't use an arrow function as we need 'this' to be bound
userSchema.methods.generateAuthToken = async function() {
    // 'this' will refer to user
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({ token});
    await this.save();
    return token;
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// Gets called automatically 
//- we can use it to hide private data (e.g. password)
userSchema.methods.toJSON = function() {
    // this will refer to the user (hence not using an arrow function)
    const userObject = this.toObject();

    // we do not want to pass the following back to the user
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// hash the password before saving
userSchema.pre('save', async function(next) {

    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// delete user's tasks once the user is deleted
userSchema.pre('remove', async function(next) {
    // 'this' will refer to the user
    await Task.deleteMany({owner: this._id});
    next();
}); 

const User = mongoose.model('User', userSchema);

module.exports=User;