import mongoose from "mongoose";

const connect = () => {
    const URI = process.env.MONGOOSE_URI;
    mongoose.connect(URI).then(() => {
        console.log(`Database connected: ${URI}`)
    }).catch(() => {
        console.log(`Error while connected to database`)
    })
}

const database = {
    connect
}
export default database;