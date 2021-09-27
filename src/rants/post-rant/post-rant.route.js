import express from 'express';

import UserDbUtils from '../../ranter/ranter.db.util.js';
import UsersCollection from '../../ranter/ranter.model.js';
import { Utils } from '../../utils/index.util.js';
import RantValidators from '../rant.middleware.js';

import TrendDbUtils from '../trends/trends.db.util.js';
import TrendsCollection from '../trends/trends.model.js';

import PostRantController from './post-rant.controller.js';

import RantDbUtils from './post-rant.db.util.js';
import RantsCollection from './post-rant.model.js';

export default class PostRantRoute {
  constructor() {
    const routeHandler = express.Router();
    this.controller = new PostRantController({
      Collections: { RantsCollection, UsersCollection, TrendsCollection },
      DBUtils: { RantDbUtils, UserDbUtils, TrendDbUtils },
      Utils,
    });
    this.rantValidators = new RantValidators();

    routeHandler.post('/create', this.createRant());
    routeHandler.get('/rant/:rantId', this.getRant());
    routeHandler.get('/rants', this.getRants());
    routeHandler.get('/rants/tag/:tag', this.getRantsByTag());
    routeHandler.delete('/delete/:rantId', this.deleteRant());
    routeHandler.patch('/edit/:rantId', this.editRant());
    routeHandler.patch('/vote/upvote/:rantId', this.upvoteRant());
    routeHandler.patch('/vote/downvote/:rantId', this.downvoteRant());
    return routeHandler;
  }

  static API_PATH = '/post'

  createRant() {
    return [
      this.rantValidators.verifyRant,
      this.rantValidators.verifyRantTags,
      this.rantValidators.verifyWhen,
      this.controller.createRant.bind(this.controller),
    ];
  }

  getRant() {
    return [
      this.rantValidators.verifyRantId,
      this.controller.getRant.bind(this.controller),
    ];
  }

  getRants() {
    return [
      this.rantValidators.verifyNumRequest,
      this.controller.getRants.bind(this.controller),
    ];
  }

  deleteRant() {
    return [
      this.rantValidators.verifyRantId,
      this.controller.deleteRant.bind(this.controller),
    ];
  }

  editRant() {
    return [
      this.rantValidators.verifyRantId,
      this.rantValidators.verifyRant,
      this.rantValidators.verifyRantTags,
      this.rantValidators.verifyWhen,
      this.controller.editRant.bind(this.controller),
    ];
  }

  upvoteRant() {
    return [
      this.rantValidators.verifyRantId,
      this.controller.upvoteRant.bind(this.controller),
    ];
  }

  downvoteRant() {
    return [
      this.rantValidators.verifyRantId,
      this.controller.downvoteRant.bind(this.controller),
    ];
  }

  getRantsByTag() {
    return [
      this.rantValidators.verifyRantTag,
      this.rantValidators.verifyNumRequest,
      this.controller.getRantsByTag.bind(this.controller),
    ];
  }
}
