import mongoose from "mongoose";
import User from "../models/userSchema.js";
import { isValid } from "../validation/dataTypes.js";
import validateInputs from "../validation/inputs.js";
import ContactUs from "../models/contactUsScheme.js";
import bcrypt from 'bcrypt'

export const editProfile = async (req, res) => {
    const { firstName, lastName, mobile, password } = req.body;
    const userId = req.verifiedUserId;
    const validationErrors = validateInputs([
        [ firstName, 'name', 'firstName' ],
        [ lastName, 'name', 'lastName' ],
        (mobile ? [mobile, 'mobile'] : []),
        (password ? [ password, 'password'] : [])
    ])
    if(!isValid(firstName) && !validationErrors.reduce((acc, curr) => curr[0] === 'firstName' || acc === true, false)){
        validationErrors.push(["firstName", "is required"])
    }
    if(mobile){
        const isMobileExist = await User.findOne({ mobile, _id: {$ne: new mongoose.Types.ObjectId(userId)} })
        if(isMobileExist) {
            validationErrors.push(["mobile", "already exists"])
        }
    }
    if(validationErrors.length !== 0){
        return res.status(400).send({error: validationErrors})
    }
    const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
    const userData = await User.updateOne({
            _id: new mongoose.Types.ObjectId(userId)
        },{
            firstName: firstName,
            lastName: lastName,
            mobile: mobile,
            ...(password ? {password: hashedPassword} : {})
        })
    return res.status(200).json({data: userData})
}

export const contactUs = async (req, res) => {
    const { message } = req.body;
    const userId = req.verifiedUserId;
    const contactUs = await ContactUs.create({
        message: message,
        userId: new mongoose.Types.ObjectId(userId),
        at: new Date()
    })
    return res.status(200).json({data: contactUs})
}