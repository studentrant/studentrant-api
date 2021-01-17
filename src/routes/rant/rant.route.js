import express from 'express';

import Auth from '../../middlewares/auth.middleware.js';

import PostRantRoute from './post-rant.route.js';
// import { ReplyRantRoute } from "./reply-rant.js";

export default class RantRoute {
  constructor(routeHandler) {
    const router = express.Router();
    const post = new PostRantRoute(router);
    // const reply  = new ReplyRantRoute(router);
    routeHandler.use(Auth.IsLogin);
    routeHandler.use(PostRantRoute.API_PATH, post);
    // routeHandler.use("/reply", reply);
    return routeHandler;
  }

  static API_PATH = '/rant';
}
