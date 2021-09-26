import rantConstants from './rant.constant.js';
import { BadValueException } from '../core/exceptions.service.js';

export default class RantValidators {
  verifyRant(req, res, next) {
    if (!req.body.rant) throw BadValueException(rantConstants.RANT_BODY_UNDEFINED);

    /**
     * TODO: split on white space to test if content is <= 20
     * instead of trimming out white space and counting by words
     *
     * */
    if (req.body.rant.trim().length <= 20) {
      throw BadValueException(
        rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY,
      );
    }
    return next();
  }

  verifyRantTags(req, res, next) {
    if (!req.body.tags) throw BadValueException(rantConstants.RANT_TAGS_UNDEFINED);

    if (!Array.isArray(req.body.tags)) {
      throw BadValueException(
        `${rantConstants.RANT_TAGS_NOT_AN_ARRAY} ${typeof (req.body.tags)}`,
      );
    }

    return next();
  }

  verifyRantTag(req, res, next) {
    if (!req.params.tag) throw BadValueException(rantConstants.RANT_TAGS_UNDEFINED);
    return next();
  }

  verifyRantId(req, res, next) {
    if (!req.params.rantId) throw BadValueException(rantConstants.RANT_ID_IS_UNDEFINED);
    return next();
  }

  verifyWhen(req, res, next) {
    if (!req.body.when) throw BadValueException(rantConstants.RANT_WHEN_NO_EXISTS);

    if (typeof (req.body.when) !== 'number') throw BadValueException(rantConstants.RANT_NOT_NUMBER);

    if ((new Date(req.body.when)).toString() === 'Invalid Date') {
      throw BadValueException(
        rantConstants.RANT_NOT_VALID_TIMESTAMP,
      );
    }

    return next();
  }

  verifyNumRequest(req, res, next) {
    req.query.numRequest = Number(req.query.numRequest);
    if (Number.isNaN(req.query.numRequest)) {
      throw BadValueException(
        rantConstants.RANT_NOT_VALID_LOAD_NUM_REQUEST,
      );
    }
    return next();
  }

  verifyTrend(req, res, next) {
    if (!req.params.trend.startsWith('#')) {
      throw BadValueException(
        rantConstants.RANT_NOT_VALID_TREND,
      );
    }
    return next();
  }

  verifyReplyRant(req, res, next) {
    if (!req.body.replyRant) {
      throw BadValueException(
        rantConstants.RANT_REPLY_UNDEFINED,
      );
    }

    if (req.body.replyRant.trim().length <= 20) {
      throw BadValueException(
        rantConstants.RANT_REPLY_NOT_MORE_THAN_TWENTY,
      );
    }

    return next();
  }

  verifyReplyRantId(req, res, next) {
    if (!req.params.replyRantId) {
      throw BadValueException(
        rantConstants.REPLY_RANT_NO_RANT_ID,
      );
    }
    return next();
  }

  verifyReplyRantParams(req, res, next) {
    if (
      !req.params.rantId
        && !req.query.parentCommentId
    ) {
      throw BadValueException(
        rantConstants.REPLY_RANT_NO_PARAMS,
      );
    }

    if (
      req.query.parentCommentId
        && !req.params.rantId
    ) {
      throw BadValueException(
        rantConstants.REPLY_RANT_NO_RANT_ID,
      );
    }

    if (!req.params.rantId) throw BadValueException(rantConstants.RANT_ID_IS_UNDEFINED);

    return next();
  }
}
