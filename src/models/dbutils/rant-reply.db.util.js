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

  async getReplies(pipeline) {
    return this.RantCommentCollection.aggregate(
      [
        pipeline.matchComments,
        pipeline.skipUnwanted,
        pipeline.limitComment,
        pipeline.getNReplyCountAndFirstNReply,
        pipeline.removeUnwanted,
        // pipeline.getChildCommentAsObject
      ],
    );
  }

  async getRepliesCount(query) {
    return this.RantCommentCollection.countDocuments(query);
  }

  async findOneReply(key, value) {
    return this.RantCommentCollection.findOne({ [key]: value });
  }
}
