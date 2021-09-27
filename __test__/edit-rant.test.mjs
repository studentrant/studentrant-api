import supertest from 'supertest';
import app from '../src/server.js';
import loginConstants from '../src/login/login.constant.js';
import rantConstants from '../src/rants/rant.constant.js';
import httpStatusCodeConstants from '../src/core/constants/http-status-code.constant.js';
import * as testUtils from './util.test.js';

const agent = supertest(app);
let cookie;

describe('EditRant [Integrathion]', () => {
  describe('Unaunthenticaed User', () => {
    it('should return 401 unauthroized access if user is not logged in', (done) => {
      agent
        .patch('/rant/post/edit/balba_id')
        .send({ rant: 'this is a rant to edit for the edit rant test test', tags: ['news', 'rant'] })
        .expect(401).end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(httpStatusCodeConstants.UNAUTHORIZED);
          expect(res.body.message).toEqual(loginConstants.USER_NOT_LOGGED_IN);
          done();
        });
    });
  });

  describe('Authenticated User', () => {
    let rantId;
    beforeAll((done) => {
      testUtils.login(agent, (arg) => {
        cookie = arg;
        done();
      });
    });

    describe('verify body data', () => {
      it('should not edit rant if rant body data is undefined', (done) => {
        agent
          .patch('/rant/post/edit/balbalb_rant_id')
          .set('cookie', cookie)
          .send({ })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_BODY_UNDEFINED);
            done();
          });
      });

      it('should not edit rant if rant length is less than 20', (done) => {
        agent
          .patch('/rant/post/edit/blabla_rant_id')
          .set('cookie', cookie)
          .send({ rant: 'hello world' })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
            done();
          });
      });

      it('should not edit rant if it contains only spaces', (done) => {
        agent
          .patch('/rant/post/edit/balbabla_rant_id')
          .set('cookie', cookie)
          .send({ rant: '                              ' })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
            done();
          });
      });

      it('should not edit rant if it contains trail of spaces both left and right and the content is not more than 20', (done) => {
        agent
          .patch('/rant/post/edit/blabal_rant_id')
          .set('cookie', cookie)
          .send({ rant: '                              dd               ' })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
            done();
          });
      });

      it('should not edit rant if rant length is exactly 20', (done) => {
        agent
          .patch('/rant/post/edit/balbal_rant_id')
          .set('cookie', cookie)
          .send({ rant: 'hello world for barz' })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
            done();
          });
      });

      it('should not edit rant if tag is undefined', (done) => {
        agent
          .patch('/rant/post/edit/blaballa_rant_id')
          .set('cookie', cookie)
          .send({ rant: 'This is a rant about abuse in a school' })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_TAGS_UNDEFINED);
            done();
          });
      });

      it('should not edit rant if tag is not an array', (done) => {
        agent
          .patch('/rant/post/edit/blababla_rant_id')
          .set('cookie', cookie)
          .send({ rant: 'This is a rant about abuse in a school', tags: {} })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(`${rantConstants.RANT_TAGS_NOT_AN_ARRAY} object`);
            done();
          });
      });

      it('should not edit rant if when is not defined', (done) => {
        agent
          .patch('/rant/post/edit/blababla_rant_id')
          .set('cookie', cookie)
          .send({ rant: 'This is a rant about abuse in a school', tags: [] })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_WHEN_NO_EXISTS);
            done();
          });
      });

      it('should not edit rant if when is not a number', (done) => {
        agent
          .patch('/rant/post/edit/blababla_rant_id')
          .set('cookie', cookie)
          .send({ rant: 'This is a rant about abuse in a school', tags: [], when: 'duh' })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_NOT_NUMBER);
            done();
          });
      });

      it('should not edit rant if when is a wrong timestamp', (done) => {
        agent
          .patch('/rant/post/edit/blababla_rant_id')
          .set('cookie', cookie)
          .send({ rant: 'This is a rant about abuse in a school', tags: [], when: 2222222222222222222222 })
          .expect(412)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(412);
            expect(res.body.message).toEqual(rantConstants.RANT_NOT_VALID_TIMESTAMP);
            done();
          });
      });
    });

    describe('edition of rant in the rants controller', () => {
      beforeAll((done) => {
        testUtils.createRant(agent, {
          rant: 'this is a rant to edit for the edit rant test test',
          cookie,
        }, (arg) => {
          rantId = arg;
          done();
        });
      });

      it('should return 404 for rant that does not exists', (done) => {
        agent
          .patch('/rant/post/edit/not_exists')
          .set('cookie', cookie)
          .send({ rant: 'this is a rant to edit for the edit rant test test', tags: ['news', 'rant'], when: Date.now() })
          .expect(404)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(404);
            expect(res.body.message).toEqual(rantConstants.RANT_DOES_NOT_EXISTS);
            done();
          });
      });

      it('should return 404 for rant that does not exists', (done) => {
        agent
          .patch('/rant/post/edit/not_exists')
          .set('cookie', cookie)
          .send({ rant: 'this is a rant to edit for the edit rant test test', tags: ['news', 'rant'], when: Date.now() })
          .expect(404)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(404);
            expect(res.body.message).toEqual(rantConstants.RANT_DOES_NOT_EXISTS);
            done();
          });
      });

      it('should return 410 when trying to edit a deleted rant', done => {
        const cb = (arg) => {
          testUtils.deleteRant(agent, { cookie, rantId : arg } , (rantId) => {
            agent
              .patch(`/rant/post/edit/${rantId}`)
              .set("cookie", cookie)
              .send({ rant: 'this is a rant to edit for the edit rant test test', tags: ['news', 'rant'], when: Date.now() })
              .expect(410).end((err,res) => {
                expect(err).toBeNull();
                expect(res.body.status).toEqual(410);
                expect(res.body.message).toEqual(rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);
                done();
              });
          });
        };

        testUtils.createRant( agent, { rant: 'Test this rant for upvoting a rant, but this rant will be  deleted', cookie: cookie },cb);

      });

      it('should return 401 when trying to edit rant you did not edit ( edge case )', (done) => {
        testUtils.createUser(agent, (arg) => {
          agent
            .patch(`/rant/post/edit/${rantId}`)
            .set('cookie', arg)
            .send({ rant: 'this is a rant to edit for the edit rant test test', tags: ['news', 'rant'], when: Date.now() })
            .expect(401)
            .end((err, res) => {
              expect(err).toBeNull();
              expect(res.body.status).toEqual(401);
              expect(res.body.message).toEqual(rantConstants.RANT_NOT_USER);
              done();
            });
        });
      });

      it('edit rant and return the rant history with the diff of the rants', (done) => {
        const when = Date.now();
        agent
          .patch(`/rant/post/edit/${rantId}`)
          .set('cookie', cookie)
          .send({ rant: 'this is a rant to edit for the edit rant test', tags: ['news', 'rant'], when })
          .expect(200)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toBeDefined();
            expect(res.body.message.edit.isEdited).toBeTruthy();
            expect(res.body.message.rant).toEqual('this is a rant to edit for the edit rant test');
            expect(res.body.message.rantId).toEqual(rantId);

            const editHistory = res.body.message.edit.editHistory[0];
            expect(editHistory.when).toEqual(when);
            expect(editHistory.diff[0].value).toEqual('this is a rant to edit for the edit rant test');
            expect(editHistory.diff[1].removed).toBeTruthy();
            expect(editHistory.diff[1].value).toEqual(' test');

            done();
          });
      });

      it('edit rant by removing and adding content', (done) => {
        const when = Date.now();

        agent
          .patch(`/rant/post/edit/${rantId}`)
          .set('cookie', cookie)
          .send({ rant: 'This is a rant to edit for testing editing feature', tags: ['news', 'rant'], when })
          .expect(200)
          .end((err, res) => {
            expect(err).toBeNull();
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toBeDefined();
            expect(res.body.message.edit.isEdited).toBeTruthy();
            expect(res.body.message.edit.editHistory.length).toBeGreaterThan(1);
            done();
          });
      });
    });
  });
});
