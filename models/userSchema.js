import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true },
    mobile: { type: String, default: ''},
    password: { type: String, required: true},
    status: { type: String, default: true},
    createdAt: { type: String, required: true},
})

const User = mongoose.model("users", userSchema);

export default User;