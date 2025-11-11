import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  isAccountVerified: { type: Boolean, default: false },
  verifyOTP: { type: String, default: "" },
  verifyOTPExpireAt: { type: Number, default: 0 },
  resetPasswordOTP: { type: String, default: '' },
  resetOTPExpireAt: { type: Number, default: 0 },
}, {
    timestamps: true
});

export const User = mongoose.models.user || mongoose.model("user", userSchema);