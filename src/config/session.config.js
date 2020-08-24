import session     from "express-session";
import mongoStore  from "connect-mongodb-session";
import {config}    from "./config.config.js";

export class Session {
    
    constructor() {
        this.useMiddleware = true;
    }

    configure() {
        const store = new mongoStore(session);	
        return session({
	    secret : config.get("sessionSecret"),
	    resave : true,
	    
	    saveUninitialized : true,
	    store: store(
                {
		    uri        : config.get("dbConnectionString.connString"),
		    collection : "session"
                }
	    )
        });
    }
}
