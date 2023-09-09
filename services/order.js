import mongoose, { mongo } from "mongoose";
import Order from "../models/orderSchema.js";

export const postOrder = async (req, res) => {
    const userId = req.verifiedUserId;
    const { productId } = req.body;
    const order = await Order.create({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
        at: new Date(),
    })
    res.status(200).json({data: order})
}

export const getOrders = async (req, res) => {
    const userId = req.verifiedUserId;
    const orders = await Order.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId)
            }
        },{
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "productId",
                as: "productDetails"
            }
        },{
            $project: {
                _id: 1,
                at: 1,
                userId: {
                    $arrayElemAt: [
                        ["$productDetails.userId"],
                        0
                    ]
                },
                name: {
                    $arrayElemAt: [
                        ["$productDetails.name"],
                        0
                    ]
                },
                description: {
                    $arrayElemAt: [
                        ["$productDetails.description"],
                        0
                    ]
                },
                category: {
                    $arrayElemAt: [
                        ["$productDetails.category"],
                        0
                    ]
                },
                images: {
                    $arrayElemAt: [
                        "$productDetails.images",
                        0
                    ]
                },
                sellingPrice: {
                    $arrayElemAt: [
                        ["$productDetails.sellingPrice"],
                        0
                    ]
                },
                actualPrice: {
                    $arrayElemAt: [
                        ["$productDetails.actualPrice"],
                        0
                    ]
                },
                contents: {
                    $arrayElemAt: [
                        ["$productDetails.contents"],
                        0
                    ]
                },
                adminStatus: {
                    $arrayElemAt: [
                        ["$productDetails.adminStatus"],
                        0
                    ]
                },
            }
        }
    ])
    res.status(200).json({data: orders})
}

export const getOrderDetails = async (req, res) => {
    const userId = req.verifiedUserId;
    const { orderId } = req.body;
    const order = await Order.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                _id: new mongoose.Types.ObjectId(orderId)
            }
        },{
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "productId",
                as: "productDetails"
            }
        },{
            $project: {
                _id: 1,
                at: 1,
                userId: {
                    $arrayElemAt: [
                        ["productDetails.userId"],
                        0
                    ]
                },
                name: {
                    $arrayElemAt: [
                        ["productDetails.name"],
                        0
                    ]
                },
                description: {
                    $arrayElemAt: [
                        ["productDetails.description"],
                        0
                    ]
                },
                category: {
                    $arrayElemAt: [
                        ["productDetails.category"],
                        0
                    ]
                },
                images: {
                    $arrayElemAt: [
                        ["productDetails.images"],
                        0
                    ]
                },
                sellingPrice: {
                    $arrayElemAt: [
                        ["productDetails.sellingPrice"],
                        0
                    ]
                },
                actualPrice: {
                    $arrayElemAt: [
                        ["productDetails.actualPrice"],
                        0
                    ]
                },
                contents: {
                    $arrayElemAt: [
                        ["productDetails.contents"],
                        0
                    ]
                },
                adminStatus: {
                    $arrayElemAt: [
                        ["productDetails.adminStatus"],
                        0
                    ]
                },
            }
        }
    ])
    res.status(200).json({data: order})
}