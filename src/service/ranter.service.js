export default class RanterService {
  constructor(userDbUtils) {
    this.userDbUtils = userDbUtils;
  }

  /**
   * any tag not in the array will be removed
   * from the not allowed tags
   * an extra tag added, will be added to the not allowed tags array
   * */
  updateUserTags(username, tags) {
    return this.userDbUtils.updateUserInfo({
      criteria: { username },
      data: { $set: { 'settings.notAllowedTags': tags } },
      options: {
        new: true,
        fields: { 'settings.notAllowedTags': true },
      },
    });
  }
}
