import { Schema, model, Document } from 'mongoose';

export interface IIdentificationType extends Document {
  codigo: string;
  descripcion: string;
}

const schema = new Schema<IIdentificationType>({
  codigo: { type: String, required: true },
  descripcion: { type: String, required: true },
});

export default model<IIdentificationType>('IdentificationType', schema);
