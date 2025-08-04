import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js"

import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cors from "cors";

const app = express()
app.use(cookieParser());
dotenv.config();
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;
app.use(express.json()); // For parsing application/json
app.use(cookieParser());
//for upload file
app.use(
  fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.use(cors({
     origin: process.env.FRONTEND_URI,
     credentials: true,
     allowedHeaders: ["content-type","authorization"],
     exposedHeaders:["Authorization"],
     optionsSuccessStatus : 200,
}))

//coudinary configration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret
});
//mongo connection
try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error connecting to MongoDB: ", error); 
}
//routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

