import mongoose from 'mongoose';

const RantCommentSchema = new mongoose.Schema({

  rantId: String,

  rantCommentId: {
    type: String,
    unique: true,
  },

  rantCommenter: {
    type: String,
    index: true,
  },

  when: Number,

  rantOriginalPosterComment: Boolean,
  rantComment: String,

  rantCommentUpvote: [mongoose.Types.ObjectId],
  rantCommentDownvote: [mongoose.Types.ObjectId],

}, { timestamp: true });

const rantComments = mongoose.model('rantcomments', RantCommentSchema);

export default rantComments;
