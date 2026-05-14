import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  codigo: string;
  descripcion: string;
  precio_unitario: number;
  tiene_iva: boolean;
  descripcion_adicional?: string;
}

const schema = new Schema<IProduct>({
  codigo: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio_unitario: { type: Number, required: true },
  tiene_iva: { type: Boolean, required: true },
  descripcion_adicional: { type: String },
});

export default model<IProduct>('Product', schema);
