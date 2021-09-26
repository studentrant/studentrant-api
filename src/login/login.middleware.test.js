import ValidatorMiddleware from './validator.middleware.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';
import { loginConstants, authConstants, registerConstants } from '../constants/index.constant.js';

describe('ValidatorMiddleware [Unit]', () => {
  const nextValue = { next };
  let nextSpy;

  beforeEach(() => {
    nextSpy = spyOn(nextValue, 'next').and.callThrough();
  });

  afterEach(() => {
    nextSpy.calls.reset();
    req.body = {};
    req.params = {};
  });

  describe('::PasswordValidator', () => {
    it('should fail if password field is present', () => {
      expect(() => {
        ValidatorMiddleware.PasswordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('shoudl fail if password length is less than 8', () => {
      req.body.password = '111111';
      expect(() => {
        ValidatorMiddleware.PasswordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain digit', () => {
      req.body.password = 'abcdefghijilasdfl';
      expect(() => {
        ValidatorMiddleware.PasswordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain upper case character', () => {
      req.body.password = 'abcd123456';
      expect(() => {
        ValidatorMiddleware.PasswordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_UPPER_CASE);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain lower case', () => {
      req.body.password = '1234ABCDEFGHIKL';
      expect(() => {
        ValidatorMiddleware.PasswordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_LOWER_CASE);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain special character', () => {
      req.body.password = 'studentRanT1234';
      expect(() => {
        ValidatorMiddleware.PasswordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_SPECIAL_CHARACTER);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if the password meets the defined criteria', () => {
      req.body.password = 'studentRanT1234$$ &&';
      ValidatorMiddleware.PasswordValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::UserNameValidator', () => {
    it('should fail if username is not defined', () => {
      expect(() => {
        ValidatorMiddleware.UserNameValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if username is less than 5', () => {
      req.body.username = 'test';
      expect(() => {
        ValidatorMiddleware.UserNameValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if username meets the define criteria', () => {
      req.body.username = 'tester';
      ValidatorMiddleware.UserNameValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::EmailValidator', () => {
    it('should fail if email is not defined', () => {
      expect(() => {
        ValidatorMiddleware.EmailValidator(req, res, nextValue.next);
      }).toThrowError(authConstants.NO_EMAIL_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if email does not match regexp', () => {
      req.body.email = 'test@';
      expect(() => {
        ValidatorMiddleware.EmailValidator(req, res, nextValue.next);
      }).toThrowError(authConstants.INVALID_EMAIL);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if email meets the defined criteria', () => {
      req.body.email = 'test@example.com';
      ValidatorMiddleware.EmailValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::UserNameAndEmailValidator', () => {
    it('should fail if email is not defined', () => {
      expect(() => {
        ValidatorMiddleware.UserNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if email does not match regexp', () => {
      req.body.email = 'test@';
      expect(() => {
        ValidatorMiddleware.UserNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(authConstants.INVALID_EMAIL);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if email meets the defined criteria', () => {
      req.body.email = 'test@example.com';
      ValidatorMiddleware.UserNameAndEmailValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });

    it('should fail if username is not defined', () => {
      expect(() => {
        ValidatorMiddleware.UserNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if username is less than 5', () => {
      req.body.username = 'test';
      expect(() => {
        ValidatorMiddleware.UserNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if username meets the define criteria', () => {
      req.body.username = 'tester';
      ValidatorMiddleware.UserNameAndEmailValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
  describe("::CheckAvatar", () => {
    it('should fail if req.body.avatar is undefined', () => {
      expect(() => {
        ValidatorMiddleware.CheckAvatar(req, res, nextValue.next);
      }).toThrowError(authConstants.NO_AVATAR_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.body.avatar is defined', () => {
      req.body.avatar = 'x';
      ValidatorMiddleware.CheckAvatar(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
  describe("::CheckCountry", () => {
    it('fail if req.body.country is undefined', () => {
      expect(() => {
        ValidatorMiddleware.CheckCountry(req, res, nextValue.next);
      }).toThrowError(authConstants.COUNTRY_PROPERTY_UNDEFINED);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('fail if req.body.country is les than 2', () => {
      req.body.country = 'N';
      expect(() => {
        ValidatorMiddleware.CheckCountry(req, res, nextValue.next);
      }).toThrowError(authConstants.INVALID_COUNTRY_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.body.country is defined', () => {
      req.body.country = 'NG';
      ValidatorMiddleware.CheckCountry(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
  describe('::CheckInterests', () => {
    it('fail if req.body.interests is undefined', () => {
      expect(() => {
        ValidatorMiddleware.CheckInterests(req, res, nextValue.next);
      }).toThrowError(authConstants.NO_INTEREST_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('fail if req.body.interests is not an array', () => {
      req.body.interests = 'N';
      expect(() => {
        ValidatorMiddleware.CheckInterests(req, res, nextValue.next);
      }).toThrowError(authConstants.NO_ARRAY_INTERESTS);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('fail if req.body.interests is an empty array', () => {
      req.body.interests = [];
      expect(() => {
        ValidatorMiddleware.CheckInterests(req, res, nextValue.next);
      }).toThrowError(authConstants.NO_INTERESTS_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.body.country is defined', () => {
      req.body.interests = [ 'coding', 'vlogging' ];
      ValidatorMiddleware.CheckInterests(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
  describe("::CheckVerificationToken", () => {
    it('should fail if req.params.token is undefined', () => {
      expect(() => {
        ValidatorMiddleware.CheckVerificationToken(req, res, nextValue.next);
      }).toThrowError(registerConstants.INVALID_VERIFICATION_TOKEN);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should pass if req.params.token is defined', () => {
      req.params.token = "xxxx";
      ValidatorMiddleware.CheckVerificationToken(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
});
