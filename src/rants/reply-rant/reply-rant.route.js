import express from 'express';

import ReplyRantController from './reply-rant.controller.js';
import RantValidators from '../rant.middleware.js';

import RantsCollection from '../post-rant/post-rant.model.js';
import RantReplyCollection from './reply-rant.model.js';
import TrendsCollection from '../trends/trends.model.js';
import UsersCollection from '../../ranter/ranter.model.js';
import RantReplyDbUtils from './reply-rant.db.util.js';
import RantDbUtils from '../post-rant/post-rant.db.util.js';
import TrendDbUtils from '../trends/trends.db.util.js';
import UserDbUtils from '../../ranter/ranter.db.util.js';

import { Utils } from '../../utils/index.util.js';

export default class ReplyRantRoute {
  constructor() {
    const routeHandler = express.Router();

    this.controller = new ReplyRantController({
      Collections: {
        RantsCollection, UsersCollection, TrendsCollection, RantReplyCollection,
      },
      DBUtils: {
        RantDbUtils, UserDbUtils, TrendDbUtils, RantReplyDbUtils,
      },
      Utils,
    });

    this.rantValidators = new RantValidators();

    routeHandler.post('/:rantId', this.replyReply());
    routeHandler.get('/:rantId', this.showReply());
    routeHandler.delete('/delete/:replyRantId', this.deleteReply());
    routeHandler.patch('/edit/:replyRantId', this.editReply());

    return routeHandler;
  }

  static API_PATH = '/reply'

  showReply() {
    return [
      this.rantValidators.verifyReplyRantParams,
      this.rantValidators.verifyNumRequest,
      this.controller.showReply.bind(this.controller),
    ];
  }

  deleteReply() {
    return [
      this.rantValidators.verifyReplyRantId,
      this.controller.deleteReply.bind(this.controller),
    ];
  }

  editReply() {
    return [
      this.rantValidators.verifyReplyRant,
      this.controller.editReply.bind(this.controller),
    ];
  }

  replyReply() {
    return [
      this.rantValidators.verifyRantId,
      this.rantValidators.verifyReplyRant,
      this.rantValidators.verifyWhen,
      this.controller.replyRant.bind(this.controller),
    ];
  }
}
