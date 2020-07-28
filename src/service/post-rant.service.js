import { v4 as uuidv4 } from "uuid";
export class PostRantService {
    constructor(rantDbUtils) {
        this.rantDbUtils = rantDbUtils;
    }
    async createRant(data) {
        const rantId = uuidv4();
        return await this.rantDbUtils.saveRant({ ...data , rantId });
    }
    async validateRantExistence(rantId) {
	return await this.rantDbUtils.findOneRant(
	    {
		query   : { rantId },
		project : { deleted: true}
	    }
	);
    }

    async validateRantCreator(username,rantId) {
	return await this.rantDbUtils.findOneRant(
	    {
		query : { rantId , rantPoster: username }
	    }
	);
    }

    async deleteRant(rantId) {
	return await this.rantDbUtils.deleteOneRant(rantId);
    }
}
