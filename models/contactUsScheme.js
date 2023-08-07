import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, required: true},
    message: {type: String, required: true},
    at: {type: Date, required: true}
})

const ContactUs = mongoose.model("contactUses", contactUsSchema);

export default ContactUs;