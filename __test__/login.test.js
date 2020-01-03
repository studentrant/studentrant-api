"use strict";

const supertest = require("supertest");
const app       = require("../server.js");
const agent     = supertest(app);


const { loginConstants } = require("../constants/");


describe("POST /login", () => {
    it("status code of 404 of resource does not exists if logining with email", (done) => {
	console.log("hi");
	agent
	    .post("/login")
	    .send({ email: "fakeemail@example.com", password: "fakepassword" })
	    .expect(404).end((err,res) => {
		expect(err).not.toBeNull();
		expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_CREDENTIALS);
		done();
	    });
    });
});
