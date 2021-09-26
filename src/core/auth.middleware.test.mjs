import Auth from './auth.middleware.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';
import loginConstant from '../login/login.constant.js';

describe('AuthMiddleware [Unit]', () => {
  describe('::IsLogin', () => {
    const nextValue = { next };
    let nextSpy;
    beforeEach(() => {
      nextSpy = spyOn(nextValue, 'next').and.callThrough();
    });
    afterEach(() => {
      nextSpy.calls.reset();
    });
    it('req.session.user is defined', () => {
      req.session.user = {};
      Auth.IsLogin(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
    it('should throw unauthroaizedaccess exception if req.session.user is not defined', () => {
      delete req.session.user;
      expect(() => {
        Auth.IsLogin(req, res, nextValue);
      }).toThrowError(loginConstant.USER_NOT_LOGGED_IN);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
  });
});
