import { bcrypt } from "../../__test__/fakes/modules.fakes.js";
import PasswordUtils from "./passwordUtils.util.js";

describe("PasswordUtils [Utilities]", () => {
  const passwordUtils = new PasswordUtils(bcrypt);
  describe("::hashPassword", () => {
    let hashSyncSpy ;
    beforeEach(() => {
      hashSyncSpy = spyOn(passwordUtils.bcrypt, "hashSync");
    });
    afterEach(() => {
      hashSyncSpy.calls.reset();
    });
    it("should hash password sync", () => {
      hashSyncSpy.and.returnValue("$$$$$$$$");
      const result = passwordUtils.hashPassword("abcd");
      expect(passwordUtils.bcrypt.hashSync).toHaveBeenCalled();
      expect(passwordUtils.bcrypt.hashSync).toHaveBeenCalledWith("abcd",passwordUtils.BCRYPT_SALT);
      expect(result).toEqual("$$$$$$$$");
    });
  });
  describe("::verifyHashPassword", () => {
    let verifyHashPasswordSpy;
    beforeEach(() => {
      verifyHashPasswordSpy = spyOn(passwordUtils.bcrypt, "compareSync");
    });
    afterEach(() => {
      verifyHashPasswordSpy.calls.reset();
    });
    it("should return true if plain and hash is the same", () => {
      verifyHashPasswordSpy.and.returnValue(true);
      const result = passwordUtils.verifyHashPassword("abcd", "$$$$$$$$");
      expect(passwordUtils.bcrypt.compareSync).toHaveBeenCalled();
      expect(passwordUtils.bcrypt.compareSync).toHaveBeenCalledWith("abcd", "$$$$$$$$");
      expect(result).toBeTruthy();
    });
    it("should return false if plain and hash is different", () => {
      verifyHashPasswordSpy.and.returnValue(false);
      const result = passwordUtils.verifyHashPassword("abcd", "$$$$$$$$");
      expect(passwordUtils.bcrypt.compareSync).toHaveBeenCalled();
      expect(passwordUtils.bcrypt.compareSync).toHaveBeenCalledWith("abcd", "$$$$$$$$");
      expect(result).toBeFalsy();
    });
  });
});
