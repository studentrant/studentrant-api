import Auth from '../core/auth.middleware.js';
import PostRantRoute from './post-rant/post-rant.route.js';
import ReplyRantRoute from './reply-rant/reply-rant.route.js';

export default class RantRoute {
  constructor(routeHandler) {
    const post = new PostRantRoute();
    const reply = new ReplyRantRoute();
    routeHandler.use(Auth.IsLogin);
    routeHandler.use(PostRantRoute.API_PATH, post);
    routeHandler.use(ReplyRantRoute.API_PATH, reply);
    return routeHandler;
  }

  static API_PATH = '/rant';
}
