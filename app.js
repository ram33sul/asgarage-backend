import express from 'express';
import dotenv from 'dotenv';
import database from './config/database.js';
import rootRouter from './routes/index.js';
import cookieParser from 'cookie-parser'

dotenv.config();
database.connect();

const PORT = process.env.PORT;
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json());
app.use(cookieParser())

app.use("/api", rootRouter);
app.use("/", (req, res) => res.status(404).send("Route not found!"))

app.listen(PORT, () => {
    console.log(`AS Garage Server running on ${PORT}`)
})