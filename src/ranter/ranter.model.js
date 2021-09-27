import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  userId: {
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
  verificationToken: {
    type: String,
    index: true,
  },

  settings: {
    notAllowedTags: {
      type: Array,
      default: [],
    },
  },

}, { timestamp: true });

const UsersCollection = mongoose.model('Users', UserSchema);

export default UsersCollection;
