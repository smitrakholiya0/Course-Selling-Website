import { Admin } from "../models/admin.model.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";



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
        const existUser = await Admin.findOne({ email: email })
        if (existUser) {
            return res.status(400).json({ error: "admin already exists" })
        }
        // const newUser = await Admin.create({firstName,lastName,email,password})
        const newAdmin = Admin({ firstName, lastName, email, password: hashedPassword })
        await newAdmin.save()

        res.status(201).json({ message: "admin succsessfully created", newAdmin })

    } catch (error) {
        res.status(500).json({ message: "error in signup" })
        console.log("error in signup", error);

    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email: email })
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!admin || !isPasswordCorrect) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id }, config.JWT_ADMIN_PASSWORD, { expiresIn: "1d" })

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        };

        res.cookie("jwt", token, cookieOptions)
        res.status(201).json({ message: "login succsessfully", admin, token });

    } catch (error) {
        res.status(500).json({ message: "error in login" });
        console.log("error in login", error);
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
