import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/userroutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));
app.use(express.urlencoded({ extended: true }));

//API Endpoints
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.get('/',(req,res)=>{
    res.send("Hello World!");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`);
})