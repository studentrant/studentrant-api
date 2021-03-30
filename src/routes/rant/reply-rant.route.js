import express from 'express';

import ReplyRant from '../../controllers/reply-rant.controller.js';
import RantValidators from '../../middlewares/rant.middleware.js';

import RantsCollection from '../../models/dbmodels/rant.model.js';
import RantReplyCollection from '../../models/dbmodels/rantcomments.model.js';
import TrendsCollection from '../../models/dbmodels/trends.model.js';
import UsersCollection from '../../models/dbmodels/user.model.js';
import RantReplyDbUtils from '../../models/dbutils/rant-reply.db.util.js';
import RantDbUtils from '../../models/dbutils/rant.db.util.js';
import TrendDbUtils from '../../models/dbutils/trends.db.util.js';
import UserDbUtils from '../../models/dbutils/user.db.util.js';

import { Utils } from '../../utils/index.util.js';

export default class ReplyRantRoute {
  constructor() {
    const routeHandler = express.Router();

    this.controller = new ReplyRant({
      Collections: {
        RantsCollection, UsersCollection, TrendsCollection, RantReplyCollection,
      },
      DBUtils: {
        RantDbUtils, UserDbUtils, TrendDbUtils, RantReplyDbUtils,
      },
      Utils,
    });

    routeHandler.post('/:rantId', this.replyReply());
    routeHandler.get('/:rantId', this.showReply());
    routeHandler.delete('/delete/:replyRantId', this.deleteReply());
    routeHandler.patch('/edit/:replyRantId', this.editReply());

    return routeHandler;
  }

  static API_PATH = '/reply'

  showReply() {
    return [
      RantValidators.VerifyReplyRantParams,
      RantValidators.VerifyNumRequest,
      this.controller.showReply.bind(this.controller),
    ];
  }

  deleteReply() {
    return [
      RantValidators.VerifyReplyRantId,
      this.controller.deleteReply.bind(this.controller),
    ];
  }

  editReply() {
    return [
      RantValidators.VerifyReplyRant,
      this.controller.editReply.bind(this.controller),
    ];
  }

  replyReply() {
    return [
      RantValidators.VerifyRantId,
      RantValidators.VerifyReplyRant,
      RantValidators.VerifyWhen,
      this.controller.replyRant.bind(this.controller),
    ];
  }
}
