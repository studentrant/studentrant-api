import { v4 as uuidv4 } from "uuid";
import PostRant from "./post-rant.controller.js";
import { req }  from "../../__test__/fakes/req.fake.js";
import { res }  from "../../__test__/fakes/res.fake.js";
import { RantDbUtils, rantsCollection } from "../../__test__/fakes/db.fakes.js";
import * as nextValue from "../../__test__/fakes/next.fake.js";
import * as Utils from "../utils/utils.util.js";

describe("PostRant [Unit]", () => {

    const controller = new PostRant(RantDbUtils,Utils,rantsCollection);

    describe("::createRant", () => {

	let createRantSpy;
	let date;

	beforeAll(() => {
	    date = Date.now();
	});

	beforeEach(() => {
	    createRantSpy = spyOn(controller.postRantService, "createRant");
	    req.body = {
		rant: "Twinkle Twinkle, little Star, How I wonder what you are, up above the sky so high, like a diamon in the sky, twinkle twinkle little star",
		tags: [ "twinkle", "star" ],
		rantId: uuidv4(),
		when : date
	    };
	    req.session = { user: { username: "testuseraccount" } };
	});

	afterEach(() => {
	    createRantSpy.calls.reset();
	    req.body = {};
	});

	it("should create rant and return all tags", async () => {
	    createRantSpy.and.resolveTo({...req.body, rantPoster: req.session.user.username});
	    const result = JSON.parse(await controller.createRant(req,res,nextValue.next));
	    expect(result.status).toEqual(201);
	    expect(result.message).toEqual({...req.body, rantPoster: req.session.user.username});
	    expect(controller.postRantService.createRant).toHaveBeenCalled();
	    expect(controller.postRantService.createRant).toHaveBeenCalledWith({
		rantPoster: req.session.user.username,
		rant: req.body.rant,
		tags: req.body.tags,
		when: req.body.when
	    });
	});
	it("should create a rant with empty tags and return general as member of the tag", async () => {
	    createRantSpy.and.resolveTo({...req.body, tags: [ "general" ], rantPoster: req.session.user.username });
	    const result = JSON.parse(await controller.createRant(req,res,nextValue.next));
	    expect(result.status).toEqual(201);
	    expect(result.message).toEqual({...req.body, tags: [ "general" ], rantPoster: req.session.user.username});
	});
    });
});
