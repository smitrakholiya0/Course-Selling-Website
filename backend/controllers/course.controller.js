import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


export const createCourse = async (req, res) => {

    const { title, description, price } = req.body;
    const adminId = req.adminId;

    try {
        if (!title || !description || !price) {
            return res.status(400).json({ errors: "all fields are required" });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: "Image is required" });
        }

        const image = req.files.image;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ errors: "image is required" })
        }

        const allowed_Format = ["image/png", "image/jpeg"]

        if (!allowed_Format.includes(image.mimetype)) {
            return res.status(400).json({ errors: "invalid image format, only png and jpeg are allowed" });
        }

        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ errors: "error uploading image" })
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url,
            },
            createdId: adminId,
        }
        const course = await Course.create(courseData);

        res.json({
            message: "Course created succsessfully",
            course,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error creating course" })

    }

}


export const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const adminId = req.adminId;

    const { title, description, price } = req.body;


    try {
        const findCourse = await Course.findOne({ _id: courseId, createdId: adminId });
        if (!findCourse) {
            return res.status(401).json({ message: "not found course" })
        }

        let updatedImage = findCourse.image;
        if (req.files && req.files.image) {
            const image = req.files.image;

            // Validate format
            const allowedFormat = ["image/png", "image/jpeg"];
            if (!allowedFormat.includes(image.mimetype)) {
                return res.status(400).json({ error: "Invalid image format. Only PNG and JPEG allowed." });
            }

            // Delete old image from Cloudinary
            if (findCourse.image?.public_id) {
                await cloudinary.uploader.destroy(findCourse.image.public_id);
            }

            // Upload new image
            const cloudRes = await cloudinary.uploader.upload(image.tempFilePath);
            updatedImage = {
                public_id: cloudRes.public_id,
                url: cloudRes.secure_url,
            };
        }



        const course = await Course.findOneAndUpdate({
            _id: courseId,
            createdId: adminId,
        },
            {
                title,
                description,
                price,
                image: updatedImage,
            },
             { new: true }
        );
        
        if (!course) {
            return res.status(404).json({message: "only update which you are created"})
        }
        res.status(200).json({ message: "course updated succsessfully", course })
    } catch (error) {
        res.status(500).json({ error: "Error updating course" })
        console.log("error in update Course", error);
    }

}


export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    try {

        const course = await Course.findOneAndDelete({ _id: courseId, createdId: adminId });

        if (!course) {
            return res.status(404).json({ error: "only delete which you are created" })
        }
        res.status(200).json({ message: "course deleted succsessfully" })
    } catch (error) {
        console.log("error in delete Course", error);
        res.status(500).json({ error: "Error deleting course" });
    }
}


export const getCourse = async (req, res) => {
    try {
        const courses = await Course.find({})
        res.status(201).json({ courses })
    } catch (error) {
        console.log("error in get Course", error);
        res.status(500).json({ error: "Error getting courses" });
    }
}


export const courseDetails = async (req, res) => {
    const { courseId } = req.params

    try {
        const course = await Course.findById({ _id: courseId })
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
        res.status(201).json({ course })
    } catch (error) {
        console.log("error in get Course details ", error);
        res.status(500).json({ error: "Error getting Course details " });
    }
}



import Stripe from "stripe"
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY)


export const buyCourses = async (req, res) => {
    const userId = req.userId;
    const { courseId } = req.params;


    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }
        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ errors: "user has already purchased this course" })
        }


        //stripe payment getway
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.price,
            currency: "usd",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });



        res.status(201).json({
            message: "course purchased succsessfully",
            course,
            clientSecret: paymentIntent.client_secret
        })

    } catch (error) {
        res.status(500).json({ error: "Error buying courses" });
        console.log("error in buying Courses", error);
    }
}