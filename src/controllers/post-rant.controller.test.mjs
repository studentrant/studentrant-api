import * as constants from '../constants/index.constant.js';
import { v4 as uuidv4 } from 'uuid';
import PostRant from './post-rant.controller.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';
import { RantDbUtils, Collection, UserDbUtils } from '../../__test__/fakes/db.fakes.js';
import Utils from '../utils/utils.util.js';

describe('PostRant [Unit]', () => {
  const controller = new PostRant(
    RantDbUtils,
    UserDbUtils,
    Utils,
    Collection,
    Collection
  );

  beforeEach(() => {
    req.session = { user: { username: 'testuseraccount' } };
  });

  describe('::createRant', () => {
    let createRantSpy;
    let date;

    beforeAll(() => {
      date = Date.now();
    });

    beforeEach(() => {
      createRantSpy = spyOn(controller.postRantService, 'createRant');
      req.body = {
        rant: 'Twinkle Twinkle, little Star, How I wonder what you are, up above the sky so high, like a diamon in the sky, twinkle twinkle little star',
        tags: ['twinkle', 'star'],
        rantId: uuidv4(),
        when: date,
      };
    });

    afterEach(() => {
      createRantSpy.calls.reset();
      req.body = {};
    });

    it('should create rant and return all tags', async () => {
      createRantSpy.and.resolveTo({ ...req.body, rantPoster: req.session.user.username });
      const result = JSON.parse(await controller.createRant(req, res, next));
      expect(result.status).toEqual(201);
      expect(result.message).toEqual({ ...req.body, rantPoster: req.session.user.username });
      expect(controller.postRantService.createRant).toHaveBeenCalled();
      expect(controller.postRantService.createRant).toHaveBeenCalledWith({
        rantPoster: req.session.user.username,
        rant: req.body.rant,
        tags: req.body.tags,
        when: req.body.when,
      });
    });
    it('should create a rant with empty tags and return general as member of the tag', async () => {
      req.body.tags = [];
      createRantSpy.and.resolveTo({ ...req.body, tags: ['general'], rantPoster: req.session.user.username });
      const result = JSON.parse(await controller.createRant(req, res, next));
      expect(result.status).toEqual(201);
      expect(result.message).toEqual({ ...req.body, tags: ['general'], rantPoster: req.session.user.username  });
    });

    it("call next on error", async () => {
      createRantSpy.and.throwError('x');
      await controller.createRant(req,res,next);
    });

  });

  describe("::deleteRant", () => {
    let deleteRantSpy;
    let validateRantExistenceSpy;
    let validateRantCreatorSpy;
    beforeEach(() => {
      deleteRantSpy = spyOn(controller.postRantService, "deleteRant");
      validateRantExistenceSpy = spyOn(controller.postRantService, "validateRantExistence");
      validateRantCreatorSpy = spyOn(controller.postRantService, "validateRantCreator");
      req.params = { rantId: "xxx" };
    });

    afterEach(() => {
      deleteRantSpy.calls.reset();
      validateRantExistenceSpy.calls.reset();
      validateRantCreatorSpy.calls.reset();
      req.params = {};
    });

    it("should return rant does not exists if rant is not in db", async () => {
      validateRantExistenceSpy.and.resolveTo(undefined);
      const result = await controller.deleteRant(req,res,next);
      expect(controller.postRantService.deleteRant).not.toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(constants.rantConstants.RANT_DOES_NOT_EXISTS);
    });

    it("should return rant has already been deleted", async () => {
      validateRantExistenceSpy.and.resolveTo({ deleted: true });
      const result = await controller.deleteRant(req,res,next);
      expect(controller.postRantService.deleteRant).not.toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(result.status).toEqual(410);
      expect(result.message).toEqual(constants.rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);
    });

    it("should return unauthroized access when trying to delete rant that does not belong to you", async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCreatorSpy.and.resolveTo(undefined);
      const result = await controller.deleteRant(req,res,next);
      expect(controller.postRantService.deleteRant).not.toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.postRantService.validateRantCreator).toHaveBeenCalledWith(req.session.user.username, req.params.rantId);
      expect(result.status).toEqual(401);
      expect(result.message).toEqual(constants.rantConstants.RANT_NOT_USER);
    });

    it("should delete rant and return rant has been sucefully deleted", async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCreatorSpy.and.resolveTo({});
      const result = JSON.parse(await controller.deleteRant(req,res,next));
      expect(controller.postRantService.deleteRant).toHaveBeenCalled();
      expect(controller.postRantService.deleteRant).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.postRantService.validateRantCreator).toHaveBeenCalledWith(req.session.user.username, req.params.rantId);
      expect(result.status).toEqual(200);
      expect(result.message).toEqual(constants.rantConstants.RANT_SUCCESSFULLY_DELETED);
    });

    it("call next on error", async () => {
      validateRantExistenceSpy.and.throwError('x');
      await controller.deleteRant(req,res,next);
    });

  });

  describe("::editRant", () => {
    let getRantSpy;
    let editRantSpy;
    let validateRantExistenceSpy;
    let validateRantCreatorSpy;
    let when = Date.now();
    beforeEach(() => {
      getRantSpy  = spyOn(controller.postRantService, "getRant");
      editRantSpy = spyOn(controller.postRantService, "editRant");
      validateRantExistenceSpy = spyOn(controller.postRantService, "validateRantExistence");
      validateRantCreatorSpy = spyOn(controller.postRantService, "validateRantCreator");
      req.params = { rantId: "xxx" };
      req.body   = { tags: [], rant: "hello earthlings" , when };
    });
    afterEach(() => {
      getRantSpy.calls.reset();
      editRantSpy.calls.reset();
      validateRantExistenceSpy.calls.reset();
      validateRantCreatorSpy.calls.reset();
      req.params = {};
      req.body = {};
    });
    it("should return rant does not exists if rant is not in db", async () => {
      validateRantExistenceSpy.and.resolveTo(undefined);
      const result = await controller.editRant(req,res,next);
      expect(controller.postRantService.getRant).not.toHaveBeenCalled();
      expect(controller.postRantService.editRant).not.toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(constants.rantConstants.RANT_DOES_NOT_EXISTS);
    });

    it("should return rant has already been editd", async () => {
      validateRantExistenceSpy.and.resolveTo({ deleted: true });
      const result = await controller.editRant(req,res,next);
      expect(controller.postRantService.getRant).not.toHaveBeenCalled();
      expect(controller.postRantService.editRant).not.toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(result.status).toEqual(410);
      expect(result.message).toEqual(constants.rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);
    });

    it("should return unauthroized access when trying to edit rant that does not belong to you", async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCreatorSpy.and.resolveTo(undefined);
      const result = await controller.editRant(req,res,next);
      expect(controller.postRantService.getRant).not.toHaveBeenCalled();
      expect(controller.postRantService.editRant).not.toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.postRantService.validateRantCreator).toHaveBeenCalledWith(req.session.user.username, req.params.rantId);
      expect(result.status).toEqual(401);
      expect(result.message).toEqual(constants.rantConstants.RANT_NOT_USER);
    });

    it("should return the diff of rants", async () => {
      const diff = [
        { count: 5, value: 'hello' },
        { count: 1, added: undefined, removed: true, value: 'w' },
        { count: 1, value: ' ' },
        { count: 2, added: undefined, removed: true, value: 'wo' },
        { count: 2, added: true, removed: undefined, value: 'ea' },
        { count: 1, value: 'r' },
        { count: 2, added: true, removed: undefined, value: 'th' },
        { count: 1, value: 'l' },
        { count: 1, added: undefined, removed: true, value: 'd' },
        { count: 4, added: true, removed: undefined, value: 'ings' }
      ];

      validateRantExistenceSpy.and.resolveTo({});
      validateRantCreatorSpy.and.resolveTo({});
      getRantSpy.and.resolveTo({ rant: "hellow world" });
      editRantSpy.and.resolveTo({
        edit: {
          isEdited: true,
          editHistory: [
            {
              when,
              diffAgainstString : "hellow world",
              diff
            }
          ]
        }
      });
      const result = JSON.parse(await controller.editRant(req,res,next));
      expect(controller.postRantService.getRant).toHaveBeenCalled();
      expect(controller.postRantService.getRant).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.postRantService.editRant).toHaveBeenCalled();
      expect(controller.postRantService.editRant).toHaveBeenCalledWith(
        req.session.user.username,
        req.params.rantId,
        {
          editedRant: req.body.rant,
          currentRantInDb:"hellow world",
          tags: req.body.tags,
          when,
          diff
        }
      );
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.postRantService.validateRantCreator).toHaveBeenCalledWith(req.session.user.username, req.params.rantId);
      expect(result.status).toEqual(200);
      expect(result.message.edit).toBeDefined();
      expect(result.message.edit.isEdited).toBeTruthy();
      expect(result.message.edit.editHistory).toEqual(jasmine.any(Array));
      expect(result.message.edit.editHistory.length).toBeGreaterThan(0);
      expect(result.message.edit.editHistory[0].when).toEqual(when);
      expect(result.message.edit.editHistory[0].diffAgainstString).toEqual("hellow world");
      expect(result.message.edit.editHistory[0].diff).toEqual(jasmine.any(Array));
      expect(result.message.edit.editHistory[0].diff.length).toBeGreaterThan(0);
    });

    it("call next on error", async () => {
      validateRantExistenceSpy.and.throwError('x');
      await controller.editRant(req,res,next);
    });

  });
});
