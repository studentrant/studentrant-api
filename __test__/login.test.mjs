import supertest from "supertest";
import app       from "../src/server.js";
import { loginConstants, authConstants } from "../src/constants/index.constant.js";

const agent = supertest(app);

describe("Login [Unit]", () => {
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

    it("status code of 412 if password has no characters", done => {
	agent
	    .post("/login")
	    .send({ username: "victory", password: "12345678" })
	    .expect(412).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_CHARS);
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
	    .send({ username: "victory", password: "password1234" })
	    .expect(404).end((err,res) => {
		expect(err).toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_CREDENTIALS);
		done();
	    });

    });
});
