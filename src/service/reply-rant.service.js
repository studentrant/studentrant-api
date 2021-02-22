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
      parentCommentId,
    },
  ) {
    const result = await this.replyRantDbUtils.saveReply(
      {
        when,
        rantId,
        rantComment,
        rantCommentId,
        rantCommenter: username,
        rantOriginalPoster: username === rantPoster,
      },
    );

    /**
     * no parent comment id simply means
     * the comment is a root comment
     * */
    if (!parentCommentId) {
      await this.rantDbUtils.referenceNoParentComment(
        {
          match: { rantId },
          update: { rantCommentId },
        },
      );
      return result;
    }

    await this.rantDbUtils.referenceParentComment(
      {
        match: { rantId, parentCommentId },
        update: { childCommentId: rantCommentId, rantCommentId },
      },
    );

    return { ...result, parentCommentId };
  }

  async getReplies({ numRequest, parentCommentId, rantId }) {
    let result;
    if (!parentCommentId) {
      result = this.rantDbUtils.getRepliesAggregator({

        matchQuery: { $match: { rantId } },
        showRantCommentsOnly: { $project: { rantComments: true } },

        // this will return an empty array
        // if rantComments is an empty array
        unwindCommentsArray: { $unwind: '$rantComments' },

        removeNonNullValues: {
          $redact: {
            $cond: {
              if: { $eq: ['$rantComments.parentCommentId', null] },
              then: '$$KEEP',
              else: '$$PRUNE',
            },
          },
        },

        skipAlreadyRead: { $skip: numRequest * 20 },
        limit: { $limit: 20 },

        lookupIdsInComments: {
          $lookup: {
            from: 'rantcomments',
            localField: 'rantComments.rantCommentId',
            foreignField: 'rantCommentId',
            as: 'rantReplies',
          },
        },

        removeRantCommentsField: { $project: { rantComments: false, _id: false } },
        unwindRantCommentsCollection: { $unwind: '$rantReplies' },

        projectValues: {
          $project: { rantReplies: true },
        },
      });
      return result;
      // result = result.flatMap();
    }
    return false;
  }
}
