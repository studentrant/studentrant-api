import UIDGenerator from 'uid-generator';

const uuid = new UIDGenerator(512, UIDGenerator.BASE62);

export default class Utils {
  static ExtractSessionObjectData(req, type) {
    if (!(type in req.session.user)) throw new Error(`${type} does not exists on session object`);
    return req.session.user[type];
  }

  static SetSessionObject(req, data) {
    req.session.user = data;
  }

  static UpdateSessionObject(req, data) {
    Object.assign(req.session.user, ...data);
  }

  static UniqueCodeGenerator() {
    return uuid.generate();
  }
}
