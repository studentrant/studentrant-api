import supertest from 'supertest';
import app from '../src/server.js';
import { authConstants, rantConstants } from '../src/constants/index.constant.js';

import * as testUtils from './util.test.js';

const agent = supertest(app);
let cookie;


xdescribe('Trends [Integration]', () => {

  describe('Unauthenticated User', () => {
    it('should return 401 unauthroized access if user is not logged in', (done) => {
      agent
        .get('/rant/post/rant/111')
        .expect(401).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(401);
          expect(res.body.message).toEqual(authConstants.USER_NOT_LOGGED_IN);
          done();
        });
    });
  });

  describe('Authenticated User', () => {
    beforeAll((done) => {
      agent
        .post('/login')
        .send({ username: 'testaccount', password: '12345689234TesT$$' })
        .expect(200).end((err, res) => {
          cookie = res.headers['set-cookie'];
          expect(err).toBeNull();
          done();
        });
    });

    describe("Get One Rant", () => {
      it('should not save trend if no trend was found in the rant', done => {
        testUtils.createRant(
          agent,
          {
            rant: 'Hello I am new to this platfrom please be nice to me, new me',
            cookie: cookie = cookieArg,
          },
          (arg) => {

            agent
              .get('/rant/post/rants/trend/new?numRequest=0')
              .set('cookie', cookie)
              .expect(200).end((err,res) => {
                expect(err).toBeNull();
                done();
              });
            
          },
        );
      });
    });
  });
});
