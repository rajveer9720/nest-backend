import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true }
})
export class User {
  @Prop({ 
    required: true, 
    unique: true, 
    trim: true,
    minlength: 3,
    maxlength: 30 
  })
  username: string;

  @Prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  })
  email: string;

  @Prop({ 
    required: true,
    minlength: 6 
  })
  password: string;

  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 50 
  })
  firstName: string;

  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 50 
  })
  lastName: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ 
    enum: ['user', 'admin'], 
    default: 'user' 
  })
  role: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop([{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days in seconds
    }
  }])
  refreshTokens: Array<{
    token: string;
    createdAt: Date;
  }>;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerificationExpires: Date;

  @Prop()
  lastLogin: Date;

  @Prop({ default: true })
  isActive: boolean;

  // Methods (these will be added to the schema)
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createPasswordResetToken: () => string;
  createEmailVerificationToken: () => string;
  removeExpiredRefreshTokens: () => void;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
UserSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

// Generate email verification token
UserSchema.methods.createEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return verificationToken;
};

// Remove expired refresh tokens
UserSchema.methods.removeExpiredRefreshTokens = function(): void {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(tokenObj => 
    new Date(tokenObj.createdAt).getTime() + (7 * 24 * 60 * 60 * 1000) > now.getTime()
  );
};
