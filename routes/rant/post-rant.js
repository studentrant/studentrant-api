import RantDbUtils from "../../models/dbutils/rant.utils.js";
import PostRant    from "../../controllers/post-rant.js";
import RantValidators from "../../middlewares/rant.js";
import * as Utils  from "../../utils/index.js";

export class PostRantRoute {
    constructor(routeHandler) {
        this.controller = new PostRant(
	    RantDbUtils,
	    Utils
        );
        routeHandler.post("/", this.postRant());
        //routeHandler.delete("/delete/:rant-id", this.deleteRant());
        //routeHandler.patch("/edit/:rant-id", this.editRant());
        //routeHandler.post("/reply/:rant-id", this.replyRant());
        return routeHandler;
    }

    postRant() {
        return [
	    RantValidators.VerifyRant,
	    RantValidators.VerifyRantTags,
	    this.controller.postRant.bind(this.controller)
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
