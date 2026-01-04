import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript para Socio
export interface IPartner extends Document {
  name: string;
  nickname?: string; // Apodo
  dni?: string; // DNI o NIE español
  passport?: string; // Pasaporte
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
    nickname: {
      type: String,
      trim: true,
      maxlength: [50, 'El apodo no puede exceder 50 caracteres'],
    },
    dni: {
      type: String,
      trim: true,
      uppercase: true,
      match: [
        /^[0-9]{8}[A-Z]$/,
        'El DNI debe tener 8 dígitos seguidos de una letra mayúscula'
      ],
    },
    passport: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'El pasaporte no puede exceder 20 caracteres'],
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
partnerSchema.index({ name: 'text', nickname: 'text' });
partnerSchema.index({ active: 1 });
partnerSchema.index({ dni: 1 }, { sparse: true });
partnerSchema.index({ passport: 1 }, { sparse: true });

// Export del modelo
export const Partner = mongoose.model<IPartner>('Partner', partnerSchema);