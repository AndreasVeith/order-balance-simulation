import { Schema, model, Document, Model } from "mongoose";

export enum OrderStatus {
    Pending,
    Filled,
    Canceled,
}

export enum OrderType {
    BuyLimit,
    SellLimit,
    BuyMarket,
    SellMarktet,
    Buy,
    Sell,
}

export interface IOrder extends Document {
    symbol: String;
    type: OrderType;
    price: Number;
    quantity: Number;
    total: Number;
    status: OrderStatus;
    created: Date;
    completed: Date;
}

export interface IOrderModel extends Model<IOrder> {}

const OrderSchema = new Schema<IOrder>({
    symbol: {
        type: String,
        required: [true, "Symbol is Required"],
    },
    type: {
        type: Number,
        required: [true, "Type is Required"],
    },
    price: {
        type: Number,
        required: [true, "Price is Required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is Required"],
    },
    total: {
        type: Number,
        required: [true, "Total is Required"],
    },
    status: {
        type: Number,
        required: [true, "Status is Required"],
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    completed: {
        type: Date,
        required: false,
    },
});

OrderSchema.index({ price: 1 });
OrderSchema.index({ symbol: 1 });

const Order: IOrderModel = model<IOrder, IOrderModel>("order", OrderSchema);

export default Order;
