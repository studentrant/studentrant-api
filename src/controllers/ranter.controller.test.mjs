import * as constants from '../constants/index.constant.js';
import Ranter from './ranter.controller.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';
import { RantDbUtils, Collection, UserDbUtils } from '../../__test__/fakes/db.fakes.js';
import Utils from '../utils/utils.util.js';

describe("Ranter [Unit]", () => {

  const controller = new Ranter(
    UserDbUtils,
    Collection,
    Utils
  );

  describe("::updateTags", () => {

    let updateUserTagsSpy;

    beforeEach(() => {
      updateUserTagsSpy = spyOn(controller.ranterService, 'updateUserTags');
    });

    afterEach(() => {
      updateUserTagsSpy.calls.reset();
    });

    beforeAll(() => {
      req.body = { tags: [ 'test', 'oops' ] };
      req.session = { user: { username: "test" } };
    });

    it('should update user tags', async () => {
      updateUserTagsSpy.and.resolveTo({ settings: { notAllowedTags: [ "test", "oops" ] } });
      const result = JSON.parse(await controller.updateTags(req,res,next));
      expect(controller.ranterService.updateUserTags).toHaveBeenCalled();
      expect(controller.ranterService.updateUserTags).toHaveBeenCalledWith(
        req.session.user.username,
        req.body.tags
      );
      expect(result.status).toEqual(200);
      expect(result.message).toEqual({ ignoredTags: [ 'test', 'oops' ] });
    });

    it('should call next on error', async () => {
      updateUserTagsSpy.and.throwError('x');
      await controller.updateTags(req,res,next);
      expect(controller.ranterService.updateUserTags).toThrow(new Error('x'));
    });

  });

});
