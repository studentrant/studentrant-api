export const res = {
    headersSent: false,
    // eslint-disable-next-line no-unused-vars
    status(statusCode) {
        return {
	    json(obj) {
                res.headersSent = true;
                return JSON.stringify(obj);
	    }
        };
    }
};
