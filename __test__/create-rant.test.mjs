import supertest from 'supertest';
import app from '../src/server.js';
import rantConstants from '../src/rants/rant.constant.js';
import loginConstants from '../src/login/login.constant.js'
const agent = supertest(app);
let cookie;

describe('CreateRant [Integration]', () => {
  describe('Unauthenticated User', () => {
    it('should return 401 unauthroized access if user is not logged in', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if rant body data is undefined', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if rant length is less than 20', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if it contains only spaces', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if it contains trail of spaces both left and right and the content is not more than 20', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if rant length is exactly 20', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if tag is undefined', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if tag is not an array', (done) => {
      agent
        .post('/rant/post/create')
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

    it('should not create rant if when is undefined', (done) => {
      agent
        .post('/rant/post/create')
        .set('cookie', cookie)
        .send({ rant: 'This is a rant about abuse in a school', tags: ['abuse', 'student', 'auchipoly'] })
        .expect(412)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(rantConstants.RANT_WHEN_NO_EXISTS);
          done();
        });
    });

    it('should not create rant if when is not type of a number', (done) => {
      agent
        .post('/rant/post/create')
        .set('cookie', cookie)
        .send({ rant: 'This is a rant about abuse in a school', tags: ['abuse', 'student', 'auchipoly'], when: 'not a number' })
        .expect(412)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(rantConstants.RANT_NOT_NUMBER);
          done();
        });
    });

    it('should not create rant if when is an invalid timestamp', (done) => {
      agent
        .post('/rant/post/create')
        .set('cookie', cookie)
        .send({ rant: 'This is a rant about abuse in a school', tags: ['abuse', 'student', 'auchipoly'], when: 22222222222222222222222222222222 })
        .expect(412)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(412);
          expect(res.body.message).toEqual(rantConstants.RANT_NOT_VALID_TIMESTAMP);
          done();
        });
    });

    it('should create rant if all conditions meet and return all tags associated to the rant', (done) => {
      agent
        .post('/rant/post/create')
        .set('cookie', cookie)
        .send({
          rant: 'This is a rant about abuse in a school and how it has affected students',
          tags: ['abuse', 'student', 'auchipoly'],
          when: Date.now(),
        })
        .expect(201)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(201);
          expect(res.body.message.tags).toEqual(['abuse', 'student', 'auchipoly']);
          expect(res.body.message.rantId).toBeDefined();
          expect(res.body.message.rantPoster).toEqual('testaccount');
          expect(res.body.message.rant).toEqual('This is a rant about abuse in a school and how it has affected students');
          done();
        });
    });

    it('should create rant if all conditions meet and return the rant as part of tag general if tag was not specified during creation of the rant', (done) => {
      agent
        .post('/rant/post/create')
        .set('cookie', cookie)
        .send({
          rant: 'This is a rant about abuse in a school and how it has affected students',
          tags: [],
          when: Date.now(),
        })
        .expect(201)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.status).toEqual(201);
          expect(res.body.message.tags).toEqual(['general']);
          expect(res.body.message.rantId).toBeDefined();
          expect(res.body.message.rantPoster).toEqual('testaccount');
          expect(res.body.message.rant).toEqual('This is a rant about abuse in a school and how it has affected students');
          done();
        });
    });
  });
});
