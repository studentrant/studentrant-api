import supertest from "supertest";
import app       from "../src/server.js";
import * as models from "../src/models/dbmodels/index.js";
const agent     = supertest(app);

beforeAll(done => {
    agent
	.post("/register/reg-first-step")
	.send({
	    username: "testaccount",
	    password: "12345689234abcd",
	    email: "test@example.com"
	}).expect(201).end((err,res) => {
	    expect(err).toBeNull();
	    expect(res.body.message).toEqual(jasmine.any(Object));
	    done();
	});
});

afterAll(async () => {
    for ( let model of Object.values(models) )
	await model.deleteMany();
});
