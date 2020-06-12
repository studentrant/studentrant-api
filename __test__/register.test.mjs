"use strict";

import * as async     from "async";
import supertest from "supertest";
import app       from "../server.js";
import { users } from "../models/dbmodels/index.js";

import {
    registerConstants,
    loginConstants,
    authConstants
} from "../constants/index.js";

const agent     = supertest(app);
let cookie, verificationLink;

describe("[Register]", () => {

    describe("POST /reg-first-step", () => {
        it("status code of 412 if username field is not present", done => {
	    agent
	        .post("/register/reg-first-step")
	        .send({ })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD);
		    done();
	        });
        });
        it("status code of 412 if username length is less than 5", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "test" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_USERNAME_LENGTH);
		    done();
	        });
        });
        it("status code of 412 if password is not defined", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD);
		    done();
	        });
        });
        it("stauts code of 412 if password length is less than 8", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "12345" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_LENGTH);
		    done();
	        });
        });
        it("status code of 412 if password has no digit", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "abcdefghijklmnoq" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT);
		    done();
	        });
        });
        it("status code of 412 if password contains no charactes", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "12345689234" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(loginConstants.INVALID_LOGIN_PASSWORD_NO_CHARS);
		    done();
	        });
        });
        it("status code of 412 if email field is undefined", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "12345689234abcd" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(authConstants.NO_EMAIL_FIELD);
		    done();
	        });
        });
        it("status code of 412 if email does not match define regex", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "12345689234abcd", email: "victory@" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(authConstants.INVALID_EMAIL);
		    done();
	        });
        });
        it("status code of 201 if user account is created", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "12345689234abcd", email: "zombieleetnca@gmail.com" })
	        .expect(201).end((err,res) => {
		    cookie = res.headers["set-cookie"];
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(jasmine.any(Object));
		    done();
	        });
        });
        it("should return provided email address is not available", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "12345689234abcd", email: "zombieleetnca@gmail.com" })
	        .expect(409).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(registerConstants.EMAIL_ALREADY_EXISTS);
		    done();
	        });
        });

        it("should return provided username is not available", done => {
            agent
	        .post("/register/reg-first-step")
	        .send({ username: "zombieleet", password: "12345689234abcd", email: "victory-developer@example.com" })
	        .expect(409).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(registerConstants.USERNAME_ALREADY_EXISTS);
		    done();
	        });
        });

        it("should return status of 200 and set completeReg to false for incomplete registration", done => {
	    agent
		.post("/login")
		.send({ username: "zombieleet", password: "12345689234abcd" })
		.expect(200).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(200);
		    expect(res.body.message.completeReg).toEqual(false);
		    done();
		});

        });
    });

    describe("POST /reg-last-step", () => {
    	it("should return status code of 412 if country is undefined", done => {
	    agent
		.patch("/register/reg-last-step")
		.set("cookie", cookie)
		.send({ country: undefined })
		.expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(authConstants.COUNTRY_PROPERTY_UNDEFINED);
		    expect(res.body.status).toEqual(412);
		    done();
		});
    	});
	it("should return status code of 412 if country does not exists", done => {
	    agent
		.patch("/register/reg-last-step")
		.set("cookie", cookie)
		.send( { country: "a" } )
		.expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(authConstants.INVALID_COUNTRY_LENGTH);
		    expect(res.body.status).toEqual(412);
		    done();
		});
	});
    	it("should return status code of 412 if interests is undefined", done => {
	    agent
		.patch("/register/reg-last-step")
		.set("cookie", cookie)
		.send({ country: "Nigeria", interests: undefined })
		.expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(authConstants.NO_INTEREST_FIELD);
		    expect(res.body.status).toEqual(412);
		    done();
		});
    	});
    	it("should return status code of 412 if interests is not an array", done => {
	    agent
		.patch("/register/reg-last-step")
		.set("cookie", cookie)
		.send({ country: "Nigeria", interests: "reading" })
		.expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(authConstants.NO_INTEREST_FIELD);
		    expect(res.body.status).toEqual(412);
		    done();
		});
    	});
	it("should return status code of 412 if interests is an empty array", done => {
	    agent
		.patch("/register/reg-last-step")
		.set("cookie", cookie)
		.send({ country: "Nigeria", interests: [] })
		.expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.message).toEqual(authConstants.NO_INTEREST_FIELD);
		    expect(res.body.status).toEqual(412);
		    done();
		});
    	});
	it("should return status code of 204 if all information in registration last step is valid", done => {
	    agent
		.patch("/register/reg-last-step")
		.set("cookie", cookie)
		.send({ country: "Nigeria", interests: [ "scandal", "bribe" ] })
		.expect(201).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(201);
		    expect(res.body.message.verified).toEqual(false);
		    expect(res.body.message.completeReg).toEqual(true);
		    expect(res.body.message.email).toEqual("zombieleetnca@gmail.com");
		    expect(res.body.message.username).toEqual("zombieleet");
		    verificationLink = res.body.message.verificationLink;
		    done();
		});
    	});
	it("should return status code of 200 after verifing users email address", done => {
	    agent
		.patch(`/register/verification/${verificationLink}`)
		.expect(200).end( async (err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(200);
		    expect(res.body.message.verified).toEqual(true);
		    expect(res.body.message.completeReg).toEqual(true);
		    expect(res.body.message.email).toEqual("zombieleetnca@gmail.com");
		    expect(res.body.message.username).toEqual("zombieleet");
		    const result = await users.findOne({ email: "zombieleetnca@gmail.com" }, { verificationLink: true }).lean();
		    expect(result.verificationLink).toBeUndefined();
		    done();
		});
	});
    });
});