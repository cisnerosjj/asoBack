import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript para Producto
export interface IProduct extends Document {
  name: string;
  credits: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose para Producto
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
      unique: true,
    },
    credits: {
      type: Number,
      required: [true, 'Los créditos son requeridos'],
      min: [0, 'Los créditos no pueden ser negativos'],
      max: [9999, 'Los créditos no pueden exceder 9999'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para búsquedas optimizadas
productSchema.index({ name: 'text' });
productSchema.index({ active: 1 });
productSchema.index({ credits: 1 });

// Export del modelo
export const Product = mongoose.model<IProduct>('Product', productSchema);