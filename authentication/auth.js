import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import mongoose from 'mongoose';

const auth = (req, res, next) => {
    try {
        const token = req.cookies[process.env.JWT_TOKEN_NAME] ?? req.headers.authorization;
        if(!token) return res.status(401).send({error: "Token is required"})
        jwt.verify(token, process.env.AUTH_SECRET_KEY, async (error, data) => {
            if(error){
                return res.status(401).send({error: "User is not verified"})
            }
            const userData = await User.findOne({
                _id: new mongoose.Types.ObjectId(data.userId)
            })
            if(!userData?.status){
                return res.status(401).send({error: "User has been blocked"})
            }
            req.verifiedUserId = data.userId;
            next();
        })
    } catch (error) {
        return res.status(500).send({error: "Internal error occurred"})
    }
}

export default auth;