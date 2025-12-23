import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface TypeScript para Usuario
export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'super-admin';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema de Mongoose para Usuario
const userSchema = new Schema<IUser>(
  {
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
    timestamps: true,
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

// Nota: No necesitamos índice adicional porque unique:true ya crea un índice
userSchema.index({ role: 1 });

// Hook pre-save para hashear contraseña
userSchema.pre('save', async function() {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Export del modelo
export const User = mongoose.model<IUser>('User', userSchema);
