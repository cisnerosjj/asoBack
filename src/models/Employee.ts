import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface TypeScript para Empleado
export interface IEmployee extends Document {
  name: string;
  username: string;
  password: string;
  position?: string;
  schedule?: string;
  role: 'admin' | 'super-admin';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
    username: {
      type: String,
      required: [true, 'El nombre de usuario es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
      maxlength: [50, 'El nombre de usuario no puede exceder 50 caracteres'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No incluir contraseña en queries por defecto
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
    role: {
      type: String,
      enum: ['admin', 'super-admin'],
      default: 'admin',
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
    toJSON: { 
      virtuals: true,
      transform: function(_doc: any, ret: any) {
        if (ret.password) {
          ret.password = undefined;
        }
        return ret;
      }
    },
    toObject: { virtuals: true },
  }
);

// Índices para búsquedas optimizadas
employeeSchema.index({ name: 'text' });
employeeSchema.index({ active: 1 });
employeeSchema.index({ position: 1 });
employeeSchema.index({ role: 1 });

// Hook pre-save para hashear contraseña
employeeSchema.pre('save', async function() {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
employeeSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Export del modelo
export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);