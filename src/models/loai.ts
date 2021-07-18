import { Schema, model, Document, connection } from 'mongoose';

export type ILoaiDocument = ILoai & Document;

const loaiSchema = new Schema<ILoai>({
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: String,
});

if (process.env.NODE_ENV === 'development') {
    delete connection.models.loaihoas;
}

const Loai = model<ILoai>('loaihoas', loaiSchema);
export default Loai;
