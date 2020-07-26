import { PostRantService } from "../service/post-rant.service.js";

export default class PostRant {
    constructor(RantDbUtils,Utils,rantsCollection) {
	this.utils = Utils;
	this.postRantService = new PostRantService(
	    new RantDbUtils(rantsCollection)
	);
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
}
