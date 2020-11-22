import Diff from 'diff';
import * as constants from '../constants/index.constant.js';
import PostRantService from '../service/post-rant.service.js';
import { NotFoundException, GoneException, UnAuthorizedAccessException } from '../core/exceptions.service.js';

export default class PostRant {
  constructor(
    RantDbUtils,
    UserDbUtils,
    Utils,
    rantsCollection,
    usersCollection,
  ) {
    this.Utils = Utils;
    PostRant.__POST_SERVICE_RANT = this.postRantService = new PostRantService(
      new RantDbUtils(rantsCollection),
      new UserDbUtils(usersCollection),
    );
  }

  static SetRantTagsToGeneralIfEmpty = (tags) => tags.length === 0 && tags.push('general');

  /**
   * extra guard to handle security that might occur
   * if someone tries to find a way to delete a rant
   * not created by them
   * */
  static async ValidateRantForModification(rantId) {
    const __postRantService = PostRant.__POST_SERVICE_RANT;
    const validateAndGetRant = await __postRantService.validateRantExistence(rantId);

    if (!validateAndGetRant) {
      throw NotFoundException(
        constants.rantConstants.RANT_DOES_NOT_EXISTS,
      );
    }

    if (validateAndGetRant.deleted) {
      throw GoneException(
        constants.rantConstants.RANT_HAS_ALREADY_BEEN_DELETED,
      );
    }
  }

  static async ValidateRantCreator(username, rantId) {
    const __postRantService = PostRant.__POST_SERVICE_RANT;

    await PostRant.ValidateRantForModification(rantId);

    if (!(await __postRantService.validateRantCreator(username, rantId))) {
      throw UnAuthorizedAccessException(
        constants.rantConstants.RANT_NOT_USER,
      );
    }
  }

  static async ValidateRantUpvoter(rantUpvoter) {
    const __postRantService = PostRant.__POST_SERVICE_RANT;
    const validateRantUpvoter = await __postRantService.validateRantUpvoter(rantUpvoter);

    if (!validateRantUpvoter) {
      throw NotFoundException(
        constants.rantConstants.RANT_USER_UPVOTER_NOT_EXISTS,
      );
    }

    if (validateRantUpvoter.deactivated) {
      throw NotFoundException(
        constants.rantConstants.RANT_USER_UPVOTER_DEACTIVATED,
      );
    }

    return validateRantUpvoter._id;
  }

  static DiffRants(currentRant, replaceRant) {
    return Diff.diffChars(currentRant, replaceRant);
  }

  /* eslint-disable no-param-reassign */
  static RantCountVoteDelete(result) {
    result.rantDownvoteCount = result.rantDownvote?.length;
    result.rantUpvoteCount = result.rantUpvote?.length;
    delete result.rantUpvote;
    delete result.rantDownvote;
  }
  /* eslint-enable no-param-reassign */

  async createRant(req, res, next) {
    const { rant, tags, when } = req.body;

    try {
      PostRant.SetRantTagsToGeneralIfEmpty(tags);
      const username = await this.Utils.ExtractSessionObjectData(req, 'username');
      const result = await this.postRantService.createRant({
        rantPoster: username,
        rant,
        when,
        tags,
      });
      PostRant.RantCountVoteDelete(result);
      return res.status(201).json({ status: 201, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async deleteRant(req, res, next) {
    const { rantId } = req.params;

    try {
      const username = await this.Utils.ExtractSessionObjectData(req, 'username');

      await PostRant.ValidateRantCreator(username, rantId);
      await this.postRantService.deleteRant(rantId);

      return res.status(200).json({
        status: 200,
        message: constants.rantConstants.RANT_SUCCESSFULLY_DELETED,
      });
    } catch (ex) {
      return next(ex);
    }
  }

  async editRant(req, res, next) {
    const { rantId } = req.params;
    const { tags, rant: editedRant, when } = req.body;

    try {
      PostRant.SetRantTagsToGeneralIfEmpty(tags);

      const username = await this.Utils.ExtractSessionObjectData(req, 'username');

      await PostRant.ValidateRantCreator(username, rantId);

      const currentRantInDb = (await this.postRantService.getRant(rantId)).rant;
      const diff = PostRant.DiffRants(currentRantInDb, editedRant);

      const result = await this.postRantService.editRant(username, rantId, {
        editedRant,
        currentRantInDb,
        tags,
        when,
        diff,
      });
      PostRant.RantCountVoteDelete(result);
      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async upvoteRant(req, res, next) {
    const { rantUpvoter } = req.body;
    const { rantId } = req.params;

    try {
      await PostRant.ValidateRantForModification(rantId);

      const rantUpvoterUserId = await PostRant.ValidateRantUpvoter(rantUpvoter);
      const result = await this.postRantService.upvote(rantId, rantUpvoterUserId);

      PostRant.RantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async downvoteRant(req, res, next) {
    const { rantDownvoter } = req.body;
    const { rantId } = req.params;

    try {
      await PostRant.ValidateRantForModification(rantId);
      const rantDownvoterUserId = await PostRant.ValidateRantUpvoter(rantDownvoter);
      const result = await this.postRantService.downvote(rantId, rantDownvoterUserId);

      PostRant.RantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async getRant(req, res, next) {
    const { rantId } = req.params;

    try {
      await PostRant.ValidateRantForModification(rantId);
      const result = await this.postRantService.getRant(rantId);

      PostRant.RantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async getRants(req, res, next) {
    const { numRequest } = req.query;

    try {
      const result = await this.postRantService.getRants(numRequest);

      if (result.rants.length === 0) {
        throw NotFoundException(
          constants.rantConstants.RANT_READ_EXHAUSTED,
        );
      }

      return res.status(200).json(
        {
          status: 200,
          message: { rant: result },
        },
      );
    } catch (ex) {
      return next(ex);
    }
  }
}
