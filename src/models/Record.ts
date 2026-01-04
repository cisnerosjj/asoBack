import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript para Registro
export interface IRecord extends Document {
  partner: mongoose.Types.ObjectId;
  partnerName: string;
  product: mongoose.Types.ObjectId;
  productName: string;
  employee: mongoose.Types.ObjectId;
  employeeName: string;
  quantity: number;
  totalCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose para Registro
const recordSchema = new Schema<IRecord>(
  {
    partner: {
      type: Schema.Types.ObjectId,
      ref: 'Partner',
      required: [true, 'El socio es requerido'],
    },
    partnerName: {
      type: String,
      required: [true, 'El nombre del socio es requerido'],
      trim: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es requerido'],
    },
    productName: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      trim: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'El empleado es requerido'],
    },
    employeeName: {
      type: String,
      required: [true, 'El nombre del empleado es requerido'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [1, 'La cantidad debe ser mayor a 0'],
      max: [1000, 'La cantidad no puede exceder 1000'],
    },
    totalCredits: {
      type: Number,
      required: [true, 'El total de créditos es requerido'],
      min: [0, 'El total de créditos no puede ser negativo'],
    },
  },
  {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para búsquedas optimizadas
recordSchema.index({ partner: 1, createdAt: -1 });
recordSchema.index({ product: 1, createdAt: -1 });
recordSchema.index({ employee: 1, createdAt: -1 });
recordSchema.index({ createdAt: -1 });
recordSchema.index({ partnerName: 'text', productName: 'text', employeeName: 'text' });

// Virtual para popular datos relacionados
recordSchema.virtual('partnerDetails', {
  ref: 'Partner',
  localField: 'partner',
  foreignField: '_id',
  justOne: true,
});

recordSchema.virtual('productDetails', {
  ref: 'Product',
  localField: 'product',
  foreignField: '_id',
  justOne: true,
});

// Export del modelo
export const Record = mongoose.model<IRecord>('Record', recordSchema);