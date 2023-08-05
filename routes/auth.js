const express = require('express');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');


//SIGN UP API
authRouter.post('/api/signup',async (req, resp) => {
   try {
    const {name,email,password} = req.body;
    const existingUser= await User.findOne({email: email});
    if (existingUser) {
        return resp.status(400).json({msg:"User with the same email already exists!"});
    }
    const hashedPassword = await bcryptjs.hash(password,8);
    let user = new User({
        email : email,
        password : hashedPassword,
        name : name, 
    });
    user = await user.save();
    resp.send(user);
   } catch (e) {
        resp.status(500).json({error: e.message});
   }
});


//SIGN IN API
authRouter.post('/api/signin',async (req, res) => {
    try {
        const {email,password}=req.body;

        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({msg : "User with this email not found"});
        } 

        const isMatch = await bcryptjs.compare(password,user.password);
        if (!isMatch) {
            return res.status(404).json({msg : "Incorrect password"});
        }

        const token = jwt.sign({id:user._id}, "passwordKey"); //JWT AUTH
        res.json({token:token, ...user._doc});

    } catch (e) {
        res.status(500).json({error: e.message});
    }
})

// CHECKING USER TOKEN, WHEN LOGGING IN

authRouter.post('/tokenIsValid',async (req, res) => { // getting data through headers
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.json(false);
        const verified =  jwt.verify(token,'passwordKey'); 
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id); // searching in db by the id...
        if(!user) return res.json(false);

        res.json(true); // returns true if all conditions are met
    } catch (e) {
        res.status(500).json({error: e.message});
    }
})

// GETTING USER DATA ONLY WHEN USER IS AUTHORIZED, DONE USING MIDDLEWARE

authRouter.get('/', auth,async (req, res) => { //auth is from middlewares/auth.js
    const user = await User.findById(req.user); // req.user and req.token is fomatted by the auth middleware
    res.json({...user._doc, token: req.token});   
})

module.exports = authRouter;