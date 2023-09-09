import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {type: String, required: true},
    otp: {type: String, required: true},
    status: {type: Boolean, default: true},
    at: {type: Date, required: true}
})

const OTP = mongoose.model("otps", otpSchema);

export default OTP;