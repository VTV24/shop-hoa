import { Schema, model, Document, connection } from 'mongoose';

export type ILoaiDocument = IOrder & Document;

const orderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    address: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    detail: { type: Array, required: true },
    isConfirm: { type: Boolean, default: false },
});

if (process.env.NODE_ENV === 'development') {
    delete connection.models.orders;
}

const Order = model<IOrder>('orders', orderSchema);
export default Order;
