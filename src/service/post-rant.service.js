import { v4 as uuidv4 } from 'uuid';
import { rantEnums } from '../enums/rants.enums.js';

export default class PostRantService {
  constructor(rantDbUtils, userDbUtils) {
    this.rantDbUtils = rantDbUtils;
    this.userDbUtils = userDbUtils;
  }

  createRant(data) {
    const rantId = uuidv4();
    return this.rantDbUtils.saveRant({ ...data, rantId });
  }

  validateRantExistence(rantId) {
    return this.rantDbUtils.findOneRant(
      {
        query: { rantId },
        project: { deleted: true },
      },
    );
  }

  validateRantCreator(username, rantId) {
    return this.rantDbUtils.findOneRant(
      {
        query: { rantId, rantPoster: username },
      },
    );
  }

  validateRantUpvoter(rantUpvoter) {
    return this.userDbUtils.checkUserName(rantUpvoter);
  }

  deleteRant(rantId) {
    return this.rantDbUtils.deleteOneRant(rantId);
  }

  getRant(rantId) {
    return this.rantDbUtils.findOneRant(
      {
        query: { rantId },
        project: {
          _id: false,
          'edit.editHistory.diff._id': false,
          'edit.editHistory._id': false,
          __v: false,
        },
      },
    );
  }

  /**
   *
   * when a rant is edited, the isEdited property is set to true
   * this is to signify that the rant has been edited
   * edit history is marked by (when) which specified when it is been edited
   *
   *
   * */
  async editRant(username, rantId, values) {
    const editOperation = {
      $set: {
        rant: values.editedRant,
        'edit.isEdited': true,
      },
      $addToSet: {
        'edit.editHistory': {
          when: values.when,
        },
        tags: { $each: values.tags },
      },
    };

    const insertDiffToRantOperation = {
      $set: {
        'edit.editHistory.$.diff': values.diff,
        'edit.editHistory.$.diffAgainst': values.currentRantInDb,
      },
    };

    await this.rantDbUtils.editOneRant({
      query: { rantPoster: username, rantId },
      operation: editOperation,
    });

    return this.rantDbUtils.editOneRant({
      query: { rantPoster: username, rantId, 'edit.editHistory.when': values.when },
      operation: insertDiffToRantOperation,
    });
  }

  async upvote(rantId, rantUpvoterId) {
    const isUserAlreadyUpvoted = await this.rantDbUtils.findOneVoter('rantUpvote', rantId, rantUpvoterId);
    if (!isUserAlreadyUpvoted) {
      return this.rantDbUtils.upvote(rantId, rantUpvoterId);
    }
    return this.rantDbUtils.removeOneVote('rantUpvote', rantId, rantUpvoterId);
  }

  async downvote(rantId, rantDownvoterId) {
    const isUserAlreadyDownvoted = await this.rantDbUtils.findOneVoter('rantDownvote', rantId, rantDownvoterId);
    if (!isUserAlreadyDownvoted) {
      return this.rantDbUtils.downvote(rantId, rantDownvoterId);
    }
    return this.rantDbUtils.removeOneVote('rantDownvote', rantId, rantDownvoterId);
  }

  async getRants(numRequest) {
    const rantCount = await this.rantDbUtils.getTotalRants({ deleted: false });
    const calculateNext = rantEnums.RANTS_LOAD_LIMIT * (numRequest + 1);
    const hasMore = calculateNext < rantCount;

    const rants = await this.rantDbUtils.findAllRants({

      getRants: { $match: { deleted: false } },

      skipAlreadyViewed: {
        $skip: rantEnums.RANTS_LOAD_LIMIT * numRequest,
      },

      limitToDefinedEnum: {
        $limit: rantEnums.RANTS_LOAD_LIMIT,
      },

      projectRant: {
        $project: {
          rantUpvote: { $size: '$rantUpvote' },
          rantDownvote: { $size: '$rantDownvote' },
          rantComments: { $size: '$rantComments' },
          edit: true,
          deleted: true,
          rant: true,
          rantPoster: true,
          rantId: true,
          when: true,
          tags: true,
        },
      },

      getRantPosters: {
        $lookup: {
          from: 'users',
          as: 'authoredBy',
          localField: 'username',
          foreignField: 'rantPoster',
        },
      },

      spreadUsers: {
        $unwind: '$authoredBy',
      },

      filterOutUnwanted: {
        $project: {
          'authoredBy._id': false,
          'authoredBy.__v': false,
          'authoredBy.password': false,
          _id: false,
          __v: false,
          'edit._id': false,
          'edit.editHistory._id': false,
        },
      },

      limitSearchByVerifiedUsers: {
        $match: {
          'authoredBy.verified': true,
          'authoredBy.completeReg': true,
          $expr: { $not: { $in: ['$authoredBy.settings.notAllowedTags', '$tags'] } },
        },
      },
    });

    return {
      rants,
      hasMore,
      page: {
        totalRant: rantCount,
        remainingRant: Math.abs(rantCount - (
          rants.length < rantEnums.RANTS_LOAD_LIMIT
            ? rantCount
            : calculateNext
        )),
      },
    };
  }
}
