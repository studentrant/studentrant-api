import log4js from 'log4js';
import { Client } from '@elastic/elasticsearch';

export class Logger {
  constructor(config) {
    Logger.config = this.config = config;
    this.useMiddleware = true;
  }

  setLogType(type) {
    const logType = this.config.get('env') !== 'test' ? type : 'test';
    this.log = log4js.getLogger(logType);
    return log4js.connectLogger(this.log);
  }

  elasticSearchAdapter(config) {
    const client = new Client({
      node: config.elasticSearchUrl,
      maxRetries: 5,
      auth: {
        username: config.elasticUsername,
        password: config.elasticPassword,
      },
    });

    return async (loggingEvent) => {
      await client.index({
        index: config.elasticSearchIndex,
        body: { ...loggingEvent },
      });
    };
  }

  configure() {
    if (this.config.get('env') === 'test') {
      this.useMiddleware = false;
      return false;
    }

    log4js.configure({
      appenders: {
        customAppender: {
          type: { configure: this.elasticSearchAdapter },
          elasticSearchIndex: `studentrant_${this.config.get('env')}`,
          elasticSearchUrl: 'http://localhost:9200',
        },
        express: { type: 'stdout' },
      },
      categories: {
        default: { appenders: ['customAppender', 'express'], level: 'info' },
      },
    });

    return this.setLogType('express');
  }
}

export default Logger;
