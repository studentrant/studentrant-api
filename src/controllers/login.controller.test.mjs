import Login from "./login.controller.js";
import * as Utils  from "../utils/index.util.js";
import * as constants from "../constants/index.constant.js";
import { req } from "../../__test__/fakes/req.fake.js";
import { res } from "../../__test__/fakes/res.fake.js";
import * as nextValue from "../../__test__/fakes/next.fake.js";
import { Collection } from "../../__test__/fakes/db.fakes.js";


const successfulLoggedIn = {
    email: "real@example.com",
    password: "real",
    username: "real",
    _id: 1,
    __v: "junk",
    userId  : 1,
    verified: false,
    completeReg: false
};
	

describe("Login [Unit]", () => {
    const loginController = new Login(Utils,Collection);
    let findOneSpy;
    let resourceExistsSpy;
    let verifyPasswordUtilsSpy;
    //let nextSpy;

    afterAll(() => {
	req.session = {};
    });
    
    afterEach(() => {
	req.body = {};
	findOneSpy.calls.reset();
	resourceExistsSpy.calls.reset();
    });

    beforeEach(() => {
	findOneSpy = spyOn(Collection, "findOne");
	resourceExistsSpy = spyOn(loginController.utils.DbUtils, "ResourceExists").and.callThrough();
	verifyPasswordUtilsSpy = spyOn(loginController.utils.PasswordUtils, "VerifyHashPassword");
    });
    
    it("should not allow invalid logins for username", async () => {
	req.body = { username: "fake", password: "fake" };
	findOneSpy.and.resolveTo(false);
	const login = await loginController.login(req,res,nextValue.next);
	expect(Collection.findOne).toHaveBeenCalled();
	expect(Collection.findOne).toHaveBeenCalledWith({ username: "fake"});
	expect(login.status).toEqual(404);
	expect(login.message).toEqual(constants.loginConstants.INVALID_LOGIN_CREDENTIALS);
    });

    
    it("should not allow invalid logins for email", async () => {
	req.body = { email: "fake@example.com", password: "fake" };
	findOneSpy.and.resolveTo(false);
	const login = await loginController.login(req,res,nextValue.next);
	expect(Collection.findOne).toHaveBeenCalled();
	expect(Collection.findOne).toHaveBeenCalledWith({ email: "fake@example.com"});
	expect(login.status).toEqual(404);
	expect(login.message).toEqual(constants.loginConstants.INVALID_LOGIN_CREDENTIALS);
    });

    it("should not allow invalid logins for password", async () => {
	req.body = { email: "real", password: "fake" };
	findOneSpy.and.resolveTo({ data: { password: "fake" } });
	verifyPasswordUtilsSpy.and.resolveTo(false);
	const login = await loginController.login(req,res,nextValue.next);
	expect(Collection.findOne).toHaveBeenCalled();
	expect(Collection.findOne).toHaveBeenCalledWith({ email: "real"});
	expect(login.status).toEqual(404);
	expect(login.message).toEqual(constants.loginConstants.INVALID_LOGIN_CREDENTIALS);
    });
    
    it("should allow user to login", async () => {
	
	req.body = { email: "real@example.com", password: "real" };

	const resolvedValue = Object.defineProperty(successfulLoggedIn, "_doc", {
	    value: successfulLoggedIn,
	    enumerable: false
	});
	
	findOneSpy.and.resolveTo(resolvedValue);
	verifyPasswordUtilsSpy.and.resolveTo(true);
	
	const login = JSON.parse(await loginController.login(req,res,nextValue.next));
	
	expect(Collection.findOne).toHaveBeenCalled();
	expect(Collection.findOne).toHaveBeenCalledWith({ email: "real@example.com"});
	expect(login.status).toEqual(200);
	expect(login.message.password).toBeUndefined();
	expect(login.message._id).toBeUndefined();
	expect(login.message.__v).toBeUndefined();
	expect(login.message).toEqual(successfulLoggedIn);
	expect(req.session.user).toEqual(successfulLoggedIn);
	
    });


});
