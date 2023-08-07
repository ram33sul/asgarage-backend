import AWS from 'aws-sdk';
import {v4 as uuidv4 } from 'uuid'

const uploadToS3 = (images) => {
    return new Promise(async (resolve, reject) => {
        try {
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION
            })
            const s3 = new AWS.S3();
            const uploadPromises = images.map(async (image) => {
                const imageKey = `images/${uuidv4()}-${image.originalname}`;
                const params = {
                    Bucket: process.env.S3_BUCKET,
                    Key: imageKey,
                    Body: image.buffer,
                    ContentType: image.mimetype,
                };
                await s3.upload(params).promise();
                return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${imageKey}`;
            });
            const uploadedImages = await Promise.all(uploadPromises);
            resolve(uploadedImages)
        } catch (error) {
            reject(error)
        }
    })
}

export default uploadToS3;