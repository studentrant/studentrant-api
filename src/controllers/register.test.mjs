import * as Utils        from "../../utils/index.js";
import * as constants from "../constants/index.js";
import { Registration } from "./register.js";
import RegisterDbUtils   from "../../models/dbutils/register.db.util.js";
import { usersCollection } from "../../models/dbmodels/index.js";
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
    let ResourceExistsSpy;

    afterEach(() => {
	req.body = {};
	findOneSpy.calls.reset();
	ResourceExistsSpy.calls.reset();
    });

    beforeEach(() => {
	findOneSpy = spyOn(usersCollection , "findOne");
	ResourceExistsSpy = spyOn(registerController.utils.DbUtils, "ResourceExists").and.callThrough();
	
    });

    it("should return email address as already existing when trying to register", async () => {
	req.body = { email: "exists@example.com", password: "exists-password" };
	findOneSpy.and.resolveTo({
	    exists: true,
	    error: false
	});
	const register = registerController.firstRegStep();
	console.log(register);
    });
    
});
