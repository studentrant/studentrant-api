import * as exceptions from "./exceptions.service.js";

function handler(errorType, message) {
    throw errorType(message);
}

describe("Exception [Unit]", () => {
    it("should throw ExistsException", () => {
	expect(function() {
	    handler(exceptions.ExistsException, "found");
	}).toThrowError("found");
    });
    it("should throw UnAuthorizedAccessException", () => {
	expect(function() {
	    handler(exceptions.UnAuthorizedAccessException, "unauthorized");
	}).toThrowError("unauthorized");
    });
    it("should throw BadValueException", () => {
	expect(function() {
	    handler(exceptions.BadValueException, "badvalue");
	}).toThrowError("badvalue");
    });
});
