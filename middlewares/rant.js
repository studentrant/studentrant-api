import { rantConstants } from "../constants/index.js";

export default class RantValidators {
    static VerifyRant(req,res,next) {
        if ( ! req.body.rant )
	    return res.status(412).json({
                status: 412,
                message: rantConstants.RANT_BODY_UNDEFINED
	    });
	    
        if ( req.body.rant.trim().length <= 20 )
	    return res.status(412).json({
                status: 412,
                message: rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY
	    });
        return next();
    }

    static VerifyRantTags(req,res,next) {
        if ( ! req.body.tags )
	    return res.status(412).json({
                status: 412,
                message: rantConstants.RANT_TAGS_UNDEFINED
	    });
	
        if ( ! Array.isArray(req.body.tags) )
	    return res.status(412).json({
                status: 412,
                message: `${rantConstants.RANT_TAGS_NOT_AN_ARRAY} ${typeof(req.body.tags)}` 
	    });

        return next();
    }
}
