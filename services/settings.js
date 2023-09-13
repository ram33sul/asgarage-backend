import Admin from "../models/adminData.js"
import uploadToS3 from "./s3.js";


export const addSettings = async (req, res) => {
    let { bannerOne, bannerTwo, popup, popupStatus } = req.body;
    const bannerOneImage = req.files?.filter(image => image.fieldname === 'bannerOneImage')?.[0];
    const bannerTwoImage = req.files?.filter(image => image.fieldname === 'bannerTwoImage')?.[0];
    const popupImage = req.files?.filter(image => image.fieldname === 'popupImage')?.[0];
    if( !bannerOne || !bannerTwo || !popup ){
        return res.status(400).send({error: "Invalid datas"})
    }

    bannerOne = JSON.parse(bannerOne);
    bannerTwo = JSON.parse(bannerTwo);
    popup = JSON.parse(popup);
    popupStatus = JSON.parse(popupStatus);

    let bannerOneImageUrl = bannerOne.image;
    let bannerTwoImageUrl = bannerTwo.image;
    let popupImageUrl = popup.image;
    if(bannerOneImage){
        bannerOneImageUrl = (await uploadToS3([bannerOneImage]))?.[0];
    }
    if(bannerTwoImage){
        bannerTwoImageUrl = (await uploadToS3([bannerTwoImage]))?.[0];
    }
    if(popupImage){
        popupImageUrl = (await uploadToS3([popupImage]))?.[0]
    }

    bannerOne.image = bannerOneImageUrl;
    bannerTwo.image = bannerTwoImageUrl;
    popup.image = popupImageUrl;

    const isExists = await Admin.findOne();
    if(isExists){
        await Admin.updateOne({},{
            bannerOne,
            bannerTwo,
            popup,
            popupStatus
        }).then((res) => {
            console.log(res)
        })
    } else {
        await Admin.create({
            bannerOne,
            bannerTwo,
            popup,
            popupStatus
        })
    }
    res.status(200).json({data: true})
}

export const getSettings = async (req, res) => {
    const settings = await Admin.findOne();
    if(settings){
        delete settings._id
    }
    res.status(200).json({data: settings})
}

export const editSettings = async (req, res) => {
    const { bannerOne, bannerTwo, popup } = req.body;
    if( !bannerOne || !bannerTwo || !popup ){
        return res.status(400).send({error: "Invalid datas"})
    }
    const settings = await Admin.updateOne({},{
        bannerOne,
        bannerTwo,
        popup
    })
    res.status(200).json({data: settings})
}

export const hidePopup = async (req, res) => {
    await Admin.updateOne({},{
        $set: {
            popupStatus: false
        }
    })
    res.status(200).json({data: true})
}

export const showPopup = async (req, res) => {
    await Admin.updateOne({},{
        $set: {
            popupStatus: true
        }
    })
    res.status(200).json({data: true})
}

export const changePasswordAdmin = async (req, res) => {
    const {prevPassword, password} = req.body;
    const adminData = await Admin.findOne();
    if(adminData.password !== prevPassword) return res.status(400).send({error: "Previous password is incorrect"})
    await Admin.updateOne({},{$set: {password}});
    res.status(200).json({data: true})
}