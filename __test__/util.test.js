/* eslint-disable no-undef */
import faker from 'faker';
import loremIpsum from 'lorem-ipsum';

import UsersCollection from '../src/models/dbmodels/user.model.js';

export const login = (agent, cb) => {
  agent
    .post('/login')
    .send({ username: 'testaccount', password: '12345689234TesT$$' })
    .expect(200).end((err, res) => {
      expect(err).toBeNull();
      cb(res.headers['set-cookie']);
    });
};

export const createRant = (agent, { rant, cookie, tags }, cb) => {
  agent
    .post('/rant/post/create')
    .set('cookie', cookie)
    .send({
      rant,
      tags: tags || [],
      when: Date.now(),
    })
    .expect(201)
    .end((err, res) => {
      expect(err).toBeNull();
      cb(res.body.message.rantId);
    });
};

export const createUser = (agent, cb) => {
  const body = {
    username: faker.internet.userName(),
    password: '12345689234TesT$$',
    email: faker.internet.email('test'),
  };
  agent
    .post('/register/reg-first-step')
    .send(body).expect(201).end(async (err, res) => {
      expect(err).toBeNull();
      await UsersCollection.updateOne(
        { email: body.email },
        { $set: { completeReg: true, verified: true } },
      );
      cb(res.headers['set-cookie'], body);
    });
};

export const deleteRant = (agent, { cookie, rantId }, cb) => {
  agent
    .delete(`/rant/post/delete/${rantId}`)
    .set('cookie', cookie)
    .expect(200).end((err) => {
      expect(err).toBeNull();
      cb(rantId);
    });
};

export const createMoreRants = (agent, { cookie, num, tags }, cb) => {
  const lorem = new loremIpsum.LoremIpsum();
  const rantIds = [];
  for (let i = 0; i <= num; i += 1) {
    createRant(
      agent,
      {
        tags,
        rant: `${lorem.generateSentences()} ${i}`,
        cookie,
      },
      (rantId) => {
        rantIds.push(rantId);
        if (i === num) cb(rantIds);
      },
    );
  }
};

export const updateUserInfo = (
  agent,
  { cookie, ignoredTags },
  cb,
) => {
  agent
    .patch('/me/update/tags')
    .set('cookie', cookie)
    .send({ tags: ignoredTags })
    .expect(200).end((err,res) => { // eslint-disable-line
      expect(err).toBeNull();
      cb();
    });
};
