import Utils from "./utils.util.js";
import req from "../../__test__/fakes/req.fake.js";

describe("Utils [Utilities]", () => {
  beforeAll(() => {
    req.session = { user : { username: 'test' } };
  });
  describe('::ExtractSessionObjectData', () => {
    it('should extraction session object', () => {
      const result = Utils.ExtractSessionObjectData(req, 'username');
      expect(result).toEqual('test');
    });
    it('should throw error', () => {
      expect( () =>{
        Utils.ExtractSessionObjectData(req, 'fake');
      }).toThrowError('fake does not exists on session object');
    });
  });
  
  describe('::UpdateSessionObject', () => {
    it('should update req.session.user', () => {
      Utils.UpdateSessionObject(req,{ username: 'student_test' });
      expect(req.session.user.username).toEqual('student_test');
    });
  });

  describe('::UniqueCodeGenerator', () => {
    it('should return unique code', () => {
      expect(Utils.UniqueCodeGenerator()).toBeDefined();
    });
  });
});
