import { v4 as uuidv4 } from "uuid";

export default class PostRant {
    contructor(rantDbUtils) {
        this.rantDbUtils = rantDbUtils;
    }
    
    async postRant(req,res,next) {
        const { rant, tags } = req.body;
        const rantId = uuidv4();
        try {
	    const result = await this.register({
                rant,
                tags,
                rantId
	    });
	    return res.status(201).json({ status: 201, message: result });
        } catch(ex) { 
	    return next(ex);
        }
    }
}
