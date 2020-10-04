import RantDbUtils from '../../models/dbutils/rant.db.util.js';
import PostRant from '../../controllers/post-rant.controller.js';
import RantValidators from '../../middlewares/rant.middleware.js';
import { rantsCollection } from '../../models/dbmodels/index.model.js';
import { Utils } from '../../utils/index.util.js';

export default class PostRantRoute {
  constructor(routeHandler) {
    this.controller = new PostRant(
      RantDbUtils,
      Utils,
      rantsCollection,
    );
    routeHandler.post('/create', this.createRant());
    routeHandler.delete('/delete/:rantId', this.deleteRant());
    routeHandler.patch('/edit/:rantId', this.editRant());
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

  replyRant() {
    return [

    ];
  }
}
