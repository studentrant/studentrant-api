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

  async getRantFromAggregation({
    matchBy, numRequest, calculateNext, rantCount,
  }) {
    const hasMore = calculateNext < rantCount;

    const rants = await this.rantDbUtils.findAllRants({

      getRants: { $match: matchBy },

      sortInInsertionOrder: {
        $sort: { _id: -1 },
      },

      getRantPosters: {
        $lookup: {
          from: 'users',
          as: 'authoredBy',
          localField: 'rantPoster',
          foreignField: 'username',
        },
      },

      filterOutIds: {
        $project: {
          'authoredBy._id': false,
          'authoredBy.__v': false,
          'authoredBy.password': false,
          _id: false,
          __v: false,
          'edit._id': false,
          'edit.editHistory._id': false,
          'edit.editHistory.diff._id': false,
        },
      },

      spreadUsers: {
        $unwind: '$authoredBy',
      },

      limitSearchByVerifiedUsers: {
        $match: {
          'authoredBy.verified': true,
          'authoredBy.completeReg': true,
        },
      },

      filterOutUnwanted: {
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
          authoredBy: true,
          shouldRead: {
            $size: {
              $filter: {
                input: '$authoredBy.settings.notAllowedTags',
                as: 'tag',
                cond: { $in: ['$$tag', '$tags'] },
              },
            },
          },
        },
      },

      limitByAllowedTags: {
        $match: { shouldRead: 0 },
      },

      skipAlreadyViewed: {
        $skip: rantEnums.RANTS_LOAD_LIMIT * numRequest,
      },

      limitToDefinedEnum: {
        $limit: rantEnums.RANTS_LOAD_LIMIT,
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

  async getRants(matchBy, numRequest) {
    return this.getRantFromAggregation(
      {
        numRequest,
        matchBy,
        rantCount: await this.rantDbUtils.getTotalRants({ deleted: false }),
        calculateNext: rantEnums.RANTS_LOAD_LIMIT * (numRequest + 1),
      },
    );
  }

  async isRantTagIgnored(username, tag) {
    return this.rantDbUtils.findRantTags(username, tag);
  }
}
