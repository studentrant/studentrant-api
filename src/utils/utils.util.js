import { v4 as uuid } from 'uuid';

export default class Utils {
  static ExtractSessionObjectData(req, type) {
    if (!req.session.user || !(type in req.session.user)) throw new Error(`${type} does not exists on session object`);
    return req.session.user[type];
  }

  static SetSessionObject(req, data) {
    req.session.user = data;
  }

  static UpdateSessionObject(req, data) {
    Object.assign(req.session.user, { ...req.session.user, ...data });
  }

  static GenerateUniqueId() {
    return uuid();
  }
}
