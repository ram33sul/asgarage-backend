import express from 'express';
import dotenv from 'dotenv';
import database from './config/database.js';
import rootRouter from './routes/index.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config();
database.connect();

const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser())

app.use("/api", rootRouter);
app.use("/", (req, res) => res.status(404).send("Route not found!"))

app.listen(PORT, () => {
    console.log(`AS Garage Server running on ${PORT}`)
})