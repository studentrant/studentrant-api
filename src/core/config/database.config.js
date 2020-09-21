import mongoose from "mongoose";
import {Logger}  from "./logger.config.js";

export class Database {

    constructor(config) {

        const logger = new Logger(config);

        logger.setLogType("express");
        Logger.log           =  logger.log;

        Database.MongooseURI = this.mongooseUri = config.get("dbConnectionString.connString");

    }

    static ErrorHandler(error) {
        if ( error )
	    Logger.log.error(`${error} on Database`);
    }

    static ConnectedHandler() {
        Logger.log.info("Connected to Database");
    }

    static DisconnectedHandler() {
        Logger.log.warn("Disconnected from Database");
    }

    connect() {
        return mongoose.connect(
	    this.mongooseUri,
	    {
                useFindAndModify: false,
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                bufferMaxEntries: 0,
                bufferCommands: 0,
                keepAlive: true,
                poolSize: 350
	    },
	    Database.ErrorHandler
        );
    }

    configure() {

        const db  = mongoose.connection;

        this.connect();

        db.on("connected",    Database.ConnectedHandler);
        db.on("disconnected", Database.DisconnectedHandler);
        db.on("error",        Database.ErrorHandler);

    }
}
