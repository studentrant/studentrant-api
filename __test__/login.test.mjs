import supertest from "supertest";
import app       from "../src/server.js";
import { loginConstants, authConstants } from "../src/constants/index.constant.js";

const agent = supertest(app);

describe("Login [Integration]", () => {
    it("status code of 412 if username field is not present", done => {
	agent
	    .post("/login")
	    .send({ password: "fakepassword" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
		done();
	    });
    });

    it("status code of 412 if username field is less than five charactes", done => {
	agent
	    .post("/login")
	    .send({ username: "abcd" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
		done();
	    });
    });

    it("status code of 412 if password field is empty", done =>  {
	agent
	    .post("/login")
	    .send({ username: "victory" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD);
		done();
	    });
    });

    it("status code of 412 if password field is less than 8", done => {
	agent
	    .post("/login")
	    .send({ username: "victory", password: "12345"})
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_LENGTH);
		done();
	    });
    });

    it("status code of 412 if passwod has no digit", done => {
	agent
	    .post("/login")
	    .send({ username: "victory", password: "abcdefghijkl" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT);
		done();
	    });
    });

    it("status code of 412 if password has no upper case characters", done => {
	agent
	    .post("/login")
	    .send({ username: "victory", password: "12345678" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_UPPER_CASE);
		done();
	    });
    });

    it("status code of 412 if password has no lowecase character", done => {
	agent
	    .post("/login")
	    .send({ username: "victory", password: "12345678ABCDEF" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_LOWER_CASE);
		done();
	    });
    });


    it("status code of 412 if password has no special character", done => {
	agent
	    .post("/login")
	    .send({ username: "victory", password: "12345678ABCDEFcdddd" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_SPECIAL_CHARACTER);
		done();
	    });	
    });

    it("status code of 412, if username field is present but invalid", done => {
	agent
	    .post("/login")
	    .send({ username: "vict", password: "password1234" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
		done();
	    });
    });

    it("status code of 412, if email field is present but invalid", done => {
	agent
	    .post("/login")
	    .send({ email: "vosikwemhe@", password: "123456abcdefgh" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(authConstants.INVALID_EMAIL);
		done();
	    });
    });

    it("status code of 404 if username and/or password does not match any data in the database", done => {
	agent
	    .post("/login")
	    .send({ username: "victory", password: "PasswORd1234abcdef$$&" })
	    .expect(404).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_CREDENTIALS);
		done();
	    });

    });
});
