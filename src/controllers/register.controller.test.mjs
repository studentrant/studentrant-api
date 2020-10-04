import * as constants from '../constants/index.constant.js';
import { usersCollection } from '../models/dbmodels/index.model.js';
import { Utils, PasswordUtils } from '../utils/index.util.js';
import config from '../../__test__/fakes/utils.fake.js';
import next   from '../../__test__/fakes/next.fake.js';
import req    from '../../__test__/fakes/req.fake.js';
import res    from '../../__test__/fakes/res.fake.js';
import Email  from '../service/email.service.js';

import RegisterDbUtils from '../models/dbutils/register.db.util.js';
import Registration from './register.controller.js';

const sucessfullyRegistered = {
  username: 'notexistsusername',
  email: 'notexists@example.com',
  completeReg: false,
  verified: false,
};

describe('Registration [Unit]', () => {
  const registerController = new Registration(
    RegisterDbUtils,
    Email,
    Utils,
    PasswordUtils,
    usersCollection,
    config,
  );

  afterEach(() => {
    req.body = {};
  });

  describe('::firstRegStep', () => {
    let checkUserExistenceSpy; let
      saveUserSpy;

    beforeEach(() => {
      checkUserExistenceSpy = spyOn(registerController.registerService, 'checkUserExistence');
      saveUserSpy = spyOn(registerController.registerService, 'saveUser');
    });

    afterEach(() => {
      checkUserExistenceSpy.calls.reset();
      saveUserSpy.calls.reset();
    });

    it('should throw ExistsException error when searching email that already exists', async () => {
      req.body = { email: 'exists@example.com', password: 'password', username: 'notexists' };
      checkUserExistenceSpy.and.resolveTo({ email: 'exists@example.com' });
      const result = await registerController.firstRegStep(req, res, next);
      expect(result.status).toEqual(409);
      expect(result.message).toEqual(constants.registerConstants.EMAIL_ALREADY_EXISTS);
      expect(registerController.registerService.checkUserExistence).toHaveBeenCalled();
      expect(
        registerController.registerService.checkUserExistence,
      ).toHaveBeenCalledWith(req.body.email, req.body.username);
    });

    it('should return username if it already exists', async () => {
      req.body = { email: 'notexists@example.com', password: 'password', username: 'existsusername' };
      checkUserExistenceSpy.and.resolveTo({ username: 'existsusername' });
      const register = await registerController.firstRegStep(req, res, next);
      expect(register.status).toEqual(409);
      expect(register.message).toEqual(
        constants.registerConstants.USERNAME_ALREADY_EXISTS,
      );
      expect(
        registerController.registerService.checkUserExistence,
      ).toHaveBeenCalled();
      expect(
        registerController.registerService.checkUserExistence,
      ).toHaveBeenCalledWith(req.body.email, req.body.username);
    });

    it('should register user', async () => {
      req.body = { email: 'notexists@example.com', password: 'password', username: 'notexistsusername' };

      checkUserExistenceSpy.and.resolveTo(undefined);
      saveUserSpy.and.resolveTo(sucessfullyRegistered);

      const result = JSON.parse(await registerController.firstRegStep(req, res, next));

      expect(result.status).toEqual(201);
      expect(result.message.password).toBeUndefined();
      expect(result.message._id).toBeUndefined();
      expect(result.message.__v).toBeUndefined();
      expect(req.session.user).toBeDefined();
      expect(req.session.user).toEqual(result.message);
      expect(result.message).toEqual(sucessfullyRegistered);
    });
    it("call next on error", async () => {
      checkUserExistenceSpy.and.throwError('x');
      await registerController.firstRegStep(req,res,next);
    });
  });

  describe("::lastRegStep", () => {
    let uniqueCodeGeneatorspy ;
    let updateUserAndCompleteRegSpy;
    beforeEach(() => {
      uniqueCodeGeneatorspy = spyOn(registerController.Utils, 'UniqueCodeGenerator');
      updateUserAndCompleteRegSpy = spyOn(registerController.registerService, 'updateUserAndCompletetReg');
      req.body    = { country: "Nigeria", interests: [ "exposed" ] };
      req.session = { user: { email: "test@example.com" } };
    });

    afterEach(() => {
      uniqueCodeGeneatorspy.calls.reset();
      updateUserAndCompleteRegSpy.calls.reset();
      req.body = {};
      req.session = {};
    });

    it("should complete last reg step", async () => {
      uniqueCodeGeneatorspy.and.resolveTo("xxxx");
      updateUserAndCompleteRegSpy.and.resolveTo({ verified: false });
      const result = JSON.parse(await registerController.lastRegStep(req,res,next));
      expect(registerController.Utils.UniqueCodeGenerator).toHaveBeenCalled();
      expect(registerController.Utils.UniqueCodeGenerator).toHaveBeenCalledWith(req.session.user.email);
      expect(registerController.registerService.updateUserAndCompletetReg).toHaveBeenCalled();
      expect(registerController.registerService.updateUserAndCompletetReg).toHaveBeenCalledWith({
        email: req.session.user.email,
        ...req.body,
        verificationLink:  "xxxx"
      });
      expect(result.status).toEqual(201);
      expect(result.message.verified).toEqual(false);
    });
    it("should delete verificationLink if this.env is not test", async () => {
      uniqueCodeGeneatorspy.and.resolveTo("xxxx");
      updateUserAndCompleteRegSpy.and.resolveTo({ verified: false , verificationLink : "xxxx" });
      registerController.env = "not-test";
      const result = JSON.parse(await registerController.lastRegStep(req,res,next));
      expect(registerController.Utils.UniqueCodeGenerator).toHaveBeenCalled();
      expect(registerController.Utils.UniqueCodeGenerator).toHaveBeenCalledWith(req.session.user.email);
      expect(registerController.registerService.updateUserAndCompletetReg).toHaveBeenCalled();
      expect(registerController.registerService.updateUserAndCompletetReg).toHaveBeenCalledWith({
        email: req.session.user.email,
        ...req.body,
        verificationLink:  "xxxx"
      });
      expect(result.status).toEqual(201);
      expect(result.message.verified).toEqual(false);
      expect(result.message.verificationLink).not.toBeDefined();
    });
    it("call next on error", async () => {
      uniqueCodeGeneatorspy.and.throwError('x');
      await registerController.lastRegStep(req,res,next);
    });
  });

  describe("::verificationLink", () => {
    let verifyValidationTokenAndSetVerifiedSpy;
    beforeEach(() => {
      verifyValidationTokenAndSetVerifiedSpy = spyOn(registerController.registerService, "verifyValidationTokenAndSetVerified");
      req.params = { token: "xxxx" };
    });
    afterEach(() => {
      verifyValidationTokenAndSetVerifiedSpy.calls.reset();
      req.params = {};
    });
    it("should verify user token and set verified to true", async () => {
      verifyValidationTokenAndSetVerifiedSpy.and.resolveTo({ verified: true });
      const result = JSON.parse(await registerController.verificationToken(req,res,next));
      expect(registerController.registerService.verifyValidationTokenAndSetVerified).toHaveBeenCalled();
      expect(registerController.registerService.verifyValidationTokenAndSetVerified).toHaveBeenCalledWith(
        "xxxx"
      );
      expect(result.status).toEqual(200);
      expect(result.message.verified).toEqual(true);
    });
    it("call next on error", async () => {
      verifyValidationTokenAndSetVerifiedSpy.and.throwError('x');
      await registerController.verificationToken(req,res,next);
    });
  });
});
