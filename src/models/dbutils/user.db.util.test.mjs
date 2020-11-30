import UserDbUtils from './user.db.util.js';
import { Collection } from '../../../__test__/fakes/db.fakes.js';

describe('UserdbUtils [Unit]', () => {
  const userdbUtils = new UserDbUtils(Collection);
  describe('::saveNewUser', () => {
    let collectionSaveSpy;
    let collectionFindOneSpy;
    let instanceOfCollection;
    beforeEach(() => {
      instanceOfCollection = new userdbUtils.UsersCollection();
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

    it('should save call findOne', async () => {
      await userdbUtils.saveNewUser({ foo: 'bar', email: 'test@example.com' });
      // expect(instanceOfCollection.save).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        {
          _id: false, __v: false, password: false, dateOfReg: false,
        },
      );
    });
  });

  describe('::updateUserInfo', () => {
    let findOneAndUpdateSpy;
    beforeEach(() => {
      findOneAndUpdateSpy = spyOn(Collection, 'findOneAndUpdate').and.callThrough();
    });
    afterEach(() => {
      findOneAndUpdateSpy.calls.reset();
    });
    it('should call findOneAndUpdate', async () => {
      await userdbUtils.updateUserInfo({
        criteria: { foo: 'bar' },
        data: { bar: 'baz' },
        options: { foo: true, bar: true },
      });
      expect(Collection.findOneAndUpdate).toHaveBeenCalled();
      expect(Collection.findOneAndUpdate).toHaveBeenCalledWith(
        { foo: 'bar' },
        { bar: 'baz' },
        { foo: true, bar: true },
      );
    });
  });

  describe('::verifyUserRegTokenAndGetData', () => {
    let findOneAndUpdateSpy;
    beforeEach(() => {
      findOneAndUpdateSpy = spyOn(Collection, 'findOneAndUpdate').and.callThrough();
    });
    afterEach(() => {
      findOneAndUpdateSpy.calls.reset();
    });
    it('should call findOneAndUpdate', async () => {
      await userdbUtils.verifyUserRegTokenAndGetData('xxxx');
      expect(Collection.findOneAndUpdate).toHaveBeenCalled();
      expect(Collection.findOneAndUpdate).toHaveBeenCalledWith(
        { verificationLink: 'xxxx' },
        { $unset: { verificationLink: 1 } },
        {
          new: false,
          fields: {
            password: false, _id: false, __v: false, dateOfReg: false,
          },
        },
      );
    });
  });

  describe('::checkUserExists', () => {
    let findOneSpy;
    beforeEach(() => {
      findOneSpy = spyOn(Collection, 'findOne').and.callThrough();
    });
    afterEach(() => {
      findOneSpy.calls.reset();
    });
    it('should call findOne', async () => {
      await userdbUtils.checkUserExists('foo', 'bar');
      expect(Collection.findOne).toHaveBeenCalled();
      expect(Collection.findOne).toHaveBeenCalledWith(
        { foo: 'bar' },
        { foo: true },
      );
    });
  });
});
