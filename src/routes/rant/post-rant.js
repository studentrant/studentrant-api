import RantDbUtils from "../../models/dbutils/rant.db.util.js";
import PostRant    from "../../controllers/post-rant.js";
import RantValidators from "../../middlewares/rant.js";
import { rantsCollection } from "../../models/dbmodels/index.js";
import * as Utils  from "../../utils/index.js";

export class PostRantRoute {
    constructor(routeHandler) {
        this.controller = new PostRant(
	    RantDbUtils,
	    Utils,
	    rantsCollection
        );
        routeHandler.post("/", this.createRant());
        routeHandler.delete("/delete/", this.deleteRant());
        routeHandler.patch("/edit/:rantId", this.editRant());
        //routeHandler.post("/reply/:rant-id", this.replyRant());
        return routeHandler;
    }

    static API_PATH = "/post"

    createRant() {
        return [
	    RantValidators.VerifyRant,
	    RantValidators.VerifyRantTags,
	    this.controller.createRant.bind(this.controller)
        ];
    }

    deleteRant() {
        return [
	    RantValidators.VerifyRantId,
	    this.controller.deleteRant.bind(this.controller)
        ];
    }

    editRant() {
        return [
	    RantValidators.VerifyRantId,
	    RantValidators.VerifyRantTags,
	    RantValidators.VerifyRant,
	    this.controller.editRant.bind(this.controller)
        ];
    }

    replyRant() {
        return [

        ];
    }

}
