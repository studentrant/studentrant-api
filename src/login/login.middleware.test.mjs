import LoginValidatorMiddleware from './login.middleware-validator.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';
import loginConstants from './login.constant.js';

describe('LoginValidation [Unit]', () => {
  const loginValidatorMiddleware = new LoginValidatorMiddleware();
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
        loginValidatorMiddleware.passwordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('shoudl fail if password length is less than 8', () => {
      req.body.password = '111111';
      expect(() => {
        loginValidatorMiddleware.passwordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain digit', () => {
      req.body.password = 'abcdefghijilasdfl';
      expect(() => {
        loginValidatorMiddleware.passwordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain upper case character', () => {
      req.body.password = 'abcd123456';
      expect(() => {
        loginValidatorMiddleware.passwordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_UPPER_CASE);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain lower case', () => {
      req.body.password = '1234ABCDEFGHIKL';
      expect(() => {
        loginValidatorMiddleware.passwordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_LOWER_CASE);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if password does not contain special character', () => {
      req.body.password = 'studentRanT1234';
      expect(() => {
        loginValidatorMiddleware.passwordValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_SPECIAL_CHARACTER);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if the password meets the defined criteria', () => {
      req.body.password = 'studentRanT1234$$ &&';
      loginValidatorMiddleware.passwordValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::UserNameValidator', () => {
    it('should fail if username is not defined', () => {
      expect(() => {
        loginValidatorMiddleware.userNameValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if username is less than 5', () => {
      req.body.username = 'test';
      expect(() => {
        loginValidatorMiddleware.userNameValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if username meets the define criteria', () => {
      req.body.username = 'tester';
      loginValidatorMiddleware.userNameValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::EmailValidator', () => {
    it('should fail if email is not defined', () => {
      expect(() => {
        loginValidatorMiddleware.emailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.NO_EMAIL_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if email does not match regexp', () => {
      req.body.email = 'test@';
      expect(() => {
        loginValidatorMiddleware.emailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_EMAIL);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if email meets the defined criteria', () => {
      req.body.email = 'test@example.com';
      loginValidatorMiddleware.emailValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::UserNameAndEmailValidator', () => {
    it('should fail if email is not defined', () => {
      expect(() => {
        loginValidatorMiddleware.userNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if email does not match regexp', () => {
      req.body.email = 'test@';
      expect(() => {
        loginValidatorMiddleware.userNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_EMAIL);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if email meets the defined criteria', () => {
      req.body.email = 'test@example.com';
      loginValidatorMiddleware.userNameAndEmailValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });

    it('should fail if username is not defined', () => {
      expect(() => {
        loginValidatorMiddleware.userNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should fail if username is less than 5', () => {
      req.body.username = 'test';
      expect(() => {
        loginValidatorMiddleware.userNameAndEmailValidator(req, res, nextValue.next);
      }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should pass if username meets the define criteria', () => {
      req.body.username = 'tester';
      loginValidatorMiddleware.userNameAndEmailValidator(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
});
