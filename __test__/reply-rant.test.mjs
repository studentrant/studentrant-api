
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
        .post('/rant/reply/fff')
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

    let rantId, shallowNestedRantCommentId, deeplyNestedRantCommentId

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

    describe("Create Comments", () => {
      let deletedRantId;
      beforeAll(done => {
        testUtils.createRant(
          agent,
          {
            rant: 'this is a rant to edit for the edit rant test test',
            cookie
          },
          nRid => {
            testUtils.deleteRant(
              agent,
              { cookie, rantId: nRid },
              deleted => {
                deletedRantId = deleted;
                done();
              }
            );
          }
        );
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
              rantConstants.RANT_REPLY_UNDEFINED
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
              rantConstants.RANT_REPLY_NOT_MORE_THAN_TWENTY,
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

      it('should not allow comment creation if rantId does not exists in database', done => {
        agent
          .post(`/rant/reply/not_exists`)
          .set("cookie", cookie)
          .send({ replyRant: "hellow".repeat(20) , when: Date.now() })
          .expect(404).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(404);
            expect(res.body.message).toEqual(
              rantConstants.RANT_DOES_NOT_EXISTS
            );
            done();
          });
      });

      it('should not allow comment creation for deleted rant', done => {
        agent
          .post(`/rant/reply/${deletedRantId}`)
          .set("cookie", cookie)
          .send({ replyRant: "hellow".repeat(20) , when: Date.now() })
          .expect(410).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(410);
            expect(res.body.message).toEqual(
              rantConstants.RANT_HAS_ALREADY_BEEN_DELETED
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
            shallowNestedRantCommentId = res.body.message.rantCommentId
            done();
          });
      });

      // login with another user and create the reply

      it('should create comment as a child of parentCommentId', done => {
        const when = Date.now();
        agent
          .post(`/rant/reply/${rantId}`)
          .set("cookie", cookie)
          .send({ replyRant: "This is a reply".repeat(20) , when , parentCommentId: shallowNestedRantCommentId })
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
          .send({ replyRant: "This is a nested reply".repeat(20) , when , parentCommentId: shallowNestedRantCommentId })
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.when).toEqual(when);
            expect(res.body.message.rantId).toEqual(rantId)
            expect(res.body.message.rantComment).toEqual("This is a nested reply".repeat(20));
            deeplyNestedRantCommentId = res.body.message.rantCommentId
            done();
          });
      });

      it('should create more deeply nested child comment', done => {
        const when = Date.now();
        agent
          .post(`/rant/reply/${rantId}`)
          .set("cookie", cookie)
          .send({ replyRant: "This is a deeply nested reply".repeat(20) , when , parentCommentId: deeplyNestedRantCommentId })
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.when).toEqual(when);
            expect(res.body.message.rantId).toEqual(rantId)
            expect(res.body.message.rantComment).toEqual("This is a deeply nested reply".repeat(20));
            done();
          });
      });

      it('should create another top level comment without a parentCommentId', done => {
        const when = Date.now();
        agent
          .post(`/rant/reply/${rantId}`)
          .set("cookie", cookie)
          .send({ replyRant: "hellow heyxxxx".repeat(20) , when })
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.when).toEqual(when);
            expect(res.body.message.rantId).toEqual(rantId)
            expect(res.body.message.rantComment).toEqual("hellow heyxxxx".repeat(20));
            expect(res.body.message.rantCommenter).toEqual('testaccount');
            done();
          });
      });
    });

    describe('Read Comments', () => {
      it('should read rant comment where parentCommentId is not define', done => {
        agent
          .get(`/rant/reply/${rantId}?numRequest=0`)

          .set("cookie", cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.replies.length).toBeGreaterThan(0);
            expect(res.body.message.hasMore).toEqual(false);
            expect(res.body.message.page.totalRant).toEqual(2);
            expect(res.body.message.page.remainingRant).toEqual(0);
            done();
          });
      });

      it('should read rant comment where parentCommentId is not define but should return 404 (rant comments as been exhausts)', done => {
        agent
          .get(`/rant/reply/${rantId}?numRequest=1`)
          .set("cookie", cookie)
          .expect(404).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(404);
            expect(res.body.message).toEqual(rantConstants.RANT_READ_EXHAUSTED);
            done();
          });
      });

      it('should read nested reply', done => {
        agent
          .get(`/rant/reply/${rantId}?numRequest=0&parentCommentId=${shallowNestedRantCommentId}`)
          .set("cookie", cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.replies.length).toBeGreaterThan(0);
            res.body.message.replies.forEach( reply => expect(reply.parentCommentId).not.toBeNull());
            done();
          });
      });
      
      it('should read deeploy nested reply', done => {
        agent
          .get(`/rant/reply/${rantId}?numRequest=0&parentCommentId=${deeplyNestedRantCommentId}`)
          .set("cookie", cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.replies.length).toBeGreaterThan(0);
            res.body.message.replies.forEach( reply => expect(reply.parentCommentId).not.toBeNull());
            done();
          });
      });

      it('should collapse all sub comment of a comment (not paginated)', done => {
        done();
      });
    });
  });

});
