import jwt from 'jsonwebtoken';
import { jwtSignAdmin } from "../authentication/jwt.js";
import User from '../models/userSchema.js';
import Product from '../models/productSchema.js';
import Order from '../models/orderSchema.js';
import mongoose from 'mongoose';
import ContactUs from '../models/contactUsScheme.js';


export const verifyAdmin = async (req, res) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).send({error: "Token is required"})
    jwt.verify(token, process.env.AUTH_SECRET_KEY_ADMIN, async (error, data) => {
        if(error){
            return res.status(401).send({error: "Token cannot be verified"})
        }
        return res.status(200).json({data: 'admin'})
    });
}

export const loginAdmin = async (req, res) => {
    const { emailOrMobile, password } = req.body
    const errors = []
    if(emailOrMobile !== 'admin'){
        errors.push(["emailOrMobile", "is incorrect"])
    }
    if(password !== 'admin'){
        errors.push(["password", "is incorrect"])
    }
    if(errors.length !== 0){
        return res.status(401).send({error: errors})
    }
    const token = jwtSignAdmin("admin")
    return res.status(200).json({data: "admin", token});
}

export const getUsersAdmin = async (req, res) => {
    const { page, pageSize, search } = req.query
    const regex = new RegExp(search, 'i')
    const users = await User.find({
        ...(search ? {
            $expr: {
                $regexMatch: {
                    input: { $toString: '$_id' },
                    regex: regex,
                },
            },
        } : {})
    }).sort({at: -1}).skip(parseInt(page) * parseInt(pageSize)).limit(pageSize);
    res.status(200).json({data: users})
}

export const getUserDetails = async (req, res) => {
    const { userId } = req.query;
    const userData = await User.findOne({
        _id: new mongoose.Types.ObjectId(userId)
    })
    res.status(200).json({data: userData})
}

export const getProductsAdmin = async (req, res) => {
    const { page, pageSize, search } = req.query
    const regex = new RegExp(search, 'i')
    const products = await Product.find({
        ...(search ? {
            $expr: {
                $regexMatch: {
                    input: { $toString: '$_id' },
                    regex: regex,
                },
            },
        } : {})
    }).sort({at: -1}).skip(parseInt(page) * parseInt(pageSize)).limit(pageSize);
    res.status(200).json({data: products})
}

export const getOrdersAdmin = async (req, res) => {
    const { page, pageSize, search } = req.query
    const regex = new RegExp(search, 'i')
    const orders = await Order.aggregate([
        {
            $match: {
                $expr: {
                    $regexMatch: {
                        input: { $toString: '$_id' },
                        regex: regex,
                    },
                },
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
                        "$productDetails.userId",
                        0
                    ]
                },
                name: {
                    $arrayElemAt: [
                        "$productDetails.name",
                        0
                    ]
                },
                description: {
                    $arrayElemAt: [
                        "$productDetails.description",
                        0
                    ]
                },
                category: {
                    $arrayElemAt: [
                        "$productDetails.category",
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
                        "$productDetails.sellingPrice",
                        0
                    ]
                },
                actualPrice: {
                    $arrayElemAt: [
                        "$productDetails.actualPrice",
                        0
                    ]
                },
                contents: {
                    $arrayElemAt: [
                        "$productDetails.contents",
                        0
                    ]
                },
                adminStatus: {
                    $arrayElemAt: [
                        "$productDetails.adminStatus",
                        0
                    ]
                },
            }
        },{
            $skip: (page !== undefined && pageSize !== undefined) ? (parseInt(page) * parseInt(pageSize)) : 0
        },{
            $limit: pageSize ?? 1
        }
    ])

    res.status(200).json({data: orders})
}

export const getProductDetailsAdmin = async (req, res) => {
    const { productId } = req.query;
    const product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(productId)
    })
    if(!product){
        return res.status(404).send({error: "No such product"})
    }
    res.status(200).json({data: product})
}

export const acceptProductAdmin = async (req, res) => {
    const { productId } = req.query;
    const product = await Product.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(productId)
    },{
        $set: {
            adminStatus: "accepted"
        }
    })
    if(!product){
        return res.status(404).send({error: "No such product"})
    }
    res.status(200).json({data: true})
}

export const rejectProductAdmin = async (req, res) => {
    const { productId } = req.query;
    const product = await Product.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(productId)
    },{
        $set: {
            adminStatus: "rejected"
        }
    })
    if(!product){
        return res.status(404).send({error: "No such product"})
    }
    res.status(200).json({data: true})
}

export const getMessages = async (req, res) => {
    const { page, pageSize } = req.query;
    const data = await ContactUs.aggregate([
        {
            $match: {},
        },{
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'userId',
                as: 'userDetails'
            },
        },{
            $project: {
                message: 1,
                at: 1,
                email: {
                    $arrayElemAt: [
                        "$userDetails.email",
                        0
                    ]
                }
            },
        },{
            $sort: {
                at: -1
            },
        },{
            $skip: parseInt(page) * parseInt(pageSize),
        },{
            $limit: parseInt(pageSize)
        }
    ])
    res.status(200).json({data})
}

export const getMessagesCount = async (req, res) => {
    const count = await ContactUs.find({read: false}).count();
    res.status(200).json({data: count})
}

export const markMessagesRead = async (req, res) => {
    await ContactUs.updateMany({}, {
        $set: {
            read: true
        }
    })
    res.status(200).json({data: true})
}

export const getOrderDetailsAdmin = async (req, res) => {
    const { orderId } = req.query;
    const data = await Order.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(orderId)
            }
        },{
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'userId',
                as: 'userDetails'
            }
        },{
            $project: {
                productId: 1,
                orderStatus: 1,
                at: 1,
                email: {
                    $arrayElemAt: [
                        "$userDetails.email",
                        0
                    ]
                }
            }
        }
    ]);
    res.status(200).json({data: data[0]})
}