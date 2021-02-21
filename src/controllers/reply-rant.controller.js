import { v4 as uuid } from 'uuid';

import * as constants from '../constants/index.constant.js';

import { NotFoundException } from '../core/exceptions.service.js';
import ReplyRantService from '../service/reply-rant.service.js';

import PostRant from './post-rant.controller.js';

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
          rantCommentId: uuid(),
        },
      );

      // write a logger service
      // emit event or not ?
      Promise.resolve(
        this.trendingService.createTrendIfExists({
          text: result.rantComment,
          identifier: result.rantId,
          col: 'rantcomments',
        }),
      ).catch((ex) => console.error(ex));

      this.rantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async getReply(req, res, next) {
    const { numRequest, parentCommentId } = req.query;
    const { rantId } = req.params;

    try {
      await this.validateRantForModification(rantId);

      const result = await this.replyRantService.getReplies(
        {
          rantId,
          numRequest,
          parentCommentId,
        },
      );

      if (!result) {
        throw NotFoundException(
          constants.rantConstants.RANT_READ_EXHAUSTED,
        );
      }
      return res.status(200).json({ status: 200 });
    } catch (ex) {
      return next(ex);
    }
  }
}
