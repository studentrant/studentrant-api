import { PostRantService } from "./post-rant.service.js";
import { RantDbUtils, rantsCollection } from "../../__test__/fakes/db.fakes.js";

describe("PostRantService [Unit]" , () => {
    const service = new PostRantService(
	new RantDbUtils(rantsCollection)
    );

    describe("::createRant", () => {
	let saveRantSpy;
	beforeEach(() => {
	    saveRantSpy = spyOn(service.rantDbUtils, "saveRant");
	});
	afterEach(() => {
	    saveRantSpy.calls.reset();
	});
	it("should save rant", async () => {
	    saveRantSpy.and.resolveTo({});
	    const result = await service.createRant({ foo: "bar" });
	    expect(service.rantDbUtils.saveRant).toHaveBeenCalled();
	});
    });
});
