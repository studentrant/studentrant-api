import log4js from "log4js";
import { Client } from "@elastic/elasticsearch";

export class Logger {

    constructor(config) {
        Logger.config = this.config  = config;
        this.useMiddleware = true;
    }

    setLogType(type) {
        this.log = log4js.getLogger(type);
        return log4js.connectLogger(this.log);
    }


    elasticSearchAdapter(config) {

        const client = new Client({
	    node       : config.elasticSearchUrl,
	    maxRetries : 5,
	    auth  : {
                username : config.elasticUsername,
                password : config.elasticPassword
	    }
        });

        return async (loggingEvent) => {
	    await client.index({
                index : config.elasticSearchIndex,
                body  : { ...loggingEvent }
	    });
        };
    }


    configure() {
        log4js.configure({
	    appenders: {
                customAppender : {
		    type               : { configure : this.elasticSearchAdapter },
		    elasticSearchIndex : `studentrant_${this.config.get("env")}`,
		    elasticSearchUrl   : "http://localhost:9200"
                },
                express: { type  : "stdout" }
	    },
	    categories: {
                default : { appenders: [ "customAppender" , "express" ], level: "info" }
	    }
        });
        return this.setLogType("express");
    }
}
