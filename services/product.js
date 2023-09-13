import mongoose from "mongoose";
import Product from "../models/productSchema.js";
import validateInputs from "../validation/inputs.js";
import { validateImages } from "../validation/images.js";
import uploadToS3 from "./s3.js";
import Category from "../models/categorySchema.js";

export const addProduct = async (req, res) => {
    let {name, description, category, sellingPrice, actualPrice, contents} = req.body;
    const isAdmin = req.verifiedAdmin
    const userId = req.verifiedUserId;
    const images = req.files;
    sellingPrice = parseInt(sellingPrice);
    actualPrice = parseInt(actualPrice);
    contents = JSON.parse(contents);
    const validationErrors = validateInputs([
        [name, 'productName', 'name'],
        [description, 'description'],
        [sellingPrice, 'price', 'sellingPrice'],
        [actualPrice, 'price', 'actualPrice'],
    ]);
    if(!Array.isArray(contents)) {
        validationErrors.push(['contents', 'must be an array'])
    } else {
        const contentError = [];
        contents.forEach((content, i) => {
            const error = {}
            if(!content.field){
                error.field = 'field is required';
            }
            if(!content.value){
                error.value = 'value is required';
            }
            if(error.field || error.value){
                contentError.push({
                    index: i,
                    ...{error}
                })
            }
        })
        if(contentError.length !== 0){
            validationErrors.push(contentError);
        }
    }
    const imagesErrors = validateImages(images);
    if(imagesErrors.length !== 0 ) validationErrors.push(['images',imagesErrors])
    const categoryDetails = await Category.findOne({name: category});
    if(!categoryDetails) validationErrors.push(["category", "is not valie"])
    if(validationErrors.length !== 0) return res.status(400).send({error: validationErrors})
    contents = contents.map(({field, value}) => ({field, value}));
    const imagesUrl = await uploadToS3(images)
    const productData = await Product.create({
        userId: new mongoose.Types.ObjectId(userId),
        name,
        description,
        category,
        sellingPrice,
        actualPrice,
        contents,
        images: imagesUrl,
        at: new Date(),
        ...(isAdmin ? {adminStatus: "accepted"} : {})
    })
    res.status(200).json({data: productData})
}

export const getProducts = async (req, res) => {
    const { page, pageSize, sort, filter, search } = req.query
    const products = await Product.find({
        status: true,
        adminStatus: 'accepted',
        ...(filter ? {category: filter} : {}),
        ...(search ? {name: {$regex: search, $options: 'i'}} : {})
    }).sort(
        sort === 'price-low' ? {sellingPrice: 1} :
        sort === 'price-high' ? {sellingPrice: -1} :
        sort === 'recent' ? {at: -1} : {at: -1}
    ).skip(parseInt(page) * parseInt(pageSize)).limit(pageSize);
    res.status(200).json({data: products})
}

export const getProductDetails = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(productId),
        status: true,
        adminStatus: 'accepted'
    });
    res.status(200).json({data: product})
}

export const getAddedProducts = async (req, res) => {
    const { page, pageSize } = req.body;
    const userId = req.verifiedUserId;
    const products = await Product.find({
        userId: new mongoose.Types.ObjectId(userId)
    }).sort({at: -1}).skip(parseInt(page) * parseInt(pageSize)).limit(pageSize);
    res.status(200).json({data: products})
}

export const deleteProduct = async (req, res) => {
    const { productId } = req.query;
    await Product.deleteOne({
        _id: new mongoose.Types.ObjectId(productId)
    })
    res.status(200).json({data: true})
}