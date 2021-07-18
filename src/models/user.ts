import { Schema, model, Document, connection } from 'mongoose';

export type IUserDocument = IUser & Document;

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    image: String,
    address: String,
    phone: String,
});

if (process.env.NODE_ENV === 'development') {
    delete connection.models.users;
}

const User = model<IUser>('users', userSchema);
export default User;
