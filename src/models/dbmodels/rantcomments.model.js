import mongoose from 'mongoose';

const RantCommentSchema = new mongoose.Schema({

  rantId: String,

  rantCommentId: {
    type: String,
    unique: true,
  },

  parentCommentId: {
    type: String,
    index: true,
  },

  rantCommenter: {
    type: String,
    index: true,
  },

  when: Number,

  rantOriginalPoster: {
    type: Boolean,
    default: false,
  },

  rantComment: String,

  rantCommentUpvote: [mongoose.Types.ObjectId],
  rantCommentDownvote: [mongoose.Types.ObjectId],

  deleted: {
    type: Boolean,
    default: false,
    index: true,
  },

}, { timestamp: true });

const rantComments = mongoose.model('rantcomments', RantCommentSchema);

export default rantComments;
