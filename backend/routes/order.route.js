import express from "express"
import userMiddleware from "../middleware/user.mid.js"
import { getOrder } from "../controllers/order.controller.js";

const router = express.Router()

router.post("/",userMiddleware,getOrder)


export default router;