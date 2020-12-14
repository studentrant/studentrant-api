import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import RantDbUtils from './rant.db.util.js';
import { Collection } from '../../../__test__/fakes/db.fakes.js';

describe('RantDbUtils [Unit]', () => {
  const rantDbUtils = new RantDbUtils(Collection);

  describe('::saveRant', () => {
    let collectionSaveSpy;
    let collectionFindOneSpy;
    let instanceOfCollection;
    beforeEach(() => {
      instanceOfCollection = new rantDbUtils.RantsCollection();
      collectionSaveSpy = spyOn(instanceOfCollection, 'save').and.callThrough();
      collectionFindOneSpy = spyOn(
        Collection,
        'findOne',
      ).and.callThrough();
    });

    afterEach(() => {
      collectionSaveSpy.calls.reset();
      collectionFindOneSpy.calls.reset();
    });

    it('should call save and findone mongodb methods', async () => {
      await rantDbUtils.saveRant({
        rantId: 'xxxx',
      });
      // expect(instanceOfCollection.save).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalledWith(
        { rantId: 'xxxx' },
        { _id: false, __v: false },
      );
    });
  });

  describe('::findOneRant', () => {
    let collectionFindOneSpy;
    beforeEach(() => {
      collectionFindOneSpy = spyOn(Collection, 'findOne').and.callThrough();
    });

    afterEach(() => {
      collectionFindOneSpy.calls.reset();
    });

    it('should call find one', async () => {
      await rantDbUtils.findOneRant({
        query: { foo: 'bar' },
        project: { bar: 'baz' },
      });
      expect(Collection.findOne).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalledWith(
        { foo: 'bar' },
        { bar: 'baz' },
      );
    });
  });

  describe('::deleteOneRant', () => {
    let updateOneSpy;
    beforeEach(() => {
      updateOneSpy = spyOn(Collection, 'updateOne').and.callThrough();
    });
    afterEach(() => {
      updateOneSpy.calls.reset();
    });
    it('should call updateOne', async () => {
      await rantDbUtils.deleteOneRant('xxxx');
      expect(Collection.updateOne).toHaveBeenCalled();
      expect(Collection.updateOne).toHaveBeenCalledWith(
        { rantId: 'xxxx' },
        { $set: { deleted: true } },
      );
    });
  });

  describe('::editOneRant', () => {
    let findOneAndUpdateSpy;
    beforeEach(() => {
      findOneAndUpdateSpy = spyOn(Collection, 'findOneAndUpdate').and.callThrough();
    });
    afterEach(() => {
      findOneAndUpdateSpy.calls.reset();
    });
    it('should call findOneAndUpdate', async () => {
      await rantDbUtils.editOneRant({
        query: { foo: 'bar' },
        operation: { bar: 'baz' },
      });
      expect(Collection.findOneAndUpdate).toHaveBeenCalled();
      expect(Collection.findOneAndUpdate).toHaveBeenCalledWith(
        { foo: 'bar' },
        { bar: 'baz' },
        {
          new: true,
          fields: {
            _id: false,
            __v: false,
            'edit.editHistory.diff._id': false,
            'edit.editHistory._id': false,
          },
        },
      );
    });
  });

  describe("::findOneVoter", () => {
    let collectionFindOneSpy;
    beforeEach(() => {
      collectionFindOneSpy = spyOn(Collection, 'findOne').and.callThrough();
    });

    afterEach(() => {
      collectionFindOneSpy.calls.reset();
    });

    it('should call findOneVoter', () => {
      const rantId = uuid();
      const userInternalId = mongoose.Types.ObjectId();
      rantDbUtils.findOneVoter("rantDownvote", rantId, userInternalId);
      expect(Collection.findOne).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalledWith({
        rantDownvote: { $in: userInternalId } ,
        rantId
      });
    });

  });

  describe("::removeOneVote", () => {
     let collectionFindOneSpy;
    beforeEach(() => {
      collectionFindOneSpy = spyOn(Collection, 'findOneAndUpdate').and.callThrough();
    });

    afterEach(() => {
      collectionFindOneSpy.calls.reset();
    });

    it('should remove one vote', () => {
      const rantId = uuid();
      const userInternalId = mongoose.Types.ObjectId();
      rantDbUtils.removeOneVote("rantDownvote", rantId, userInternalId);
      expect(Collection.findOneAndUpdate).toHaveBeenCalled();
      expect(Collection.findOneAndUpdate).toHaveBeenCalledWith(
        { rantId },
        { $pull: { rantDownvote: userInternalId } },
        {
          new: true,
          fields: {
            'edit.editHistory.diff._id': false,
            'edit.editHistory._id': false,
            _id: false,
            __v: false
          }
        }
      );
    });

  });

  describe("::upvote", () => {

    let updateOneSpy, findOneAndUpdateSpy;

    beforeEach(() => {
      updateOneSpy = spyOn(Collection, 'updateOne').and.callThrough();
      findOneAndUpdateSpy = spyOn(Collection, 'findOneAndUpdate').and.callThrough();
    });

    afterEach(() => {
      updateOneSpy.calls.reset();
      findOneAndUpdateSpy.calls.reset();
    });



    it('should call updateone and findoneandupadate', async () => {
      const rantId = uuid();
      const rantUpvoterId = mongoose.Types.ObjectId();
      await rantDbUtils.upvote(rantId, rantUpvoterId);
      expect(Collection.findOneAndUpdate).toHaveBeenCalled();
      expect(Collection.updateOne).toHaveBeenCalled();
      expect(Collection.updateOne).toHaveBeenCalledWith(
        {
          rantId, rantDownvote: { $in: rantUpvoterId }
        },
        {
          $pull: { rantDownvote: rantUpvoterId }
        }
      );

      expect(Collection.findOneAndUpdate).toHaveBeenCalledWith(
        { rantId },
        { $addToSet: { rantUpvote: rantUpvoterId } },
        {
          new: true,
          fields: {
            'edit.editHistory.diff._id': false,
            'edit.editHistory._id': false,
            _id: false,
            __v: false,
          },
        },
      );

    });

  });

  describe("::downvote", () => {

    let updateOneSpy, findOneAndUpdateSpy;

    beforeEach(() => {
      updateOneSpy = spyOn(Collection, 'updateOne').and.callThrough();
      findOneAndUpdateSpy = spyOn(Collection, 'findOneAndUpdate').and.callThrough();
    });

    afterEach(() => {
      updateOneSpy.calls.reset();
      findOneAndUpdateSpy.calls.reset();
    });

    it('should call updateone and findoneandupadate', async () => {
      const rantId = uuid();
      const rantDownvoterId = mongoose.Types.ObjectId();
      await rantDbUtils.downvote(rantId, rantDownvoterId);
      expect(Collection.findOneAndUpdate).toHaveBeenCalled();
      expect(Collection.updateOne).toHaveBeenCalled();
      expect(Collection.updateOne).toHaveBeenCalledWith(
        {
          rantId, rantUpvote: { $in: rantDownvoterId }
        },
        {
          $pull: { rantUpvote: rantDownvoterId }
        }
      );

      expect(Collection.findOneAndUpdate).toHaveBeenCalledWith(
        { rantId },
        { $addToSet: { rantDownvote: rantDownvoterId } },
        {
          new: true,
          fields: {
            'edit.editHistory.diff._id': false,
            'edit.editHistory._id': false,
            _id: false,
            __v: false,
          },
        },
      );

    });
  });

  describe("::get", () => {

    let findOneAndSpy;

    beforeEach(() => {
      findOneAndSpy = spyOn(Collection, 'findOne').and.callThrough();
    });

    afterEach(() => {
      findOneAndSpy.calls.reset();
    });

    it('should call findone', async () => {
      const rantId = uuid();
      await rantDbUtils.get(rantId);
      expect(Collection.findOne).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalledWith(
        { rantId },
        {
          _id: false,
          'rantPoster._id': false,
          'rantComments._id': false,
          'edit._id': false,
          'edit.editHistory._id': false,
          rantComments: false,
          deleted: false,
        },
      );
    });

  });

  describe("::findAllRants", () => {

    let aggregateSpy;

    beforeEach(() => {
      aggregateSpy = spyOn(Collection , 'aggregate').and.callThrough();
    });

    afterEach(() => {
      aggregateSpy.calls.reset();
    });

    it('call aggregate', async () => {
      await rantDbUtils.findAllRants([]);
      expect(Collection.aggregate).toHaveBeenCalled();
    });

  });

  describe("::getTotalRantsQuery", () => {
    let countDocumentsSpy;
    beforeEach(() => {
      countDocumentsSpy = spyOn(Collection , 'countDocuments').and.callThrough();
    });
    afterEach(() => {
      countDocumentsSpy.calls.reset();
    });
    it('should call countDocuments', async () => {
      const query = { foo: 'bar' };
      await rantDbUtils.getTotalRants(query);
      expect(Collection.countDocuments).toHaveBeenCalled();
      expect(Collection.countDocuments).toHaveBeenCalledWith(query);
    });
  });

});
