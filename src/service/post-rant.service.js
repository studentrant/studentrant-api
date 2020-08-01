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

    async getRant(rantId) {
        return await this.rantDbUtils.findOneRant(
	    {
                query: { rantId }
	    }
        );
    }

    /**
     *
     * when a rant is edited, the isEdited property is set to true
     * this is to signify that the rant has been edited
     * edit history is marked by (when) which specified when it is been edited
     *
     *
     **/
    async editRant(username,rantId,values) {

        const editOperation = {
	    $set : {
                rant : values.editedRant,
                "edit.isEdited" : true
	    },
	    $addToSet: {
                "edit.editHistory": {
		    when: values.when
                },
                tags: { $each: values.tags }
	    }
        };

        const insertDiffToRantOperation = {
	    $set: {
                "edit.editHistory.$.diff" : values.diff,
                "edit.editHistory.$.diffAgainst": values.currentRantInDb
	    }
        };

        // eslint-disable-next-line
	const editedRant = await this.rantDbUtils.editOneRant({
	    query     : { rantPoster: username, rantId },
	    operation : editOperation
        });

        const appliedDiff = await this.rantDbUtils.editOneRant({
	    query     : { rantPoster: username, rantId, "edit.editHistory.when": values.when },
	    operation : insertDiffToRantOperation
        });

        return appliedDiff;
    }
}
