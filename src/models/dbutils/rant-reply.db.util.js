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
}
