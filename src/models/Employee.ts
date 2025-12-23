import mongoose, { Document, Schema } from 'mongoose';

// Interface TypeScript para Empleado
export interface IEmployee extends Document {
  name: string;
  position?: string;
  schedule?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose para Empleado
const employeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    position: {
      type: String,
      trim: true,
      maxlength: [50, 'La posición no puede exceder 50 caracteres'],
    },
    schedule: {
      type: String,
      trim: true,
      maxlength: [200, 'El horario no puede exceder 200 caracteres'],
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
employeeSchema.index({ name: 'text' });
employeeSchema.index({ active: 1 });
employeeSchema.index({ position: 1 });

// Export del modelo
export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);