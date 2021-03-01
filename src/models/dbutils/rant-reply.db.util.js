export default class RantRepliesDbUtils {
  constructor(rantCommentCollection) {
    console.log(rantCommentCollection);
    this.RantCommentCollection = rantCommentCollection;
  }

  async saveReply(data) {
    await (new this.RantCommentCollection(data).save());
    return this.RantCommentCollection.findOne({ rantCommentId: data.rantCommentId }, {
      _id: false,
      __v: false,
    }).lean();
  }

  async getReplies(query, options) {
    return this.RantCommentCollection.find(
      query,
      { _id: false, __v: 0 },
    ).skip(options.skip).limit(options.limit).lean();
  }

  async getRepliesCount(query) {
    return this.RantCommentCollection.countDocuments(query);
  }

  async findOneReply(key, value) {
    return this.RantCommentCollection.findOne({ [key]: value });
  }
}
