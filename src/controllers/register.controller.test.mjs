import * as Utils        from "../utils/index.util.js";
import * as constants from "../constants/index.constant.js";
import { Registration } from "./register.controller.js";
import { RegisterService } from "../service/register.service.js";
import { ExistsException } from "../service/exceptions.service.js";
import RegisterDbUtils   from "../models/dbutils/register.db.util.js";
import  Email            from "../service/email.service.js";
import { usersCollection } from "../models/dbmodels/index.model.js";
import { req } from "../../__test__/fakes/req.fake.js";
import { res } from "../../__test__/fakes/res.fake.js";
import * as nextValue from "../../__test__/fakes/next.fake.js";

const sucessfullyRegistered = {
    username: "notexistsusername",
    email: "notexists@example.com",
    completeReg: false,
    verified: false
};

describe("Registration [Unit]", () => {
    const registerController = new Registration(
	RegisterDbUtils,
	Email,
	Utils,
	usersCollection
    );

    afterEach(() => {
	req.body = {};
    });


    describe("::firstRegStep", () => {

	let checkUserExistenceSpy, saveUserSpy;

	beforeEach(() => {
	    checkUserExistenceSpy = spyOn(registerController.registerService, "checkUserExistence");;
	    saveUserSpy = spyOn(registerController.registerService, "saveUser");
	});

	afterEach(() => {
	    checkUserExistenceSpy.calls.reset();
	    saveUserSpy.calls.reset();
	});

	it("should throw ExistsException error when searching email that already exists", async () => {
	    req.body = { email: "exists@example.com", password: "password" , username: "notexists"};
	    checkUserExistenceSpy.and.resolveTo({ email: "exists@example.com" });
	    const result = await registerController.firstRegStep(req,res,nextValue.next);
	    expect(result.status).toEqual(409);
	    expect(result.message).toEqual(constants.registerConstants.EMAIL_ALREADY_EXISTS);
	    expect(registerController.registerService.checkUserExistence).toHaveBeenCalled();
	    expect(registerController.registerService.checkUserExistence).toHaveBeenCalledWith(req.body.email, req.body.username);
	});

	it("should return username if it already exists", async () => {
	    req.body = { email: "notexists@example.com", password: "password" , username: "existsusername"};
	    checkUserExistenceSpy.and.resolveTo({ username: "existsusername" });
	    const register = await registerController.firstRegStep(req,res,nextValue.next);
	    expect(register.status).toEqual(409);
	    expect(register.message).toEqual(constants.registerConstants.USERNAME_ALREADY_EXISTS);
	    expect(registerController.registerService.checkUserExistence).toHaveBeenCalled();
	    expect(registerController.registerService.checkUserExistence).toHaveBeenCalledWith(req.body.email, req.body.username);
	});

	it("should register user", async () => {

	    req.body = { email: "notexists@example.com", password: "password" , username: "notexistsusername" };

	    checkUserExistenceSpy.and.resolveTo(undefined);
	    saveUserSpy.and.resolveTo(sucessfullyRegistered);

	    const result = JSON.parse(await registerController.firstRegStep(req,res,nextValue.next));

	    expect(result.status).toEqual(201);
	    expect(result.message.password).toBeUndefined();
	    expect(result.message._id).toBeUndefined();
	    expect(result.message.__v).toBeUndefined();
	    expect(req.session.user).toBeDefined();
	    expect(req.session.user).toEqual(result.message);
	    expect(result.message).toEqual(sucessfullyRegistered);

	});
    });
});
