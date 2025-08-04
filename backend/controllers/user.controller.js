import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";



export const signup = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;



    const userSchema = z.object({
        firstName: z.string().min(3, { message: "First must be atleast 3 characters" }),
        lastName: z.string().min(3, { message: "Last must be atleast 3 characters" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "Password must be at least 6 characters" })
    });


    const validateData = userSchema.safeParse(req.body);


    if (!validateData.success) {
        return res.status(400).json({ error: validateData.error.issues.map(err => err.message) })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const existUser = await User.findOne({ email: email })
        if (existUser) {
            return res.status(400).json({ error: "user already exists" })
        }
        // const newUser = await User.create({firstName,lastName,email,password})
        const newUser = User({ firstName, lastName, email, password: hashedPassword })
        await newUser.save()

        res.status(201).json({ message: "user succsessfully created", newUser })

    } catch (error) {
        res.status(500).json({ message: "error in signup" })
        console.log("error in signup", error);

    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "invalid credentials" });

        }

        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            firstName: user.firstName
        }, config.JWT_USER_PASSWORD, { expiresIn: "1d" })

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        };

        res.cookie("jwt", token, cookieOptions)
        res.status(201).json({ message: "login succsessfully", user, token });

    } catch (error) {
        res.status(500).json({ message: "error in login" });
        console.log("error in login ", error);
    }
}

export const logout = (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.status(401).json({ message: "No token provided, please login first" });
        }
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });
        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        res.status(500).json({ message: "Error in logout" });
        console.log("Error in logout", error);
    }
};



export const purchases = async (req, res) => {
    const userId = req.userId;

    console.log(userId);
    
    try {
        const purchased = await Purchase.find({ userId })
        console.log(purchased);

        let purchasedCourseId = [];

        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseId.push(purchased[i].courseId);
        }

        const courseData = await Course.find({
            _id: { $in: purchasedCourseId }
        });

        res.status(200).json({ purchased, courseData });

    } catch (error) {
        res.status(500).json({ message: "error in get all purchases" })
        console.log("error in get all purchases", error);
    }
}