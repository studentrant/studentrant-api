"use strict";

import supertest from "supertest";
import app       from "../server.js";
import { authConstants , rantConstants } from "../constants/index.js";

const agent = supertest(app);
let cookie;

describe("[PostRant] Integration", () => {

    describe("Unauthenticated User", () => {
	it("should return 401 unauthroized access if user is not logged in", done => {
	    agent
		.post("/rant/post")
		.send({})
		.expect(401).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(401);
		    expect(res.body.message).toEqual(authConstants.USER_NOT_LOGGED_IN);
		    done();
		});
	});
    });


    describe("Authenticated User", () => {
	beforeAll(done => {
	    agent
	        .post("/login")
	        .send({ username: "zombieleet", password: "12345689234abcd" })
	        .expect(200).end((err,res) => {
		    cookie = res.headers["set-cookie"];
		    expect(err).toBeNull();
		    done();
	        });
	});

	it("should not create rant if rant body data is undefined", done => {
	    agent
	        .post("/rant/post/")
		.set("cookie", cookie)
	        .send({ })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(412);
		    expect(res.body.message).toEqual(rantConstants.RANT_BODY_UNDEFINED);
		    done();
	        });
	});

	it("should not create rant if rant length is less than 20", done => {
	    agent
	        .post("/rant/post/")
		.set("cookie", cookie)
	        .send({ rant: "hello world" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(412);
		    expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
		    done();
	        });
	});

	it("should not create rant if it contains only spaces", done => {
	    agent
	        .post("/rant/post/")
		.set("cookie", cookie)
	        .send({ rant: "                              " })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(412);
		    expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
		    done();
	        });
	});

	it("should not create rant if it contains trail of spaces both left and right and the content is not more than 20", done => {
	    agent
	        .post("/rant/post/")
		.set("cookie", cookie)
	        .send({ rant: "                              dd               " })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(412);
		    expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
		    done();
	        });
	});
	
	it("should not create rant if rant length is exactly 20", done => {
	    agent
	        .post("/rant/post/")
		.set("cookie", cookie)
	        .send({ rant: "hello world for barz" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(412);
		    expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
		    done();
	        });
	});

	it("should not create rant if tag is undefined", done => {
	    agent
	        .post("/rant/post/")
		.set("cookie", cookie)
	        .send({ rant: "This is a rant about abuse in a school" })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(412);
		    expect(res.body.message).toEqual(rantConstants.RANT_TAGS_UNDEFINED);
		    done();
	        });
	});

	
	it("should not create rant if tag is not an array", done => {
	    agent
	        .post("/rant/post/")
		.set("cookie", cookie)
	        .send({ rant: "This is a rant about abuse in a school" , tags: {} })
	        .expect(412).end((err,res) => {
		    expect(err).toBeNull();
		    expect(res.body.status).toEqual(412);
		    expect(res.body.message).toEqual(`${rantConstants.RANT_TAGS_NOT_AN_ARRAY} object`);
		    done();
	        });
	});

	it("should create rant if all conditions meet", () => {
	    
	});
	
    });
})
