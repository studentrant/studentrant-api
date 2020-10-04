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
});
