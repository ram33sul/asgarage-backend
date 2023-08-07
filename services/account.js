import jwt from 'jsonwebtoken';
import { jwtSign } from "../authentication/jwt.js";
import User from "../models/userSchema.js";
import { isValid } from "../validation/dataTypes.js";
import validateInputs from "../validation/inputs.js";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';

export const signupService = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const validationErrors = validateInputs([
        [ firstName, 'name', 'firstName' ],
        [ lastName, 'name', 'lastName' ],
        [ email, 'email' ],
        [ password, 'password' ]
    ])
    if(!isValid(firstName) && !validationErrors.reduce((acc, curr) => curr[0] === 'firstName' || acc === true, false)){
        validationErrors.push(["firstName", "is required"])
    }
    if(validationErrors.length !== 0){
        return res.status(400).send({error: validationErrors})
    }
    const isEmailExist = await User.findOne({ email })
    if(isEmailExist) {
        return res.status(400).send({error: ["email", "already exists"]})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        createdAt: new Date()
    })
    const token = jwtSign(userData._id)
    return res.status(200).json({data: userData, token})
}

export const loginService = async (req, res) => {
    const { emailOrMobile, password } = req.body
    const userData = await User.findOne({
        $or: [
            {
                email: emailOrMobile
            },
            {
                mobile: emailOrMobile
            }
        ]
    })
    if(!userData){
        return res.status(401).send({error: ["emailOrMobile", "doesn't match any user"]})
    }
    const comparePassword = await bcrypt.compare(password, userData.password);
    if(!comparePassword){
        return res.status(401).send({error: ["password", "is incorrect"]})
    }
    if(!userData.status){
        return res.status(401).send({error: "User is blocked, contact customer service"})
    }
    delete userData.password;
    const token = jwtSign(userData._id)
    return res.status(200).json({data: userData, token});
}

export const verifyUser = async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).send({error: "Token is required"})
    jwt.verify(token, process.env.AUTH_SECRET_KEY, async (error, data) => {
        if(error){
            return res.status(401).send({error: "Token cannot be verified"})
        }
        const userData = await User.findOne({_id: new mongoose.Types.ObjectId(data.userId)});
        if(!userData){
            return res.status(401).send({error: "User with the token doesn't exist"})
        }
        return res.status(200).json({data: userData})
    });
}