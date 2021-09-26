import RegistrationValidatorMiddleware from './register.middleware-validator.js';
import registerConstants from '../registration/register.constant.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';

describe('RegistrationValidation [Unit]', () => {
  const registrationValidatorMiddleware = new RegistrationValidatorMiddleware();
  const nextValue = { next };
  let nextSpy;

  beforeEach(() => {
      nextSpy = spyOn(nextValue, 'next').and.callThrough();
  });

  describe("::CheckAvatar", () => {
    it('should fail if req.body.avatar is undefined', () => {
      expect(() => {
        registrationValidatorMiddleware.checkAvatar(req, res, nextValue.next);
      }).toThrowError(registerConstants.NO_AVATAR_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.body.avatar is defined', () => {
      req.body.avatar = 'x';
      registrationValidatorMiddleware.checkAvatar(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
  describe("::CheckCountry", () => {
    it('fail if req.body.country is undefined', () => {
      expect(() => {
        registrationValidatorMiddleware.checkCountry(req, res, nextValue.next);
      }).toThrowError(registerConstants.COUNTRY_PROPERTY_UNDEFINED);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('fail if req.body.country is les than 2', () => {
      req.body.country = 'N';
      expect(() => {
        registrationValidatorMiddleware.checkCountry(req, res, nextValue.next);
      }).toThrowError(registerConstants.INVALID_COUNTRY_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.body.country is defined', () => {
      req.body.country = 'NG';
      registrationValidatorMiddleware.checkCountry(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
  describe('::CheckInterests', () => {
    it('fail if req.body.interests is undefined', () => {
      expect(() => {
        registrationValidatorMiddleware.checkInterests(req, res, nextValue.next);
      }).toThrowError(registerConstants.NO_INTEREST_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('fail if req.body.interests is not an array', () => {
      req.body.interests = 'N';
      expect(() => {
        registrationValidatorMiddleware.checkInterests(req, res, nextValue.next);
      }).toThrowError(registerConstants.NO_ARRAY_INTERESTS);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('fail if req.body.interests is an empty array', () => {
      req.body.interests = [];
      expect(() => {
        registrationValidatorMiddleware.checkInterests(req, res, nextValue.next);
      }).toThrowError(registerConstants.NO_INTERESTS_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.body.country is defined', () => {
      req.body.interests = ['coding', 'vlogging'];
      registrationValidatorMiddleware.checkInterests(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
  describe("::CheckVerificationToken", () => {
    it('should fail if req.params.token is undefined', () => {
      expect(() => {
        registrationValidatorMiddleware.checkVerificationToken(req, res, nextValue.next);
      }).toThrowError(registerConstants.INVALID_VERIFICATION_TOKEN);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.params.token is defined', () => {
      req.params.token = "xxxx";
      registrationValidatorMiddleware.checkVerificationToken(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
});
