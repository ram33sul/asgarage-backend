import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    bannerOne: {type: Object, required: true},
    bannerTwo: {type: Object, required: true},
    popup: {type: Object, default: null},
    popupStatus: {type: Object, default: false},
    username: {type: String, default: 'admin'},
    password: {type: String, default: 'admin'}
})

const Admin = mongoose.model("admindatas", adminSchema);
export default Admin;
