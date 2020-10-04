export default class RantDbUtils {
  constructor(rantsCollection) {
    this.RantsCollection = rantsCollection;
  }

  async saveRant(data) {
    await (new this.RantsCollection(data).save());
    return this.RantsCollection.findOne({ rantId: data.rantId }, {
      _id: false,
      __v: false,
    }).lean();
  }

  findOneRant(ops) {
    return this.RantsCollection.findOne(
      ops.query,
      ops.project,
    ).lean();
  }

  deleteOneRant(rantId) {
    return this.RantsCollection.updateOne(
      { rantId },
      { $set: { deleted: true } },
    ).lean();
  }

  editOneRant({ query, operation }) {
    const extraOption = {
      new: true,
      fields: {
        _id: false,
        __v: false,
        'edit.editHistory.diff._id': false,
        'edit.editHistory._id': false,
      },
    };
    return this.RantsCollection.findOneAndUpdate(
      query,
      operation,
      extraOption,
    ).lean();
  }
}
