import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {

    const authHeader= req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("bearer ")) {
        return res.status(401).json({ error: "Not token provided" })
    }

    const token = authHeader.split(" ")[1];
    
    try { 
        const decoded = jwt.verify(token,config.JWT_USER_PASSWORD)
        req.userId = decoded._id;    
        next();
    } catch (error) {
        res.status(500).json({ error:"invalid Token or expired" })
        console.log("invalid token or expired token ",+error);
    }
}

export default userMiddleware;