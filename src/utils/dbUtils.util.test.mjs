import DbUtils from "./dbUtils.util.js";
import { Collection } from "../../__test__/fakes/db.fakes.js";

describe("DbUtils [Utilities]", () => {
  describe("::ResourceExists", () => {
    const coll = Collection;
    let findOneSpy;
    beforeEach(() => {
      findOneSpy = spyOn(coll, "findOne");
    });
    afterEach(() => {
      findOneSpy.calls.reset();
    });
    it("should return { exists : false } if value is not found", async () => {
      findOneSpy.and.resolveTo(undefined);
      const result = await DbUtils.ResourceExists(
        coll,
        { username: "hello" }
      );
      expect(coll.findOne).toHaveBeenCalled();
      expect(coll.findOne).toHaveBeenCalledWith({
        username: "hello"
      });
      expect(result).toBeDefined();
      expect(result.exists).toBeFalsy();
    });
    it("should return { exists: true } if value is found", async () => {
      findOneSpy.and.resolveTo({ foo: "bar" });
      const result = await DbUtils.ResourceExists(
        [coll],
        { username: "hello" }
      );
      expect(coll.findOne).toHaveBeenCalled();
      expect(coll.findOne).toHaveBeenCalledWith({
        username: "hello"
      });
      expect(result).toBeDefined();
      expect(result.exists).toBeTruthy();
    });
  });
});
