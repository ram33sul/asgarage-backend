import mongoose from "mongoose";
import Category from "../models/categorySchema.js";
import uploadToS3 from "./s3.js";

export const addCategory = async (req, res) => {
    const { name } = req.body;
    const image = req.file;
    if(!name || !image) return res.status(400).send({error: "Name and Image is required"})
    const isExist = await Category.findOne({name});
    if(isExist) return res.status(400).send({error: ["name", "already exists"]})
    const imageUrl = (await uploadToS3([image]))[0];
    const categoryData = await Category.create({
        name,
        image: imageUrl,
        at: new Date()
    })
    res.status(200).json({data: categoryData})
}

export const getCategories = async (req, res) => {
    const categories = await Category.find().sort({at: -1});
    res.status(200).json({data: categories})
}

export const getCategoryDetails = async (req, res) => {
    const {categoryId } = req.query;
    const data = await Category.findOne({_id: new mongoose.Types.ObjectId(categoryId)});
    if(!data) return res.status(404).send({error: "no such category"})
    res.status(200).json({data: data})
}

export const deleteCategory = async (req, res) => {
    const { categoryId } = req.query;
    await Category.deleteOne({_id: new mongoose.Types.ObjectId(categoryId)});
    res.status(200).json({data: true})
}