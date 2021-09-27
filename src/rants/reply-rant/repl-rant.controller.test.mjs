import rantConstants from '../rant.constant.js';
import { v4 as uuidv4 } from 'uuid';
import ReplyRant from './reply-rant.controller.js';
import req from '../../../__test__/fakes/req.fake.js';
import res from '../../../__test__/fakes/res.fake.js';
import next from '../../../__test__/fakes/next.fake.js';
import {
  RantDbUtils,
  Collection,
  UserDbUtils,
  TrendDbUtils,
  ReplyRantDbUtils
} from '../../../__test__/fakes/db.fakes.js';

import Utils from '../../utils/utils.util.js';

describe('PostRant [Unit]', () => {

  const controller = new ReplyRant({
    Collections: {
      RantsCollection: Collection,
      UsersCollection: Collection,
      TrendingCollection : Collection
    },
    DBUtils: {
      RantDbUtils,
      UserDbUtils,
      TrendDbUtils,
      RantReplyDbUtils : ReplyRantDbUtils
    },
    Utils
  });

  beforeEach(() => {
    req.session = { user: { username: 'testuseraccount' } };
  });

  describe("::replyRant", () => {
    let getRantSpy;
    let createReplySpy;
    let createTrendIfExistsSpy;
    let validateRantExistenceSpy;
    let generateUniqueIdSpy;

    beforeAll(() => {
      req.params = { rantId: uuidv4() };
      req.body = {
        parentCommentId: uuidv4(),
        replyRant: "hello".repeat(20),
        when: Date.now()
      }
    });

    beforeEach(() => {
      getRantSpy = spyOn(controller.postRantService, 'getRant');
      createReplySpy = spyOn(controller.replyRantService, 'createReply');
      createTrendIfExistsSpy = spyOn(controller.trendingService, 'createTrendIfExists');
      validateRantExistenceSpy  = spyOn(controller.postRantService, 'validateRantExistence');
      generateUniqueIdSpy = spyOn(controller.Utils, 'GenerateUniqueId');
    });

    afterEach(() => {
      getRantSpy.calls.reset();
      createReplySpy.calls.reset();
      createTrendIfExistsSpy.calls.reset();
      validateRantExistenceSpy.calls.reset();
      generateUniqueIdSpy.calls.reset();
    });

    it('should return rant does not exists if rantId does not exists ', async () => {
      validateRantExistenceSpy.and.resolveTo(null);
      const result = await controller.replyRant(req,res,next);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_DOES_NOT_EXISTS)
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
    });

    it('should not reply to deleted rants', async () => {
      validateRantExistenceSpy.and.resolveTo({ deleted: true });
      const result = await controller.replyRant(req,res,next);
      expect(result.status).toEqual(410);
      expect(result.message).toEqual(rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
    });

    it('should create reply', async () => {
      validateRantExistenceSpy.and.resolveTo({});
      generateUniqueIdSpy.and.returnValue('xxxx');
      getRantSpy.and.resolveTo({ rantPoster: 'poster' });
      createReplySpy.and.resolveTo(
        {
          rantComment: req.body.replyRant ,
          rantCommentId: 'xxxx',
          rantId: req.params.rantId
        }
      )
      createTrendIfExistsSpy.and.resolveTo({})
      const result = JSON.parse(await controller.replyRant(req,res,next));
      expect(result.status).toEqual(200);
      expect(result.message).toEqual(
          {
            rantComment: req.body.replyRant,
            rantCommentId: 'xxxx',
            rantId: req.params.rantId
        }
      )
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.postRantService.getRant).toHaveBeenCalled();
      expect(controller.postRantService.getRant).toHaveBeenCalledWith(req.params.rantId);
      expect(controller.replyRantService.createReply).toHaveBeenCalledWith(
        {
          rantId: req.params.rantId,
          username: req.session.user.username,
          rantPoster: 'poster',
          rantCommentId: 'xxxx',
          parentCommentId: req.body.parentCommentId,
          when: req.body.when,
          rantComment: req.body.replyRant,
        }
      );

      expect(controller.trendingService.createTrendIfExists).toHaveBeenCalled();
      expect(controller.trendingService.createTrendIfExists).toHaveBeenCalledWith(
        {
          text: req.body.replyRant,
          identifier: 'xxxx',
          col: 'rantcomments'
        }
      );
    });

    it('should throw error', async () => {
      createReplySpy.and.throwError('x');
      await controller.replyRant(req,res,next);
      expect(controller.replyRantService.createReply).toThrow(new Error('x'));
    });

  });

  describe("::showReply", () => {
    let validateRantExistenceSpy;
    let validateRantCommentExistenceSpy;
    let getRepliesSpy;
    beforeAll(() => {
      req.params = { rantId: uuidv4() };
      req.query  = { numRequest: 0 , parentCommentId: uuidv4() };
    });

    beforeEach(() => {
      validateRantExistenceSpy = spyOn(controller.postRantService, 'validateRantExistence');
      validateRantCommentExistenceSpy = spyOn(controller.replyRantService, 'validateRantCommentExistence');
      getRepliesSpy = spyOn(controller.replyRantService, 'getReplies');
    });

    afterEach(() => {
      validateRantCommentExistenceSpy.calls.reset();
      validateRantExistenceSpy.calls.reset();
    });

    it('should return rant does not exists if rantId does not exists ', async () => {
      validateRantExistenceSpy.and.resolveTo(null);
      const result = await controller.replyRant(req,res,next);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_DOES_NOT_EXISTS)
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
    });

    it('should not show deleted reply for deleted rant', async () => {
      validateRantExistenceSpy.and.resolveTo({ deleted: true });
      const result = await controller.replyRant(req,res,next);
      expect(result.status).toEqual(410);
      expect(result.message).toEqual(rantConstants.RANT_HAS_ALREADY_BEEN_DELETED);
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
    });

    it('should return not found if rantcommentId does not exists', async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCommentExistenceSpy.and.resolveTo(null);
      const result = await controller.showReply(req,res,next);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          parentCommentId: req.query.parentCommentId
        }
      );
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_RANT_COMMENT_ID_INVALID);
    });

    it('should not return deleted rantcomments', async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCommentExistenceSpy.and.resolveTo({ deleted: true });
      const result = await controller.showReply(req,res,next);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          parentCommentId: req.query.parentCommentId
        }
      );
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalled();
      expect(controller.postRantService.validateRantExistence).toHaveBeenCalledWith(req.params.rantId);
      expect(result.status).toEqual(410);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_RANT_ALREADY_DELETED);
    });

    it('should return reply read exhausted if getReplies returns null', async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCommentExistenceSpy.and.resolveTo({});
      getRepliesSpy.and.resolveTo(null);
      const result = await controller.showReply(req,res,next);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_COMMENT_READ_EXHAUSTED);
    });


    it('should return reply read exhausted if getReplies returns an empty re[;oes with an empty array', async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCommentExistenceSpy.and.resolveTo([]);
      getRepliesSpy.and.resolveTo({ replies: [] });
      const result = await controller.showReply(req,res,next);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_COMMENT_READ_EXHAUSTED);
    });


    it('should return repleis', async () => {
      validateRantExistenceSpy.and.resolveTo({});
      validateRantCommentExistenceSpy.and.resolveTo([]);
      getRepliesSpy.and.resolveTo({ replies: [ { childComments: [] }, { childComments: [] }, { childComments: [{ collapsedComment: {} }] } ] });
      const result = JSON.parse(await controller.showReply(req,res,next));
      expect(result.status).toEqual(200);
      expect(result.message).toEqual(
        {
          replies: [ {}, {}, { childComment: { collapsedComment: {} } } ]
        }
      );
    });

    it('should throw error', async () => {
      getRepliesSpy.and.throwError('x');
      await controller.showReply(req,res,next);
      expect(controller.replyRantService.getReplies).toThrow(new Error('x'));
    });

  });


  describe("::deleteReply", () => {

    let deleteReplySpy;
    let validateRantCommentExistenceSpy;

    beforeEach(() => {
      deleteReplySpy = spyOn(controller.replyRantService, 'deleteReply');
      validateRantCommentExistenceSpy = spyOn(controller.replyRantService, 'validateRantCommentExistence');
    });

    afterEach(() => {
      deleteReplySpy.calls.reset();
      validateRantCommentExistenceSpy.calls.reset();
    })

    beforeAll(() => {
      req.params = { replyRantId: uuidv4() }
    })

    it('should not delete a comment when the id does not exists', async () => {
      validateRantCommentExistenceSpy.and.resolveTo(null);
      const result = await controller.deleteReply(req,res,next);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_RANT_COMMENT_ID_INVALID);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommentId: req.params.replyRantId
        }
      );
    });

    it('should not allow delete operation on already deleted comment', async () => {
      validateRantCommentExistenceSpy.and.resolveTo({ deleted: true });
      const result = await controller.deleteReply(req,res,next);
      expect(result.status).toEqual(410);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_RANT_ALREADY_DELETED);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommentId: req.params.replyRantId
        }
      );
    })

    it('should prevent current logged in user  from deleting comment by a different user', async () => {
      validateRantCommentExistenceSpy.and.returnValues({},null);
      const result = await controller.deleteReply(req,res,next);
      expect(result.status).toEqual(401);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_UNAUTHORIZED_OPERATION);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommenter: req.session.user.username,
          rantCommentId: req.params.replyRantId
        }
      );
    });

    it('should delete reply if all the above conditions meet', async () => {
      validateRantCommentExistenceSpy.and.returnValues({},{});
      deleteReplySpy.and.resolveTo(true)
      const result = JSON.parse(await controller.deleteReply(req,res,next));
      expect(result.status).toEqual(200);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_SUCCESSFULLY_DELETED);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommenter: req.session.user.username,
          rantCommentId: req.params.replyRantId
        }
      );
      expect(controller.replyRantService.deleteReply).toHaveBeenCalled();
      expect(controller.replyRantService.deleteReply).toHaveBeenCalledWith(req.params.replyRantId);
    });

    it('should throw error', async () => {
      deleteReplySpy.and.throwError('x');
      await controller.showReply(req,res,next);
      expect(controller.replyRantService.deleteReply).toThrow(new Error('x'));
    });
  });

  describe("::editReply", () => {

    let editReplySpy;
    let validateRantCommentExistenceSpy;
    let createTrendIfExistsSpy;

    beforeEach(() => {
      editReplySpy = spyOn(controller.replyRantService, 'editReply');
      validateRantCommentExistenceSpy = spyOn(controller.replyRantService, 'validateRantCommentExistence');
      createTrendIfExistsSpy = spyOn(controller.trendingService, 'createTrendIfExists');
    });

    afterEach(() => {
      editReplySpy.calls.reset();
      validateRantCommentExistenceSpy.calls.reset();
      createTrendIfExistsSpy.calls.reset();
    })

    beforeAll(() => {
      req.params = { replyRantId: uuidv4() }
      req.body = { replyRant: "edited rant".repeat(20) };
    })

    it('should not edit a comment when the id does not exists', async () => {
      validateRantCommentExistenceSpy.and.resolveTo(null);
      const result = await controller.editReply(req,res,next);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_RANT_COMMENT_ID_INVALID);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommentId: req.params.replyRantId
        }
      );
    });

    it('should not allow edit operation on already deleted comment', async () => {
      validateRantCommentExistenceSpy.and.resolveTo({ deleted: true });
      const result = await controller.editReply(req,res,next);
      expect(result.status).toEqual(410);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_RANT_ALREADY_DELETED);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommentId: req.params.replyRantId
        }
      );
    })

    it('should prevent current logged in user from editing comment by a different user', async () => {
      validateRantCommentExistenceSpy.and.returnValues({},null);
      const result = await controller.editReply(req,res,next);
      expect(result.status).toEqual(401);
      expect(result.message).toEqual(rantConstants.RANT_REPLY_UNAUTHORIZED_OPERATION);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommenter: req.session.user.username,
          rantCommentId: req.params.replyRantId
        }
      );
    });

    it('should return cannot edit rant comment if edit operation failed', async () => {
      validateRantCommentExistenceSpy.and.returnValues({},{});
      editReplySpy.and.resolveTo(null)
      const result = await controller.editReply(req,res,next);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(rantConstants.RANT_COMMENT_CANNOT_EDIT);
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
    });

    it('should edit rant comment', async () => {

      validateRantCommentExistenceSpy.and.returnValues({},{});

      editReplySpy.and.resolveTo(
        {
          rantComment: req.body.replyRant,
          rantCommentId: req.params.replyRantId
        }
      )

      createTrendIfExistsSpy.and.resolveTo(true)

      const result = JSON.parse(await controller.editReply(req,res,next));

      expect(result.status).toEqual(200);
      expect(result.message).toEqual(
        {
          rantComment: req.body.replyRant,
          rantCommentId: req.params.replyRantId
        }
      );
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalled();
      expect(controller.replyRantService.validateRantCommentExistence).toHaveBeenCalledWith(
        {
          rantCommenter: req.session.user.username,
          rantCommentId: req.params.replyRantId
        }
      );
      expect(controller.trendingService.createTrendIfExists).toHaveBeenCalled();
      expect(controller.trendingService.createTrendIfExists).toHaveBeenCalledWith(
        {
          text: req.body.replyRant,
          identifier: req.params.replyRantId,
          col: 'rantcomments'
        }
      );
      expect(controller.replyRantService.editReply).toHaveBeenCalled();
      expect(controller.replyRantService.editReply).toHaveBeenCalledWith(
        {
          replyRantId : req.params.replyRantId,
          replyRant   : req.body.replyRant
        }
      );
    });

    it('should throw error', async () => {
      editReplySpy.and.throwError('x');
      await controller.editReply(req,res,next);
      expect(controller.replyRantService.editReply).toThrow(new Error('x'));
    });

  });

});
