import { Schema, model, Document, connection } from 'mongoose';

export type IHoaDocument = IHoa & Document;

const hoaSchema = new Schema<IHoa>({
    typeId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    count: { type: Number, default: 0 },
    description: String,
});

hoaSchema.index({ name: 'text', description: 'text' });

if (process.env.NODE_ENV === 'development') {
    delete connection.models.hoas;
}

const Hoa = model<IHoa>('hoas', hoaSchema);

Hoa.createIndexes();
export default Hoa;
