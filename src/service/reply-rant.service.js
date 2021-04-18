import { rantEnums } from '../enums/rants.enums.js';

export default class ReplyRantService {
  constructor(rantDbUtils, replyRantDbUtils) {
    this.rantDbUtils = rantDbUtils;
    this.replyRantDbUtils = replyRantDbUtils;
  }

  async createReply(
    {
      when,
      rantId,
      username,
      rantPoster,
      rantComment,
      rantCommentId,
      parentCommentId = null,
    },
  ) {
    const result = await this.replyRantDbUtils.saveReply(
      {
        when,
        rantId,
        rantComment,
        rantCommentId,
        parentCommentId,
        rantCommenter: username,
        rantOriginalPoster: username === rantPoster,
      },
    );
    return { ...result, parentCommentId };
  }

  async validateRantCommentExistence(value) {
    return this.replyRantDbUtils.getReply({ query: value });
  }

  async validateRantCommentIdDeleter(username, rantCommentId) {
    return this.replyRantDbUtils.findIfUserIsCommenter({ rantCommenter: username, rantCommentId });
  }

  async deleteReply(rantCommentId) {
    return this.replyRantDbUtils.deleteUserReply(rantCommentId);
  }

  async editReply({ replyRantId, replyRant }) {
    return this.replyRantDbUtils.editUserReply({ replyRantId, replyRant });
  }

  async getRantRepliesFromAggregation({
    matchBy, numRequest, calculateNext, replyRantCount,
  }) {
    const hasMore = calculateNext < replyRantCount;
    const result = await this.replyRantDbUtils.findAllReplies(
      {
        matchComments: { $match: matchBy },
        skipUnwanted: { $skip: rantEnums.RANTS_LOAD_LIMIT * numRequest },
        limitComment: { $limit: rantEnums.RANTS_LOAD_LIMIT },
        getNReplyCountAndFirstNReply: {
          $lookup: {
            let: { rant_comment_id: '$rantCommentId' },
            from: 'rantcomments',
            pipeline: [
              {
                $match: { $expr: { $eq: ['$parentCommentId', '$$rant_comment_id'] } },
              },
              {
                $project: {
                  fullDocument: '$$CURRENT',
                  rantCommentUpvoteSize: { $size: '$rantCommentUpvote' },
                },
              },
              {
                $sort: { rantCommentUpvoteSize: -1 },
              },
              {
                $group: {
                  _id: '$fullDocument.rantId',
                  shallowNestedCommentCount: { $sum: 1 },
                  mostUpvoted: { $first: '$$ROOT' },
                },
              },
              {
                $project: { collapsedComment: '$mostUpvoted.fullDocument', commentCountRelativeToParentId: '$shallowNestedCommentCount' },
              },
            ],
            as: 'childComments',
          },
        },
        removeUnwanted: { $project: { _id: false, 'childComments._id': false, 'childComments.collapsedComment._id': false } },
        // getChildCommentAsObject : { $unwind: "$childComments" }
      },
    );
    return {
      replies: result,
      hasMore,
      page: {
        totalRant: replyRantCount,
        remainingRant: Math.abs(replyRantCount - (
          result.length < rantEnums.RANTS_LOAD_LIMIT
            ? replyRantCount
            : calculateNext
        )),
      },
    };
  }

  async getReplies({ numRequest, parentCommentId = null, rantId }) {
    return this.getRantRepliesFromAggregation(
      {
        numRequest,
        matchBy: { rantId, parentCommentId },
        replyRantCount: await this.replyRantDbUtils.getRepliesCount({ rantId, parentCommentId }),
        calculateNext: rantEnums.RANTS_LOAD_LIMIT * (numRequest + 1),
      },
    );
  }
}
