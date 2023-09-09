import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, required: true},
    message: {type: String, required: true},
    read: {type: Boolean, default: false},
    at: {type: Date, required: true}
})

const ContactUs = mongoose.model("contactusers", contactUsSchema);

export default ContactUs;