import jwt from 'jsonwebtoken';
import { jwtSign } from "../authentication/jwt.js";
import User from "../models/userSchema.js";
import { isValid } from "../validation/dataTypes.js";
import validateInputs from "../validation/inputs.js";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import jwtDecode from 'jwt-decode';
import nodemailer from 'nodemailer'
import { generateOTP, sendOTP } from './nodemailer.js';
import OTP from '../models/otpSchema.js';

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
        return res.status(400).send({error: [["email", "already exists"]]})
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
    console.log(req.body)
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

export const googleLogin = async (req, res) => {
    const googleToken = req.body.googleToken;
    if(!googleToken) return res.status(401).send({error: "Token is required"})
    const googleData = await jwtDecode(googleToken);
    if(!googleData.email) return res.status(401).send({error: "Token is invalid"})
    let userData = await User.findOne({email: googleData.email});
    if(!userData){
        userData = await User.create({
            firstName: googleData.given_name ? googleData.given_name : googleData.name,
            lastName: googleData.family_name,
            email: googleData.email,
            password: "secret-password",
            createdAt: new Date()
        })
    } else {
        if(!userData.status){
            return res.status(401).send({error: "User is blocked, contact customer service"})
        }
    }
    delete userData.password;
    const token = jwtSign(userData._id)
    return res.status(200).json({data: userData, token});
}

export const requestOTP = async (req, res) => {
    const { email } = req.body;

    const userData = await User.findOne({email});
    if(!userData){
        return res.status(404).send({error: "Account doesn't exist"})
    }

    const otp = generateOTP();

    await OTP.create({
        email,
        otp,
        at: new Date()
    })
    const otpSend = await sendOTP(email, otp);
    if(otpSend){
       return res.status(200).json({data: true})
    }
    return res.status(500).send({error: "OTP cannot be send"})

}

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    var currentDate = new Date();
    var fiveMinutesAgo = new Date(currentDate.getTime() - 5 * 60 * 1000)
    const otpData = await OTP.find({
        email,
        at: {
            $gte: fiveMinutesAgo,
            $lte: currentDate
        }
    }).sort({at: -1});
    if(!otpData[0]){
        return res.status(400).send({error: "OTP is expired or doesn't yet send"})
    }
    if(!otpData[0].status){
        return res.status(400).send({error: "You can't use the same otp"})
    }
    if(otpData[0].otp === otp){
        const d = await OTP.updateOne({_id: otpData[0]._id}, {$set: {status: false}})
        const userData = await User.findOne({email});
        delete userData.password;
        const token = jwtSign(userData._id)
        return res.status(200).json({data: userData, token});
    }
    return res.status(400).send({error: "OTP is not valid"})
}