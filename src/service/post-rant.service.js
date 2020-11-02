import { v4 as uuidv4 } from 'uuid';

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
}
