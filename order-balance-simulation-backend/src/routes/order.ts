import { NextFunction, Router, Request, Response } from "express";
import Order, { OrderStatus, OrderType } from "../models/order";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderLists = await Order.find({});
        res.status(200).json(orderLists);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({
                error: true,
                data: e.message,
            });
        } else {
            res.status(500).json({
                error: true,
                data: "An Unexpected Error Occured",
            });
        }
    }
});

router.get("/cancel/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Order.findByIdAndUpdate(req.params.id, { status: OrderStatus.Canceled });
        if (result == null) {
            res.status(400).json(false);
        } else {
            res.status(200).json(true);
        }
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({
                error: true,
                data: e.message,
            });
        } else {
            res.status(500).json({
                error: true,
                data: "An Unexpected Error Occured",
            });
        }
    }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { symbol, price, type, total, status, quantity } = req.body;
        const order = new Order({
            symbol,
            price,
            type,
            total,
            status,
            quantity,
            created: new Date(),
        });
        if (status === OrderStatus.Filled) {
            order.completed = new Date();
        }
        const savedOrder = await order.save();
        if (!savedOrder) {
            res.status(400).json(false);
        } else {
            res.status(200).json(true);
        }
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({
                error: true,
                data: e.message,
            });
        } else {
            res.status(500).json({
                error: true,
                data: "An Unexpected Error Occured",
            });
        }
    }
});

export default router;
