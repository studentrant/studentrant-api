import RantValidators from './rant.middleware.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';
import { rantConstants } from '../constants/index.constant.js';

describe('RantValidators [Unit]', () => {
  const nextValue = { next };
  let nextSpy;

  beforeEach(() => {
    nextSpy = spyOn(nextValue, 'next').and.callThrough();
  });

  afterEach(() => {
    nextSpy.calls.reset();
    req.body = {};
  });

  describe('::VerifyRant', () => {
    it('should throw badexception if req.body.rant is undefined', () => {
      expect(() => {
        RantValidators.VerifyRant(req, res, nextValue.next);
      }).toThrowError(rantConstants.RANT_BODY_UNDEFINED);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should throw badexception if rant body is less than 20', () => {
      req.body.rant = 'hello world';
      expect(() => {
        RantValidators.VerifyRant(req, res, nextValue.next);
      }).toThrowError(rantConstants.RANT_LENGTH_NOT_MORE_THAN_TWENTY);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should call next without any parameter if the above conditions meet', () => {
      req.body.rant = 'hello world'.repeat(50);
      RantValidators.VerifyRant(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::VerifyRantTags', () => {
    it('should throw badexception if req.body.tags is undefined', () => {
      expect(() => {
        RantValidators.VerifyRantTags(req, res, nextValue.next);
      }).toThrowError(rantConstants.RANT_TAGS_UNDEFINED);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should throw badvalueexception if req.body.tags is not an array', () => {
      req.body.tags = 'foo';
      expect(() => {
        RantValidators.VerifyRantTags(req, res, nextValue.next);
      }).toThrowError(`${rantConstants.RANT_TAGS_NOT_AN_ARRAY} ${typeof (req.body.tags)}`);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should call next if all the above condition meets', () => {
      req.body.tags = ['test'];
      RantValidators.VerifyRantTags(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::VerifyRantId', () => {
    it('it should throw badvalueexception if if rant id is undefined', () => {
      expect(() => {
        RantValidators.VerifyRantId(req, res, nextValue.next);
      }).toThrowError(rantConstants.RANT_ID_IS_UNDEFINED);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should call next if the above condition meets', () => {
      req.params.rantId = 'xxxx';
      RantValidators.VerifyRantId(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe('::VerifyWhen', () => {
    it('should throw badvalueexception if req.body.when is undefined', () => {
      expect(() => {
        RantValidators.VerifyWhen(req, res, nextValue.next);
      }).toThrowError(rantConstants.RANT_WHEN_NO_EXISTS);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should throw badvalueexception if req.body.when is not a number', () => {
      req.body.when = 'foo bar';
      expect(() => {
        RantValidators.VerifyWhen(req, res, nextValue.next);
      }).toThrowError(rantConstants.RANT_NOT_NUMBER);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should throw badvalueexception if req.body.when is an invalid timestamp', () => {
      req.body.when = 22222222222222222222222222222;
      expect(() => {
        RantValidators.VerifyWhen(req, res, nextValue.next);
      }).toThrowError(rantConstants.RANT_NOT_VALID_TIMESTAMP);
      expect(nextValue.next).not.toHaveBeenCalled();
    });

    it('should call next', () => {
      req.body.when = Date.now();
      RantValidators.VerifyWhen(req, res, nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe("::VerifyRantVoter", () => {
    it('should throw badvalueexception if req.body.rantUpvoter is undefined and req.body.reantDownvoter is undefiend ', () => {
      expect(() => {
        RantValidators.VerifyRantVoter(req,res,nextValue.next);
      }).toThrowError(rantConstants.RANT_VOTER_NO_EXISTS);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('should call next', () => {
      req.body.rantUpvoter = 'xxxx';
      RantValidators.VerifyRantVoter(req,res,nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
    it('should call next', () => {
      req.body.rantDownvoter = 'xxxx';
      RantValidators.VerifyRantVoter(req,res,nextValue.next);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });

  describe("::VerifyNumRequest", () => {
    it('should throw badvalueexception if req.query.numRequest is not a number', () => {
      req.query.numRequest = 'asdfadsfadf';
      expect(() => {
        RantValidators.VerifyNumRequest(req,res,nextValue.next);
      }).toThrowError(rantConstants.RANT_NOT_VALID_LOAD_NUM_REQUEST);
      expect(nextValue.next).not.toHaveBeenCalled();
    });
    it('shoudl call next', () => {
      req.query.numRequest = '12';
      expect(() => {
        RantValidators.VerifyNumRequest(req,res,nextValue.next);
      }).not.toThrowError(rantConstants.RANT_NOT_VALID_LOAD_NUM_REQUEST);
      expect(nextValue.next).toHaveBeenCalled();
    });
  });
});
