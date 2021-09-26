import supertest from 'supertest';
import app from '../src/server.js';
import loginConstants from '../src/login/login.constant.js';
import rantConstants from '../src/rants/rant.constant.js';

import * as testUtils from './util.test.js';

const agent = supertest(app);
let cookie;

describe('DeleteRant [Integration]', () => {
  describe('Unauthenticated User', () => {
    it('should return 401 unauthroized access if user is not logged in', (done) => {
      agent
        .delete('/rant/post/delete')
        .send({})
        .expect(401).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(401);
          expect(res.body.message).toEqual(loginConstants.USER_NOT_LOGGED_IN);
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
            rant: 'this is a rant to edit for the edit rant test test',
            cookie: cookie = cookieArg,
          },
          (arg) => {
            rantId = arg;
            done();
          },
        );
      });
    });

    it('should return 404 for rant that does not exists', (done) => {
      agent
        .delete('/rant/post/delete/not_exists')
        .set('cookie', cookie)
        .expect(404).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(404);
          expect(res.body.message).toEqual(rantConstants.RANT_DOES_NOT_EXISTS);
          done();
        });
    });

    it('should return 401 when trying to delete rant you did not create ( edge case )', (done) => {
      testUtils.createUser(agent, (arg) => {
        agent
          .delete(`/rant/post/delete/${rantId}`)
          .set('cookie', arg)
          .expect(401).end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(401);
            expect(res.body.message).toEqual(rantConstants.RANT_NOT_USER);
            done();
          });
      });
    });

    it('should delete the specified rant if all conditions is fulfilled', (done) => {
      agent
        .delete(`/rant/post/delete/${rantId}`)
        .set('cookie', cookie)
        .expect(200).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(200);
          expect(res.body.message).toEqual(rantConstants.RANT_SUCCESSFULLY_DELETED);
          done();
        });
    });

    it('should not delete rant that has already been deleted', (done) => {
      agent
        .delete(`/rant/post/delete/${rantId}`)
        .set('cookie', cookie)
        .expect(410).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(410);
          expect(res.body.message).toEqual(rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);
          done();
        });
    });
  });
});
