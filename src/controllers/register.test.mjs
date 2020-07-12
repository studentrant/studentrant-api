import * as Utils        from "../utils/index.js";
import * as constants from "../constants/index.js";
import { Registration } from "./register.js";
import RegisterDbUtils   from "../models/dbutils/register.db.util.js";
import { usersCollection } from "../models/dbmodels/index.js";
import { req } from "../../__test__/fakes/req.fake.js";
import { res } from "../../__test__/fakes/res.fake.js";
import * as nextValue from "../../__test__/fakes/next.fake.js";


describe("Registration [Unit]", () => {
    const registerController = new Registration(
	RegisterDbUtils,
	Utils,
	usersCollection
    );

    let findOneSpy;
    let checkUserNameSpy;
    let checkEmailSpy;
    let checkUserExistsSpy;

    afterEach(() => {
	req.body = {};
	findOneSpy.calls.reset();
	checkUserExistsSpy.calls.reset();
	checkUserNameSpy.calls.reset();
	checkUserExistsSpy.calls.reset();
    });

    beforeEach(() => {
	findOneSpy = spyOn(usersCollection , "findOne");
	checkUserExistsSpy = spyOn(registerController.register, "checkUserExists").and.callThrough();
	checkUserNameSpy = spyOn(registerController.register, "checkUserName").and.callThrough();
	checkEmailSpy = spyOn(registerController.register, "checkEmail").and.callThrough();
    });

    it("should return email address as already existing when trying to register", async () => {

	req.body = { email: "exists@example.com", password: "password", username: "notexistsusername" };

	findOneSpy.and.resolveTo({ email: "exists@example.com" });

	const register = JSON.parse(await registerController.firstRegStep(req,res,nextValue.next));


	expect(usersCollection.findOne).toHaveBeenCalled();
	expect(usersCollection.findOne).toHaveBeenCalledWith({ email: "exists@example.com" }, { email: true });
	
	expect(registerController.register.checkUserExists).toHaveBeenCalled();
	expect(registerController.register.checkUserExists).toHaveBeenCalledWith("email", "exists@example.com");

	expect(registerController.register.checkUserName).not.toHaveBeenCalled();
	expect(registerController.register.checkEmail).toHaveBeenCalled();
	expect(registerController.register.checkEmail).toHaveBeenCalledWith("exists@example.com");

	expect(register.status).toEqual(409);
	expect(register.message).toEqual(constants.registerConstants.EMAIL_ALREADY_EXISTS);
    });

    it("should return username if it already exists", async () => {

	req.body = { email: "notexists@example.com", password: "password" , username: "existsusername"};

	checkEmailSpy.and.resolveTo(false);
	checkUserNameSpy.and.resolveTo({username: "existsusername"});

	const register = JSON.parse(await registerController.firstRegStep(req,res,nextValue.next));

	expect(registerController.register.checkUserName).toHaveBeenCalled();
	expect(registerController.register.checkUserName).toHaveBeenCalledWith("existsusername");
	expect(registerController.register.checkEmail).toHaveBeenCalled();
	expect(registerController.register.checkEmail).toHaveBeenCalledWith("notexists@example.com");
	
	expect(register.status).toEqual(409);
	expect(register.message).toEqual(constants.registerConstants.USERNAME_ALREADY_EXISTS);

    });

    xit("should register user", async () => {
	
	req.body = { email: "notexists@example.com", password: "password" , username: "notexistsusername"};

	
	findOneSpy.and.resolveTo(null);

	const register = JSON.parse(await registerController.firstRegStep(req,res,nextValue.next));


	expect(usersCollection.findOne).toHaveBeenCalled();
	expect(usersCollection.findOne).toHaveBeenCalledWith({ email: "notexists@example.com" }, { email: true });
	
	expect(registerController.register.checkUserExists).toHaveBeenCalled();
	expect(registerController.register.checkUserExists).toHaveBeenCalledWith("email", "notexists@example.com");
	console.log(checkUserExistsSpy.call.all())
	expect(registerController.register.checkUserName).not.toHaveBeenCalled();
	expect(registerController.register.checkEmail).toHaveBeenCalled();
	expect(registerController.register.checkEmail).toHaveBeenCalledWith("exists@example.com");

	expect(register.status).toEqual(409);
	expect(register.message).toEqual(constants.registerConstants.EMAIL_ALREADY_EXISTS);
    });
});
