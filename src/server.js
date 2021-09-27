import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';

import {
  Config, Database, Session, Logger,
} from './core/config/index.config.js';
import badExceptionConstants from './core/constants/bad-exception.constant.js';
import { NotFoundException } from './core/exceptions.service.js';
import LoginRoute from './login/login.route.js';
import mountGlobalConfigurations from './mountGlobalConfigurations.js';
import mountRoutes from './mountRoutes.js';

import RanterRoute from './ranter/ranter.route.js';
import RantRoute from './rants/rant.route.js';
import TrendRoute from './rants/trends/trends.route.js';
import RegisterRoute from './registration/register.route.js';

const app = express();

app.set('PORT', Config.get('SERVER.PORT'));
app.set('CONFIGURATION', Config);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mountGlobalConfigurations(
  app,
  [
    Database,
    Session,
    Logger,
  ],
);

mountRoutes(
  app,
  [
    RegisterRoute,
    LoginRoute,
    RantRoute,
    RanterRoute,
    TrendRoute,
  ],
);

const logger = new Logger(app.get('CONFIGURATION'));

app.use('*', (req, res, next) => next(NotFoundException(`route ${req.url} does not exists`)));

// eslint-disable-next-line
app.use((err, req, res, next) => {

  const { status, message } = err.errorDetails
    ? err.errorDetails
    : {
      status: 500,
      message: process.env.NODE_ENV === 'production'
        ? badExceptionConstants
        : err.message,
    };

  if (process.env.NODE_ENV !== 'production' && status === 500) {
    logger.setLogType('express');
    logger.log.fatal(message);
    logger.log.error(JSON.stringify(err));
  }
  return res.status(status).json({ status, message });
});

app.listen(app.get('PORT'), () => {
  logger.setLogType('express');
  logger.log.info(`listening on port ${app.get('PORT')}`);
});

export default app;
