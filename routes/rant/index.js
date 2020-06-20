import express from "express";
import Auth from "../../middlewares/auth.js";
import { PostRantRoute } from "./post-rant.js";
import { ReplyRantRoute } from "./reply-rant.js";

export class RantRoute {
    constructor(routeHandler) {
	const router = express.Router();
	const post   = new PostRantRoute(router);
	//const reply  = new ReplyRantRoute(router);
	routeHandler.use(Auth.IsLogin);
	routeHandler.use("/post", post);
	//routeHandler.use("/reply", reply);
	return routeHandler;
    }
    static API_PATH = "/rant";
}
