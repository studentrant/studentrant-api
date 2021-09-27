import RanterService from './ranter.service.js';

export default class Ranter {
  constructor(UserDbUtils, usersCollection, Utils) {
    this.Utils = Utils;
    this.ranterService = new RanterService(
      new UserDbUtils(usersCollection),
    );
  }

  async updateTags(req, res, next) {
    const { tags } = req.body;

    try {
      const username = this.Utils.ExtractSessionObjectData(req, 'username');
      const result = await this.ranterService.updateUserTags(username, tags);
      return res.status(200).json({
        status: 200,
        message: { ignoredTags: result.settings.notAllowedTags },
      });
    } catch (ex) {
      return next(ex);
    }
  }
}
