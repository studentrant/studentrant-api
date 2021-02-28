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

  async validateParentCommentId(parentCommentId) {
    return this.replyRantDbUtils.findOneReply({ key: 'parentCommentId', value: parentCommentId });
  }

  async getReplies({ numRequest, parentCommentId = null, rantId }) {
    const replyRantCount = await this.replyRantDbUtils.getRepliesCount({ rantId, parentCommentId });
    const calculateNext = rantEnums.RANTS_LOAD_LIMIT * (numRequest + 1);
    const hasMore = calculateNext < replyRantCount;

    const result = await this.replyRantDbUtils.getReplies(
      {
        rantId,
        parentCommentId,
      },
      {
        skip: rantEnums.RANTS_LOAD_LIMIT * numRequest,
        limit: rantEnums.RANTS_LOAD_LIMIT,
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
}
