import RantDbUtils from '../../models/dbutils/rant.db.util.js';
import UserDbUtils from '../../models/dbutils/user.db.util.js';
import PostRant from '../../controllers/post-rant.controller.js';
import RantValidators from '../../middlewares/rant.middleware.js';
import { rantsCollection, usersCollection } from '../../models/dbmodels/index.model.js';
import { Utils } from '../../utils/index.util.js';

export default class PostRantRoute {
  constructor(routeHandler) {
    this.controller = new PostRant(
      RantDbUtils,
      UserDbUtils,
      Utils,
      rantsCollection,
      usersCollection,
    );

    routeHandler.post('/create', this.createRant());
    routeHandler.get('/rant/:rantId', this.getRant());
    routeHandler.get('/rants', this.getRants());
    // routeHandler.get('/rants/tags/',             this.getRantsByTag());
    routeHandler.delete('/delete/:rantId', this.deleteRant());
    routeHandler.patch('/edit/:rantId', this.editRant());
    routeHandler.patch('/vote/upvote/:rantId', this.upvoteRant());
    routeHandler.patch('/vote/downvote/:rantId', this.downvoteRant());
    // routeHandler.post("/reply/:rant-id", this.replyRant());
    return routeHandler;
  }

  static API_PATH = '/post'

  createRant() {
    return [
      RantValidators.VerifyRant,
      RantValidators.VerifyRantTags,
      RantValidators.VerifyWhen,
      this.controller.createRant.bind(this.controller),
    ];
  }

  getRant() {
    return [
      RantValidators.VerifyRantId,
      this.controller.getRant.bind(this.controller),
    ];
  }

  getRants() {
    return [
      RantValidators.VerifyNumRequest,
      this.controller.getRants.bind(this.controller),
    ];
  }

  deleteRant() {
    return [
      RantValidators.VerifyRantId,
      this.controller.deleteRant.bind(this.controller),
    ];
  }

  editRant() {
    return [
      RantValidators.VerifyRantId,
      RantValidators.VerifyRant,
      RantValidators.VerifyRantTags,
      RantValidators.VerifyWhen,
      this.controller.editRant.bind(this.controller),
    ];
  }

  upvoteRant() {
    return [
      RantValidators.VerifyRantId,
      this.controller.upvoteRant.bind(this.controller),
    ];
  }

  downvoteRant() {
    return [
      RantValidators.VerifyRantId,
      this.controller.downvoteRant.bind(this.controller),
    ];
  }

  replyRant() {
    return [

    ];
  }
}
