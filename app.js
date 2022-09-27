import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app =express();

const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;

import cors from 'cors';
import connectDB from './config/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import employeeRouter from './routes/employeeRouter.js';

app.use(cors());


connectDB(databaseUrl);

app.use(express.json());

app.use('/api/user', userRoutes)

app.use('/api/employee', employeeRouter)

app.listen(port, ()=>{
    console.log("Listening on port ", port);
})