import supertest from 'supertest';
import app from '../src/server.js';
import loginConstants from '../src/login/login.constant.js';
import rantConstants from '../src/rants/rant.constant.js';
import * as testUtils from './util.test.js';

const agent = supertest(app);
let cookie;


describe('GetRant(s) [Integration]', () => {

  describe('Unauthenticated User', () => {
    it('should return 401 unauthroized access if user is not logged in', (done) => {
      agent
        .get('/rant/post/rant/111')
        .expect(401).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(401);
          expect(res.body.message).toEqual(loginConstants.USER_NOT_LOGGED_IN);
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
      let rantId;
      beforeAll((done) => {
        testUtils.createRant(
          agent,
          {
            rant: 'Hello World'.repeat(50),
            cookie ,
          },
          (arg) => {
            rantId = arg;
            done();
          },
        );
      });

      it("should not get rant if rant id fails verification", done => {
        agent
          .get("/rant/post/rant/1111")
          .set("cookie", cookie)
          .expect(404).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(404);
            expect(res.body.message).toEqual(rantConstants.RANT_DOES_NOT_EXISTS);
            done();
          });
      });

      it("should return one rant if rant id exists", done => {
        agent
          .get(`/rant/post/rant/${rantId}`)
          .set("cookie", cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual(jasmine.any(Object));
            expect(res.body.message.deleted).toEqual(false);
            expect(res.body.message.rantId).toEqual(rantId);
            done();
          });
      });

    });

    describe("Get Rants Without Tags Modifier", () => {
      let paginatedRants = [];
      beforeAll(done => {
        testUtils.createMoreRants(
          agent,
          { cookie, num: 50, tags: ['general', 'fakerant'] },
          done
        );
      });
      it("should not get all rants if numRequest undefined", done => {
        agent
          .get("/rant/post/rants")
          .set("cookie", cookie)
          .expect(412).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_NOT_VALID_LOAD_NUM_REQUEST);
            done();
          });
      });
      it("should not get all rants if numRequest isNaN", done => {
        agent
          .get("/rant/post/rants?numRequest=asdfasdf")
          .set("cookie", cookie)
          .expect(412).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_NOT_VALID_LOAD_NUM_REQUEST);
            done();
          });
      });

      it("should get rants and return the first 20, when 0 is specified", done => {
        agent
          .get("/rant/post/rants?numRequest=0")
          .set("cookie", cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.rant.rants.length).toEqual(20);
            expect(res.body.message.rant.hasMore).toEqual(true);
            expect(res.body.message.rant.page.totalRant).not.toEqual(
              res.body.message.rant.page.remainingRant
            );
            paginatedRants = res.body.message.rant.rants.map(({rantId}) => rantId );
            done();
          });
      });

      it("should get upcomming rants and return data skipping the previous 20 rants",  done => {
        agent
          .get("/rant/post/rants?numRequest=1")
          .set("cookie", cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.rant.rants.length).toEqual(20);
            expect(res.body.message.rant.hasMore).toEqual(true);
            expect(res.body.message.rant.page.totalRant).not.toEqual(
              res.body.message.rant.page.remainingRant
            );
            expect(
              res.body.message.rant.rants.filter(
                rantId => paginatedRants.includes(rantId)
              ).length
            ).toEqual(0);
            paginatedRants.push(...(res.body.message.rant.rants.map(({ rantId }) => rantId )));
            done();
          });
      });


      it("should get upcomming rants and return data skipping the previous 20 rants",  done => {
        agent
          .get("/rant/post/rants?numRequest=2")
          .set("cookie", cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.rant.rants.length).toEqual(16);
            expect(res.body.message.rant.hasMore).toEqual(false);
            expect(res.body.message.rant.page.remainingRant).toEqual(0);
            expect(
              res.body.message.rant.rants.filter(
                rantId => paginatedRants.includes(rantId)
              ).length
            ).toEqual(0);
            paginatedRants.push(...(res.body.message.rant.rants.map(({ rantId }) => rantId )));
            done();
          });
      });

      it("should not return any rants when all rants are exhausted", done => {
        agent
          .get("/rant/post/rants?numRequest=3")
          .set("cookie", cookie)
          .expect(404).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(404);
            expect(res.body.message).toEqual(rantConstants.RANT_READ_EXHAUSTED);
            done();
          });
      });
    });

    describe("Get Rants - With Tags Limit", () => {
      let ignoredTags = [ "general" ];
      beforeAll(done => {
        testUtils.updateUserInfo(
          agent,
          { cookie, ignoredTags},
          done
        );
      });
      it('should return rants for only specified tags ( for num request 0, no rants )', done => {
        agent
          .get('/rant/post/rants?numRequest=0')
          .set('cookie', cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(
              (res.body.message.rant.rants.map(({tags}) => tags).filter( tag => ignoredTags.includes(tag))).length
            ).toEqual(0);
            done();
          });
      });
    });

    describe("Get Rants By Tag", () => {

      it('should return 403 error when trying to get rants from tag(s) ignored by current user', done => {
        agent
          .get('/rant/post/rants/tag/general?numRequest=0')
          .set('cookie', cookie)
          .expect(403).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(403);
            expect(res.body.message).toEqual(
              rantConstants.RANT_READ_TAG_NOT_ALLOWED
            );
            done();
          });
      });
      it('should return no rants to read when the specified tag has not been ignored by the current user and the rants base on that tagis empty', done => {

        agent
          .get('/rant/post/rants/tag/auchi?numRequest=0')
          .set('cookie', cookie)
          .expect(404).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(404);
            expect(res.body.message).toEqual(
              rantConstants.RANT_READ_EXHAUSTED
            );
            done();
          });
      });
      it('should return rants if rant tag has not been muted by the current user', done => {
        agent
          .get('/rant/post/rants/tag/student?numRequest=0')
          .set('cookie', cookie)
          .expect(200).end((err,res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message.rant.hasMore).toEqual(true);
            expect(res.body.message.rant.page.totalRant).not.toEqual(
              res.body.message.rant.page.remainingRant
            );
            expect(
              res.body.message.rant.rants.filter(
                rant => !rant.tags.filter(
                  tag => !rant.authoredBy.settings.notAllowedTags.includes(tag)
                )).length
            ).toEqual(0);
            done();
          });
      });
    });
  });
});
