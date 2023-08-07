import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, required: true},
    name: {type: String, required: true},
    description: {type: String, default: ''},
    category: {type: String, required: true},
    images: {type: Array, default: []},
    sellingPrice: {type: Number, required: true},
    actualPrice: {type: Number, required: true},
    contents: {type: Array, default: []},
    at: {type: Date, required: true},
    status: {type: Boolean, default: true},
    adminStatus: {type: String, default: 'pending'}
})

const Product = mongoose.model("products", productSchema)

export default Product;