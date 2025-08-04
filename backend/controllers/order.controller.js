import { Order } from "../models/order.model.js"
import { Purchase } from "../models/purchase.model.js";


export const getOrder = async (req, res) => {
    const paymentInfo = req.body
    console.log(paymentInfo);

    try {

        const orderInfo = await Order.create(paymentInfo)
        const userId = orderInfo?.userId;
        const courseId = orderInfo?.courseId;

        if (orderInfo) {
            // await Purchase.create({ userId, courseId })
            const newPurchase = new Purchase({ userId, courseId })
            await newPurchase.save()
        }

        res.status(201).json({ message: "Order Details: ", orderInfo });

    } catch (error) {
        console.log("Error in order: ", error);
        res.status(401).json({ errors: "Error in order creation" });
    }


}