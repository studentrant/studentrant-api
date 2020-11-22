import mongoose from 'mongoose';

export default class RantDbUtils {
  constructor(rantsCollection, usersCollection) {
    this.RantsCollection = rantsCollection;
    this.UsersCollection = usersCollection;
  }

  async saveRant(data) {
    await (new this.RantsCollection(data).save());
    return this.RantsCollection.findOne({ rantId: data.rantId }, {
      _id: false,
      __v: false,
    }).lean();
  }

  findOneRant(ops) {
    return this.RantsCollection.findOne(
      ops.query,
      ops.project,
    ).lean();
  }

  deleteOneRant(rantId) {
    return this.RantsCollection.updateOne(
      { rantId },
      { $set: { deleted: true } },
    ).lean();
  }

  editOneRant({ query, operation }) {
    const extraOption = {
      new: true,
      fields: {
        _id: false,
        __v: false,
        'edit.editHistory.diff._id': false,
        'edit.editHistory._id': false,
      },
    };
    return this.RantsCollection.findOneAndUpdate(
      query,
      operation,
      extraOption,
    ).lean();
  }

  findOneVoter(voteType, rantId, rantVoterId) {
    return this.RantsCollection.findOne({
      rantId,
      [voteType]: { $in: mongoose.Types.ObjectId(rantVoterId) },
    }).lean();
  }

  removeOneVote(voteType, rantId, rantVoterId) {
    return this.RantsCollection.findOneAndUpdate(
      { rantId },
      { $pull: { [voteType]: mongoose.Types.ObjectId(rantVoterId) } },
      {
        new: true,
        fields: {
          'edit.editHistory.diff._id': false,
          'edit.editHistory._id': false,
          _id: false,
          __v: false,
        },
      },
    ).lean();
  }

  async upvote(rantId, rantUpvoterId) {
    // remove vote from downtvoted rant, if user want's to
    // upvote the rant after downvoting it
    await this.RantsCollection.updateOne(
      { rantId, rantDownvote: { $in: mongoose.Types.ObjectId(rantUpvoterId) } },
      { $pull: { rantDownvote: mongoose.Types.ObjectId(rantUpvoterId) } },
    );

    return this.RantsCollection.findOneAndUpdate(
      { rantId },
      { $addToSet: { rantUpvote: mongoose.Types.ObjectId(rantUpvoterId) } },
      {
        new: true,
        fields: {
          'edit.editHistory.diff._id': false,
          'edit.editHistory._id': false,
          _id: false,
          __v: false,
        },
      },
    ).lean();
  }

  async downvote(rantId, rantDownvoterId) {
    // remove vote from upvoted rant, if user want's to
    // downvote the rant after upvoting it
    await this.RantsCollection.updateOne(
      { rantId, rantUpvote: { $in: mongoose.Types.ObjectId(rantDownvoterId) } },
      { $pull: { rantUpvote: mongoose.Types.ObjectId(rantDownvoterId) } },
    ).lean();

    return this.RantsCollection.findOneAndUpdate(
      { rantId },
      { $addToSet: { rantDownvote: mongoose.Types.ObjectId(rantDownvoterId) } },
      {
        new: true,
        fields: {
          'edit.editHistory.diff._id': false,
          'edit.editHistory._id': false,
          _id: false,
          __v: false,
        },
      },
    ).lean();
  }

  async get(rantId) {
    return this.RantsCollection.findOne(
      { rantId },
      {
        _id: false,
        'rantPoster._id': false,
        'rantComments._id': false,
        'edit._id': false,
        'edit.editHistory._id': false,
        rantComments: false,
        deleted: false,
      },
    ).lean();
  }

  async findAllRants(pipeline) {
    return this.RantsCollection.aggregate(
      [
        pipeline.getRants,
        pipeline.skipAlreadyViewed,
        pipeline.limitToDefinedEnum,
        pipeline.projectRant,
        pipeline.getRantPosters,
        pipeline.spreadUsers,
        pipeline.filterOutUnwanted,
        pipeline.limitSearchByVerifiedUsers,
      ],
    );
  }

  async getTotalRants(query) {
    return this.RantsCollection.countDocuments(query);
  }
}
