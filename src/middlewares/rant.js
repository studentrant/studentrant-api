import { rantConstants } from "../constants/index.js";
import { BadValueException } from "../service/exceptions.service.js";

export default class RantValidators {
    static VerifyRant(req,res,next) {
        if ( ! req.body.rant )
	    throw BadValueException(rantConstants.RANT_BODY_UNDEFINED);

        /**
	 * TODO: split on white space to test if content is <= 20
	 * instead of trimming out white space and counting by words
	 *
	 **/
        if ( req.body.rant.trim().length <= 20 )
	    throw BadValueException(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
        return next();
    }

    static VerifyRantTags(req,res,next) {
        if ( ! req.body.tags )
	    throw BadValueException(rantConstants.RANT_TAGS_UNDEFINED);

        if ( ! Array.isArray(req.body.tags) )
	    throw BadValueException(`${rantConstants.RANT_TAGS_NOT_AN_ARRAY} ${typeof(req.body.tags)}`);

        return next();
    }

    static VerifyRantId(req,res,next) {
	if ( ! req.query.rantId )
	    throw BadValueException(rantConstants.RANT_ID_IS_UNDEFINED);
	return next();
    }
}
