import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from "cors";
import connectDB from "./config/db";
import userRouter from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import otpRouter from './routes/otpRoutes';
import imageRouter from './routes/imageRoutes';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// Connect to DB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(morgan('dev'));


app.use('/api/user', userRouter);
app.use('/api/otp', otpRouter)
app.use('/api/image', imageRouter)

const PORT =  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port  :${PORT}`);
});
