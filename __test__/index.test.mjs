import mongoose  from "mongoose";
import supertest from "supertest";
import app       from "../src/server.js";


const agent     = supertest(app);

beforeAll(done => {
  agent
    .post("/register/reg-first-step")
    .send({
      username: "testaccount",
      password: "12345689234TesT$$",
      email: "test@example.com"
    }).expect(201).end(async (err,res) => {
      expect(err).toBeNull();
      expect(res.body.message).toEqual(jasmine.any(Object));
      await mongoose.models.Users.updateOne(
        { email: "test@example.com"},
        { $set: { completeReg: true , verified: true } }
      );
      done();
    });
});

afterAll(async () => {
  for ( let model of Object.values(mongoose.models) ) {
    await model.deleteMany();
    await model.collection.dropIndexes();
  }
});
