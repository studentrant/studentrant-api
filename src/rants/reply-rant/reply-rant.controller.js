import rantConstants from '../rant.constant.js';

import { GoneException, NotFoundException, UnAuthorizedAccessException } from '../../core/exceptions.service.js';
import ReplyRantService from './reply-rant.service.js';

import PostRant from '../post-rant/post-rant.controller.js';

export default class ReplyRant extends PostRant {
  constructor({ Collections, DBUtils, Utils }) {
    super(
      {
        Collections,
        DBUtils,
        Utils,
      },
    );

    this.replyRantService = new ReplyRantService(
      new DBUtils.RantDbUtils(
        Collections.RantsCollection,
        Collections.UsersCollection,
      ),
      new DBUtils.RantReplyDbUtils(Collections.RantReplyCollection),
    );
  }

  async #validateRantCommentForModification(username, replyRantId) {
    await this.validateRantCommentId({ rantCommentId: replyRantId });

    // check if the reply to modify was created by the user
    // trying to modify it
    const result = await this.replyRantService.validateRantCommentExistence(
      {
        rantCommenter: username,
        rantCommentId: replyRantId,
      },
    );

    if (!result) {
      throw UnAuthorizedAccessException(
        rantConstants.RANT_REPLY_UNAUTHORIZED_OPERATION,
      );
    }
  }

  /* eslint-disable no-param-reassign , prefer-destructuring */

  #replyVoteTransform(value) {
    value.childComment = value.childComments[0];

    delete value.childComments;

    this.rantCountVoteDelete(value);

    if (value.childComment) this.rantCountVoteDelete(value.childComment.collapsedComment);

    return value;
  }
  /* eslint-enable no-param-reassign , prefer-destructuring */

  async validateRantCommentId(value) {
    const validatedRantCommentId = await this.replyRantService.validateRantCommentExistence(value);

    if (!validatedRantCommentId) {
      throw NotFoundException(
        rantConstants.RANT_REPLY_RANT_COMMENT_ID_INVALID,
      );
    }

    if (validatedRantCommentId.deleted) {
      throw GoneException(
        rantConstants.RANT_REPLY_RANT_ALREADY_DELETED,
      );
    }
  }

  async replyRant(req, res, next) {
    const { rantId } = req.params;
    const { parentCommentId = null, replyRant, when } = req.body;

    try {
      await this.validateRantForModification(rantId);

      const username = this.Utils.ExtractSessionObjectData(req, 'username');
      const { rantPoster } = await this.postRantService.getRant(rantId);

      const result = await this.replyRantService.createReply(
        {
          when,
          rantId,
          username,
          rantPoster,
          parentCommentId,
          rantComment: replyRant,
          rantCommentId: this.Utils.GenerateUniqueId(),
        },
      );

      // write a logger service
      // emit event or not ?
      Promise.resolve(
        this.trendingService.createTrendIfExists({
          text: result.rantComment,
          identifier: result.rantCommentId,
          col: 'rantcomments',
        }),
      ).catch((ex) => console.error(ex)); // eslint-disable-line

      this.rantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async showReply(req, res, next) {
    const { numRequest, parentCommentId } = req.query;
    const { rantId } = req.params;

    try {
      // in this case we just want to check if the id is valid
      // ::showReply does not modify a comment
      await this.validateRantForModification(rantId);
      await this.validateRantCommentId({ parentCommentId });

      const result = await this.replyRantService.getReplies(
        {
          rantId,
          numRequest,
          parentCommentId,
        },
      );

      if (!result || result.replies.length === 0) {
        throw NotFoundException(
          rantConstants.RANT_REPLY_COMMENT_READ_EXHAUSTED,
        );
      }

      result.replies.forEach(this.#replyVoteTransform.bind(this));

      return res.status(200).json(
        {
          status: 200,
          message: result,
        },
      );
    } catch (ex) {
      return next(ex);
    }
  }

  async deleteReply(req, res, next) {
    const { replyRantId } = req.params;

    try {
      const username = this.Utils.ExtractSessionObjectData(req, 'username');
      await this.#validateRantCommentForModification(username, replyRantId);
      await this.replyRantService.deleteReply(replyRantId);

      return res.status(200).json({
        status: 200,
        message: rantConstants.RANT_REPLY_SUCCESSFULLY_DELETED,
      });
    } catch (ex) {
      return next(ex);
    }
  }

  async editReply(req, res, next) {
    const { replyRant } = req.body;
    const { replyRantId } = req.params;

    try {
      const username = this.Utils.ExtractSessionObjectData(req, 'username');
      await this.#validateRantCommentForModification(username, replyRantId);

      const result = await this.replyRantService.editReply({ replyRantId, replyRant });

      if (!result) {
        throw NotFoundException(
          rantConstants.RANT_COMMENT_CANNOT_EDIT,
        );
      }

      // write a logger service
      // emit event or not ?
      Promise.resolve(
        this.trendingService.createTrendIfExists({
          text: result.rantComment,
          identifier: result.rantCommentId,
          col: 'rantcomments',
        }),
      ).catch((ex) => console.error(ex));  // eslint-disable-line

      return res.status(200).json(
        {
          status: 200,
          message: result,
        },
      );
    } catch (ex) {
      return next(ex);
    }
  }
}
