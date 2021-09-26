import express from 'express';

import Auth from '../core/auth.middleware.js';

import Me from './me.route.js';

export default class RantRoute {
  constructor(routeHandler) {
    const router = express.Router();
    const me = new Me(router);
    routeHandler.use(Auth.IsLogin);
    routeHandler.use(Me.API_PATH, me);
    return routeHandler;
  }

  static API_PATH = '/'
}
