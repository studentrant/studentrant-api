import Diff from 'diff';

import * as constants from '../constants/index.constant.js';
import {
  NotFoundException, GoneException, UnAuthorizedAccessException, ForbiddenException,
} from '../core/exceptions.service.js';
import PostRantService from '../service/post-rant.service.js';
import TrendingService from '../service/trending.service.js';

/**
 * have a separate functionality that calls
 * every controller
 *
 *
 * */
export default class PostRant {
  constructor({ Collections, DBUtils, Utils }) {
    this.Utils = Utils;
    this.postRantService = new PostRantService(
      new DBUtils.RantDbUtils(Collections.RantsCollection, Collections.UsersCollection),
      new DBUtils.UserDbUtils(Collections.UsersCollection),
    );

    this.trendingService = new TrendingService(
      new DBUtils.TrendDbUtils(Collections.TrendsCollection),
    );
  }

  #setRantTagsToGeneralIfEmpty = (tags) => tags.length === 0 && tags.push('general');

  /**
   * extra guard to handle security that might occur
   * if someone tries to find a way to delete a rant
   * not created by them
   * */
  async #validateRantForModification (rantId) {
    const validateAndGetRant = await this.postRantService.validateRantExistence(rantId);

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

  async #validateRantCreator (username, rantId) {
    await this.#validateRantForModification(rantId);

    if (!(await this.postRantService.validateRantCreator(username, rantId))) {
      throw UnAuthorizedAccessException(
        constants.rantConstants.RANT_NOT_USER,
      );
    }
  }

  async #validateRantUpvoter (rantUpvoter) {
    const validateRantUpvoter = await this.postRantService.validateRantUpvoter(rantUpvoter);

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

  #diffRants (currentRant, replaceRant) {
    return Diff.diffChars(currentRant, replaceRant);
  }

  /* eslint-disable no-param-reassign */
  #rantCountVoteDelete (result) {
    result.rantDownvoteCount = result.rantDownvote?.length;
    result.rantUpvoteCount = result.rantUpvote?.length;
    delete result.rantUpvote;
    delete result.rantDownvote;
  }
  /* eslint-enable no-param-reassign */

  async createRant(req, res, next) {
    const { rant, tags, when } = req.body;

    try {
      this.#setRantTagsToGeneralIfEmpty(tags);

      const username = this.Utils.ExtractSessionObjectData(req, 'username');
      const result = await this.postRantService.createRant({
        rantPoster: username,
        rant,
        when,
        tags,
      });

      // write a logger service
      Promise.resolve(
        this.trendingService.createTrendIfExists({
          text: result.rant,
          identifier: result.rantId,
          col: 'rant',
        }),
      ).catch((ex) => console.error(ex));

      this.#rantCountVoteDelete(result);

      return res.status(201).json({ status: 201, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async deleteRant(req, res, next) {
    const { rantId } = req.params;

    try {
      const username = this.Utils.ExtractSessionObjectData(req, 'username');

      await this.#validateRantCreator(username, rantId);
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
      this.#setRantTagsToGeneralIfEmpty(tags);

      const username = this.Utils.ExtractSessionObjectData(req, 'username');

      await this.#validateRantCreator(username, rantId);

      const currentRantInDb = (await this.postRantService.getRant(rantId)).rant;
      const diff = this.#diffRants(currentRantInDb, editedRant);
      const result = await this.postRantService.editRant(username, rantId, {
        editedRant,
        currentRantInDb,
        tags,
        when,
        diff,
      });

      this.#rantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async upvoteRant(req, res, next) {
    const { rantId } = req.params;

    try {
      await this.#validateRantForModification(rantId);

      const username = this.Utils.ExtractSessionObjectData(req, 'username');
      const rantUpvoterUserId = await this.#validateRantUpvoter(username);
      const result = await this.postRantService.upvote(rantId, rantUpvoterUserId);

      this.#rantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async downvoteRant(req, res, next) {
    const { rantId } = req.params;

    try {
      await this.#validateRantForModification(rantId);

      const username = this.Utils.ExtractSessionObjectData(req, 'username');
      const rantDownvoterUserId = await this.#validateRantUpvoter(username);
      const result = await this.postRantService.downvote(rantId, rantDownvoterUserId);

      this.#rantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async getRant(req, res, next) {
    const { rantId } = req.params;

    try {
      await this.#validateRantForModification(rantId);
      const result = await this.postRantService.getRant(rantId);

      this.#rantCountVoteDelete(result);

      return res.status(200).json({ status: 200, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async getRants(req, res, next) {
    const { numRequest } = req.query;

    try {
      const result = await this.postRantService.getRants({ deleted: false }, numRequest);

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

  async getRantsByTag(req, res, next) {
    const { tag } = req.params;
    const { numRequest } = req.query;

    try {
      const username = this.Utils.ExtractSessionObjectData(req, 'username');

      // check if $tag is ignored
      const isRantTagIgnored = await this.postRantService.isRantTagIgnored(username, tag);

      if (isRantTagIgnored) {
        throw ForbiddenException(
          constants.rantConstants.RANT_READ_TAG_NOT_ALLOWED,
        );
      }

      const result = await this.postRantService.getRants(
        { deleted: false, tags: tag },
        numRequest,
      );

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
