import session from 'express-session';
import mongoStore from 'connect-mongodb-session';

export class Session {
  constructor(config) {
    this.config = config;
    this.useMiddleware = true;
  }

  configure() {
    const store = new mongoStore(session); // eslint-disable-line new-cap
    return session({
      secret: this.config.get('sessionSecret'),
      resave: true,

      saveUninitialized: true,
      store: store(
        {
          uri: this.config.get('dbConnectionString.connString'),
          collection: 'session',
        },
      ),
    });
  }
}
export default Session;
