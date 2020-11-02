import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: String,
  dateOfReg: {
    default: Date.now(),
    type: Number,
  },
  verified: {
    default: false,
    type: Boolean,
  },
  completeReg: {
    default: false,
    type: Boolean,
  },
  verificationLink: {
    type: String,
    index: true,
  },
}, { timestamp: true });

const usersCollection = mongoose.model('Users', UserSchema);

export default usersCollection;
