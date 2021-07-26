/* eslint-disable no-unused-vars */
import { RegisterService } from './register.service.js';
import { UserDbUtils, Collection } from '../../__test__/fakes/db.fakes.js';
import * as Utils from '../utils/index.util.js';

describe('RegisterService [Unit]', () => {
  const service = new RegisterService(
    new UserDbUtils(Collection),
    Utils,
  );

  let updateUserInfo;
  let UpdateUserDetails;
  let getUserVerificationTokenSpy;

  beforeEach(() => {
    updateUserInfo = spyOn(service.registerDbUtils, 'updateUserInfo');
    UpdateUserDetails = spyOn(RegisterService, 'UpdateUserDetails').and.callThrough();
    getUserVerificationTokenSpy = spyOn(service.registerDbUtils, 'getUserVerificationToken')
  });

  afterEach(() => {
    updateUserInfo.calls.reset();
    UpdateUserDetails.calls.reset();
  });

  describe('::UpdateUserDetails', () => {
    it('should return all values except sensitive values', async () => {
      updateUserInfo.and.resolveTo({});
      const result = await RegisterService.UpdateUserDetails(['fake-1', 'fake-2'], { foo: 'bar', foobar: 'baz' });
      expect(service.registerDbUtils.updateUserInfo).toHaveBeenCalled();
      expect(service.registerDbUtils.updateUserInfo).toHaveBeenCalledWith({
        criteria: { 'fake-1': 'fake-2' },
        data: { foo: 'bar', foobar: 'baz' },
        options: {
          new: true,
          fields: {
            password: false,
            dateOfReg: false,
            _id: false,
            __v: false,
          },
        },
      });
    });
  });

  describe('::checkUserExistencse', () => {
    let checkEmailSpy;
    let checkUserNameSpy;
    beforeEach(() => {
      checkEmailSpy = spyOn(service.registerDbUtils, 'checkEmail');
      checkUserNameSpy = spyOn(service.registerDbUtils, 'checkUserName');
    });
    afterEach(() => {
      checkEmailSpy.calls.reset();
      checkUserNameSpy.calls.reset();
    });
    it('should call checkEmail() and not call checkUserName() ', async () => {
      checkEmailSpy.and.resolveTo({ email: 'email@example.com' });
      const result = await service.checkUserExistence('email@example.com', 'username');
      expect(service.registerDbUtils.checkEmail).toHaveBeenCalled();
      expect(service.registerDbUtils.checkEmail).toHaveBeenCalledWith('email@example.com');
      expect(service.registerDbUtils.checkUserName).not.toHaveBeenCalled();
    });
    it('should call checkUserName() and also call checkEmail() but should resolve undefined for checkEmail()', async () => {
      checkEmailSpy.and.resolveTo(null);
      checkUserNameSpy.and.resolveTo({ username: 'username' });

      const result = await service.checkUserExistence('email@example.com', 'username');
      expect(service.registerDbUtils.checkEmail).toHaveBeenCalled();
      expect(service.registerDbUtils.checkEmail).toHaveBeenCalledWith('email@example.com');
      expect(service.registerDbUtils.checkUserName).toHaveBeenCalled();
      expect(service.registerDbUtils.checkUserName).toHaveBeenCalledWith('username');
    });
  });

  describe('::saveUser', () => {
    let saveUserSpy;
    beforeEach(() => {
      saveUserSpy = spyOn(service.registerDbUtils, 'saveNewUser');
    });
    afterEach(() => {
      saveUserSpy.calls.reset();
    });
    it('should save new user', async () => {
      saveUserSpy.and.resolveTo({});
      const result = await service.saveUser({ username: 'username', password: 'xxxx', email: 'email@example.com' });
      expect(service.registerDbUtils.saveNewUser).toHaveBeenCalled();
      expect(service.registerDbUtils.saveNewUser).toHaveBeenCalledWith({
        username: 'username',
        email: 'email@example.com',
        password: 'xxxx',
      });
    });
  });

  describe('::verifyValidationTokenAndSetVerified', () => {
    it('should verify validation token', async () => {
      updateUserInfo.and.resolveTo({});
      const result = await service.verifyValidationTokenAndSetVerified('xxxx');
      expect(RegisterService.UpdateUserDetails).toHaveBeenCalled();
      expect(RegisterService.UpdateUserDetails).toHaveBeenCalledWith(
        ['verificationToken', 'xxxx'],
        {
          $unset: { verificationToken: 1 },
          $set: { verified: true },
        },
      );
    });
  });

  describe('::updateUserAndCompleteReg', () => {
    it('should verify validation token', async () => {
      updateUserInfo.and.resolveTo({});
      await service.updateUserAndCompletetReg({ email: 'email@example.com' });
      expect(RegisterService.UpdateUserDetails).toHaveBeenCalled();
      expect(RegisterService.UpdateUserDetails).toHaveBeenCalledWith(
        ['email', 'email@example.com'],
        {
          $set: { email: 'email@example.com', completeReg: true },
        },
      );
    });
  });

  describe('::getVerificationToken', () => {
    it('should get verification token', async () => {
      getUserVerificationTokenSpy.and.resolveTo('verification_token');
      const result = await service.getVerificationToken('user_id');
      expect(result).toEqual('verification_token');
      expect(service.registerDbUtils.getUserVerificationToken).toHaveBeenCalled();
      expect(service.registerDbUtils.getUserVerificationToken).toHaveBeenCalledWith('user_id');
    });
  });
});
