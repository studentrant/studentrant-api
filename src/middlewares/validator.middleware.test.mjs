import ValidatorMiddleware from "./validator.middleware.js";
import { req } from "../../__test__/fakes/req.fake.js";
import { res } from "../../__test__/fakes/res.fake.js";
import { next } from "../../__test__/fakes/next.fake.js";
import { loginConstants, authConstants } from "../constants/index.constant.js";


describe("ValidatorMiddleware [Unit]", () => {

    const nextValue =  { next };
    let   nextSpy;

    beforeEach(() => {
	nextSpy = spyOn(nextValue, "next").and.callThrough();
    });

    afterEach(() => {
	nextSpy.calls.reset();
	req.body = {};
    });

    describe("::PasswordValidator", () => {

	it("should fail if password field is present", () => {
	    expect(function() {
		ValidatorMiddleware.PasswordValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("shoudl fail if password length is less than 8", () => {
	    req.body.password = "111111";
	    expect(function() {
		ValidatorMiddleware.PasswordValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_LENGTH);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should fail if password does not contain digit", () => {
	    req.body.password = "abcdefghijilasdfl";
	    expect(function() {
		ValidatorMiddleware.PasswordValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should fail if password does not contain upper case character", () => {
	    req.body.password = "abcd123456";
	    expect(function() {
		ValidatorMiddleware.PasswordValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_UPPER_CASE);
	    expect(nextValue.next).not.toHaveBeenCalled();

	});

	it("should fail if password does not contain lower case", () => {
	    req.body.password = "1234ABCDEFGHIKL";
	    expect(function() {
		ValidatorMiddleware.PasswordValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_LOWER_CASE);
	    expect(nextValue.next).not.toHaveBeenCalled();

	});

	it("should fail if password does not contain special character", () => {
	    req.body.password = "studentRanT1234";
	    expect(function() {
		ValidatorMiddleware.PasswordValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_PASSWORD_NO_SPECIAL_CHARACTER);
	    expect(nextValue.next).not.toHaveBeenCalled();

	});

	it("should pass if the password meets the defined criteria", () => {
	    req.body.password = "studentRanT1234$$ &&";
	    ValidatorMiddleware.PasswordValidator(req,res,nextValue.next);
	    expect(nextValue.next).toHaveBeenCalled();
	});
    });

    describe("::UserNameValidator", () => {
	it("should fail if username is not defined", () => {
	    expect(function() {
		ValidatorMiddleware.UserNameValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should fail if username is less than 5", () => {
	    req.body.username = "test";
	    expect(function() {
		ValidatorMiddleware.UserNameValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should pass if username meets the define criteria", () => {
	    req.body.username = "tester";
	    ValidatorMiddleware.UserNameValidator(req,res,nextValue.next);
	    expect(nextValue.next).toHaveBeenCalled();
	});
    });

    describe("::EmailValidator", () => {

	it("should fail if email is not defined", () => {
	    expect(function() {
		ValidatorMiddleware.EmailValidator(req,res,nextValue.next);
	    }).toThrowError(authConstants.NO_EMAIL_FIELD);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should fail if email does not match regexp", () => {
	    req.body.email = "test@";
	    expect(function() {
		ValidatorMiddleware.EmailValidator(req,res,nextValue.next);
	    }).toThrowError(authConstants.INVALID_EMAIL);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should pass if email meets the defined criteria", () => {
	    req.body.email = "test@example.com";
	    ValidatorMiddleware.EmailValidator(req,res,nextValue.next);
	    expect(nextValue.next).toHaveBeenCalled();
	});
    });

    describe("::UserNameAndEmailValidator", () => {

	it("should fail if email is not defined", () => {
	    expect(function() {
		ValidatorMiddleware.UserNameAndEmailValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should fail if email does not match regexp", () => {
	    req.body.email = "test@";
	    expect(function() {
		ValidatorMiddleware.UserNameAndEmailValidator(req,res,nextValue.next);
	    }).toThrowError(authConstants.INVALID_EMAIL);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should pass if email meets the defined criteria", () => {
	    req.body.email = "test@example.com";
	    ValidatorMiddleware.UserNameAndEmailValidator(req,res,nextValue.next);
	    expect(nextValue.next).toHaveBeenCalled();
	});

	it("should fail if username is not defined", () => {
	    expect(function() {
		ValidatorMiddleware.UserNameAndEmailValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should fail if username is less than 5", () => {
	    req.body.username = "test";
	    expect(function() {
		ValidatorMiddleware.UserNameAndEmailValidator(req,res,nextValue.next);
	    }).toThrowError(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
	    expect(nextValue.next).not.toHaveBeenCalled();
	});

	it("should pass if username meets the define criteria", () => {
	    req.body.username = "tester";
	    ValidatorMiddleware.UserNameAndEmailValidator(req,res,nextValue.next);
	    expect(nextValue.next).toHaveBeenCalled();
	});
    });

});
