import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    bannerOne: {type: Object, required: true},
    bannerTwo: {type: Object, required: true},
    popup: {type: Object, default: null},
    popupStatus: {type: Object, default: true}
})

const Admin = mongoose.model("admindatas", adminSchema);
export default Admin;
