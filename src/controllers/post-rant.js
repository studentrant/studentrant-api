import * as constants from "../constants/index.js";
import { PostRantService } from "../service/post-rant.service.js";
import { NotFoundException, GoneException, UnAuthorizedAccessException } from "../service/exceptions.service.js";

export default class PostRant {
    constructor(RantDbUtils,Utils,rantsCollection) {
        this.utils = Utils;
        PostRant.__POST_SERVICE_RANT = this.postRantService = new PostRantService(
	    new RantDbUtils(rantsCollection)
        );
    }

    /**
     * extra guard to handle security that might occur
     * if someone tries to find a way to delete a rant
     * not created by them
     **/
    static async ValidateRantForDeletion(username,rantId) {
	const __postRantService = PostRant.__POST_SERVICE_RANT;
	const validateAndGetRant = await __postRantService.validateRantExistence(rantId);

	if ( ! validateAndGetRant )       throw NotFoundException(constants.rantConstants.RANT_DOES_NOT_EXISTS);
	if ( validateAndGetRant.deleted ) throw GoneException(constants.rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);

	if ( ! (await __postRantService.validateRantCreator(username,rantId)) )
	    throw UnAuthorizedAccessException(constants.rantConstants.RANT_DELETE_NOT_USER);

	return false;
    }

    async createRant(req,res,next) {

        const { rant, tags } = req.body;

        if ( tags.length === 0 ) tags.push("general");

        try {
	    const result = await this.postRantService.createRant({
                rant,
                tags
	    });
	    return res.status(201).json({ status: 201, message: result });
        } catch(ex) {
	    return next(ex);
        }
    }

    async deleteRant(req,res,next) {

	const { rantId } = req.query;

	try {

	    const username = await this.utils.Utils.ExtractSessionObjectData(req, "username");

	    await PostRant.ValidateRantForDeletion(username,rantId);
	    await this.postRantService.deleteRant(rantId);

	    return res.status(200).json({ status: 200, message: constants.rantConstants.RANT_SUCCESSFULLY_DELETED});

	} catch(ex) {
	    return next(ex);
	}
    }
}
