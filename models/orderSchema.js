import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, required: true},
    productId: {type: mongoose.Types.ObjectId, required: true},
    status: {type: Boolean, default: true},
    orderStatus: {type: String, default: "pending"},
    at: {type: Date, required: true}
})

const Order = mongoose.model("orders", orderSchema);

export default Order;