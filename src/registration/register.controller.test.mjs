import registerConstants from './register.constant.js';
import { Utils, PasswordUtils } from '../utils/index.util.js';
import { Collection, UserDbUtils } from '../../__test__/fakes/db.fakes.js';
import config from '../../__test__/fakes/utils.fake.js';
import next   from '../../__test__/fakes/next.fake.js';
import req    from '../../__test__/fakes/req.fake.js';
import res    from '../../__test__/fakes/res.fake.js';
import Registration from './register.controller.js';

const sucessfullyRegistered = {
  username: 'notexistsusername',
  email: 'notexists@example.com',
  completeReg: false,
  verified: false,
};

describe('Registration [Unit]', () => {
  
  const controller = new Registration(
    {
      Collections: { UsersCollection: Collection },
      DBUtils: { UserDbUtils },
      Utils: { Utils, PasswordUtils },
      config
    }
  );

  afterEach(() => {
    req.body = {};
  });

  describe('::firstRegStep', () => {
    let checkUserExistenceSpy;
    let saveUserSpy;
    let hashPasswordSpy;

    beforeEach(() => {
      checkUserExistenceSpy = spyOn(controller.registerService, 'checkUserExistence');
      saveUserSpy = spyOn(controller.registerService, 'saveUser');
      hashPasswordSpy = spyOn(controller.passwordUtils, "hashPassword");
    });

    afterEach(() => {
      checkUserExistenceSpy.calls.reset();
      saveUserSpy.calls.reset();
      hashPasswordSpy.calls.reset();
    });

    it('should throw ExistsException error when searching email that already exists', async () => {
      req.body = { email: 'exists@example.com', password: 'password', username: 'notexists' };
      checkUserExistenceSpy.and.resolveTo({ email: 'exists@example.com' });
      const result = await controller.firstRegStep(req, res, next);
      expect(result.status).toEqual(409);
      expect(result.message).toEqual(registerConstants.EMAIL_ALREADY_EXISTS);
      expect(controller.registerService.checkUserExistence).toHaveBeenCalled();
      expect(
        controller.registerService.checkUserExistence,
      ).toHaveBeenCalledWith(req.body.email, req.body.username);
    });

    it('should return username if it already exists', async () => {
      req.body = { email: 'notexists@example.com', password: 'password', username: 'existsusername' };
      checkUserExistenceSpy.and.resolveTo({ username: 'existsusername' });
      const register = await controller.firstRegStep(req, res, next);
      expect(register.status).toEqual(409);
      expect(register.message).toEqual(
        registerConstants.USERNAME_ALREADY_EXISTS,
      );
      expect(
        controller.registerService.checkUserExistence,
      ).toHaveBeenCalled();
      expect(
        controller.registerService.checkUserExistence,
      ).toHaveBeenCalledWith(req.body.email, req.body.username);
    });

    it('should register user', async () => {
      req.body = { email: 'notexists@example.com', password: 'password', username: 'notexistsusername' };

      hashPasswordSpy.and.resolveTo("xxxx");
      checkUserExistenceSpy.and.resolveTo(undefined);
      saveUserSpy.and.resolveTo(sucessfullyRegistered);

      const result = JSON.parse(await controller.firstRegStep(req, res, next));
      expect(controller.passwordUtils.hashPassword).toHaveBeenCalledWith("password");
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
      await controller.firstRegStep(req,res,next);
    });
  });

  describe("::lastRegStep", () => {
    let uniqueCodeGeneatorspy ;
    let updateUserAndCompleteRegSpy;
    beforeEach(() => {
      uniqueCodeGeneatorspy = spyOn(controller.Utils, 'GenerateUniqueId');
      updateUserAndCompleteRegSpy = spyOn(controller.registerService, 'updateUserAndCompletetReg');
      spyOn(
        controller.email,
        'sendEmailVerification'
      ).and.callFake(() => { });
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
      const result = JSON.parse(await controller.lastRegStep(req,res,next));
      expect(controller.Utils.GenerateUniqueId).toHaveBeenCalled();
      expect(controller.registerService.updateUserAndCompletetReg).toHaveBeenCalled();
      expect(controller.registerService.updateUserAndCompletetReg).toHaveBeenCalledWith({
        email: req.session.user.email,
        ...req.body,
        verificationToken:  "xxxx"
      });
      expect(result.status).toEqual(201);
      expect(result.message.verified).toEqual(false);
    });
    it("should delete verificationToken if this.env is not test", async () => {
      uniqueCodeGeneatorspy.and.resolveTo("xxxx");
      updateUserAndCompleteRegSpy.and.resolveTo({ verified: false , verificationToken : "xxxx" });
      controller.env = "not-test";
      const result = JSON.parse(await controller.lastRegStep(req,res,next));
      expect(controller.Utils.GenerateUniqueId).toHaveBeenCalled();
      expect(controller.registerService.updateUserAndCompletetReg).toHaveBeenCalled();
      expect(controller.registerService.updateUserAndCompletetReg).toHaveBeenCalledWith({
        email: req.session.user.email,
        ...req.body,
        verificationToken:  "xxxx"
      });
      expect(result.status).toEqual(201);
      expect(result.message.verified).toEqual(false);
      expect(result.message.verificationToken).not.toBeDefined();
    });
    it("call next on error", async () => {
      uniqueCodeGeneatorspy.and.throwError('x');
      await controller.lastRegStep(req,res,next);
    });
  });

  describe("::verificationToken", () => {
    let validateTokenAndSetVerify;
    beforeEach(() => {
      validateTokenAndSetVerify = spyOn(controller.registerService, "verifyValidationTokenAndSetVerified");
      req.params = { token: "xxxx" };
    });
    afterEach(() => {
      validateTokenAndSetVerify.calls.reset();
      req.params = {};
    });
    it("should verify user token and set verified to true", async () => {
      validateTokenAndSetVerify.and.resolveTo({ verified: true });
      const result = JSON.parse(await controller.verificationToken(req,res,next));
      expect(controller.registerService.verifyValidationTokenAndSetVerified).toHaveBeenCalled();
      expect(controller.registerService.verifyValidationTokenAndSetVerified).toHaveBeenCalledWith(
        "xxxx"
      );
      expect(result.status).toEqual(200);
      expect(result.message.verified).toEqual(true);
    });
    it("call next on error", async () => {
      validateTokenAndSetVerify.and.throwError('x');
      await controller.verificationToken(req,res,next);
    });
  });
});
