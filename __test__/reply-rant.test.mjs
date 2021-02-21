import supertest from 'supertest';
import app from '../src/server.js';
import * as testUtils from './util.test.js';
import { authConstants, rantConstants } from '../src/constants/index.constant.js';

const agent = supertest(app);
let cookie;

describe('ReplyRant [Integration]', () => {

  describe('Unauthenticated User', () => {
    it('should return 401 unauthroized access if user is not logged in', (done) => {
      agent
        .post('/rant/post/create')
        .send({})
        .expect(401).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(401);
          expect(res.body.message).toEqual(authConstants.USER_NOT_LOGGED_IN);
          done();
        });
    });
  });

  describe('Authenticated User', () => {

    let rantId, rantCommentId;

    beforeAll((done) => {
      testUtils.login(agent, (cookieArg) => {
        testUtils.createRant(
          agent,
          {
            rant: 'this is a rant to edit for the edit rant test test',
            cookie: cookie = cookieArg,
          },
          (arg) => {
            rantId = arg;
            done();
          },
        );
      })
    });

    it('should not allow comment creation of replyRant is undefined' , done => {
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({})
        .expect(412).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(
            rantConstants.REPLY_RANT_UNDEFINED
          );
          done();
        });
    });


    it('should not allow comment creation of replyRant is less than 20' , done => {
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({ replyRant: "hellow" })
        .expect(412).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(
            rantConstants.REPLY_RANT_NOT_MORE_THAN_TWENTY,
          );
          done();
        });
    });

    it('should not allow comment creation if when is undefined', done => {
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({ replyRant: "hellow".repeat(20) })
        .expect(412).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(
            rantConstants.RANT_WHEN_NO_EXISTS
          );
          done();
        });
    });

    it('should not allow comment creation if when is not a number', done => {
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({ replyRant: "hellow".repeat(20) , when: "2021, Augst 8" })
        .expect(412).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(
            rantConstants.RANT_NOT_NUMBER
          );
          done();
        });
    });


    it('should not allow comment creation if when is an invalid timestamp', done => {
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({ replyRant: "hellow".repeat(20) , when: 22222222222222222222222222222222 })
        .expect(412).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(
            rantConstants.RANT_NOT_VALID_TIMESTAMP,
          );
          done();
        });
    });

    it('should create comment if parentCommentId is undefined', done => {
      const when = Date.now();
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({ replyRant: "hellow".repeat(20) , when })
        .expect(200).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(200);
          expect(res.body.message.when).toEqual(when);
          expect(res.body.message.rantId).toEqual(rantId)
          expect(res.body.message.rantComment).toEqual("hellow".repeat(20));
          expect(res.body.message.rantCommenter).toEqual('testaccount');
          rantCommentId = res.body.message.rantCommentId
          done();
        });
    });

    // login with another user and create the reply

    it('should create comment as a child of parentCommentId', done => {
      const when = Date.now();
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({ replyRant: "This is a reply".repeat(20) , when , parentCommentId: rantCommentId })
        .expect(200).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(200);
          expect(res.body.message.when).toEqual(when);
          expect(res.body.message.rantId).toEqual(rantId)
          expect(res.body.message.rantComment).toEqual("This is a reply".repeat(20));
          done();
        });      
    });

    it('should create more comment as a child comment of parrentCommentId' , done => {
      const when = Date.now();
      agent
        .post(`/rant/reply/${rantId}`)
        .set("cookie", cookie)
        .send({ replyRant: "This is a nested reply".repeat(20) , when , parentCommentId: rantCommentId })
        .expect(200).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(200);
          expect(res.body.message.when).toEqual(when);
          expect(res.body.message.rantId).toEqual(rantId)
          expect(res.body.message.rantComment).toEqual("This is a nested reply".repeat(20));
          done();
        });      
    });

  });

});
