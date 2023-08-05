const jwt = require('jsonwebtoken')


const auth = async (req,res,next)=>{
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({msg: "No auth token, access denied"});

        const verified =  jwt.verify(token,'passwordKey'); 
        if (!verified) return res.status(401).json({msg: "Token verification failed, access denied"});

        req.user = verified.id; // everytime an authenticated route or api call is made, after checking the previous conditions, it saves the user's id to the req object's body
        req.token = token;

        next(); // next is just like ending the middleware function


    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

module.exports = auth;