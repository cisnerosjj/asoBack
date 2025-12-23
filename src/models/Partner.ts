import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript para Socio
export interface IPartner extends Document {
  name: string;
  email?: string;
  type: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose para Socio
const partnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingresa un email válido'
      ],
    },
    type: {
      type: String,
      required: [true, 'El tipo de socio es requerido'],
      trim: true,
      enum: ['Regular', 'VIP', 'Empresa', 'Familiar'],
      default: 'Regular',
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
partnerSchema.index({ name: 'text' });
partnerSchema.index({ active: 1 });

// Export del modelo
export const Partner = mongoose.model<IPartner>('Partner', partnerSchema);