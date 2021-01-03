import supertest from 'supertest';
import app from '../src/server.js';
import { authConstants, rantConstants } from '../src/constants/index.constant.js';


import * as testUtils from './util.test.js';

const agent = supertest(app);
let cookie;


describe('Downvote Rant [Integration]', () => {
  describe('Unauthenticated User', () => {
    it('should return 401 unauthroized access if user is not logged in', (done) => {
      agent
        .post('/rant/vote/downvote')
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
    let rantId;
    beforeAll((done) => {
      testUtils.login(agent, (cookieArg) => {
        testUtils.createRant(
          agent,
          {
            rant: 'Test this rant for downvoting a rant, but this rant will be  deleted',
            cookie: cookie = cookieArg,
          },
          (arg) => {
            rantId = arg;
            done();
          },
        );
      });
    });

    it('should return rant does not exists on bad rant id', done => {
      agent
        .patch(`/rant/post/vote/downvote/qq`)
        .set('cookie', cookie)
        .send()
        .expect(404).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(404);
          expect(res.body.message).toEqual(rantConstants.RANT_DOES_NOT_EXISTS);
          done();
        });
    });

    it('should return rant has been deleted when trying to downvote a deleted rant', done => {
      const cb = (arg) => {
        testUtils.deleteRant(agent, { cookie, rantId : arg } , (rantId) => {
          agent
            .patch(`/rant/post/vote/downvote/${rantId}`)
            .set("cookie", cookie)
            .send()
            .expect(410).end((err,res) => {
              expect(err).toBeNull();
              expect(res.body.status).toEqual(410);
              expect(res.body.message).toEqual(rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);
              done();
            });
        });
      };

      testUtils.createRant( agent, { rant: 'Test this rant for downvoting a rant, but this rant will be  deleted', cookie: cookie },cb);

    });

    it('should downvote rant', done => {
      agent
        .patch(`/rant/post/vote/downvote/${rantId}`)
        .set("cookie", cookie)
        .send()
        .expect(200).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(200);
          expect(res.body.message.rantDownvoteCount).toEqual(1);
          done();
        });
    });

    it('should down vote rant again', done => {
      testUtils.createUser(agent, (cookie, { username }) => {
        agent
          .patch(`/rant/post/vote/downvote/${rantId}`)
          .set("cookie", cookie)
          .send()
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.rantDownvoteCount).toEqual(2);
            done();
          });
      });
    });

    it('should upvote rant and remove user from downvoted rants', done => {
      agent
        .patch(`/rant/post/vote/upvote/${rantId}`)
        .set("cookie", cookie)
        .send()
        .expect(200).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(200);
          expect(res.body.message.rantUpvoteCount).toEqual(1);
          expect(res.body.message.rantDownvoteCount).toEqual(1);
          done();
        });
    });

    it('should remove downvote if the user does not want to down-vote the rant', done => {
      agent
        .patch(`/rant/post/vote/downvote/${rantId}`)
        .set("cookie", cookie)
        .send()
        .expect(200).end((err,res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(200);
          expect(res.body.message.rantDownvoteCount).toEqual(2);
          done();
        });
    });

  });

});
