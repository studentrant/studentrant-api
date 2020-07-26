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
        //routeHandler.delete("/delete/:rant-id", this.deleteRant());
        //routeHandler.patch("/edit/:rant-id", this.editRant());
        //routeHandler.post("/reply/:rant-id", this.replyRant());
        return routeHandler;
    }

    createRant() {
        return [
	    RantValidators.VerifyRant,
	    RantValidators.VerifyRantTags,
	    this.controller.createRant.bind(this.controller)
        ];
    }

    deletRant() {
        return [

        ];
    }

    editRant() {
        return [

        ];
    }

    replyRant() {
        return [

        ];
    }

}
