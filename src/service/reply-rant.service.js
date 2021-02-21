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
        update: { childCommentId: rantCommentId },
      },
    );

    return { ...result, parentCommentId };
  }

  async getReplies({ numRequest, parentCommentId, rantId }) {
    if (!parentCommentId) {
      return this.rantDbUtils.getRepliesAggregator({

        matchQuery: { $match: { rantId } },

        unwindCommentsArray: { $unwind: '$rantComments' },

        removeNonNullValues: {
          $redact: {
            $cond: {
              if: { $eq: ['$parentCommentId', null] },
              then: '$$PRUNE',
              else: '$$DESCEND',
            },
          },
        },

        skipAlreadyRead: { $skip: numRequest * 20 },
        limit: { $limit: 20 },

        lookupIdsInComments: {
          from: 'rantcomments',
          localField: 'rantComments.rantCommentId',
          foriegnField: 'rantCommentId',
          as: 'rantcomments',
        },

        projectValues: {
          $project: { _id: false },
        },

      });
    }
    return false;
  }
}
