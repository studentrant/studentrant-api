import mongoose from 'mongoose';

const RantCommentSchema = new mongoose.Schema({
  rantId: String,
  rantCommentId: {
    type: String,
    unique: true,
  },
  rantCommenter: String,
  rantComment: String,
  rantCommentUpvote: Number,
  rantCommentDownVote: Number,
});

const rantComments = mongoose.model('rantcomments', RantCommentSchema);

export default rantComments;
