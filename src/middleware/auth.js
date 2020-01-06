const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next) => {
    try {
        // use replace to remove the 'Bearer ' at the start
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`token = ${token}`);
        console.log(`decoded = ${decoded._id}`);
        const user = await User.findOne( {_id: decoded._id, 'tokens.token': token});
        if(!user) {
            throw new Error();
        }
    
        req.token = token;    
        req.user = user;
        next();
    } catch(e) {
        res.status(401).send({error: 'Invalidate authentication'});
    }
    
}

module.exports = auth