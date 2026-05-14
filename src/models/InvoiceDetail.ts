import { Schema, model, Document, Types } from 'mongoose';

export interface IInvoiceDetail extends Document {
  factura_id: Types.ObjectId;
  producto_id: Types.ObjectId;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  valor_iva: number;
}

const schema = new Schema<IInvoiceDetail>({
  factura_id: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  producto_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  valor_iva: { type: Number, required: true },
});

export default model<IInvoiceDetail>('InvoiceDetail', schema);
