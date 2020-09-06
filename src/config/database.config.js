import mongoose from "mongoose";
export class Database {

    constructor(config) {
        Database.MongooseURI = this.mongooseUri = config.get("dbConnectionString.connString");
    }

    static ErrorHandler(error) {
        if ( error )
	    console.log(`${error} ${Database.MongooseURI}`);
    }

    static ConnectedHandler() {
        console.log(`Connected to ${Database.MongooseURI}`);
    }

    static DisconnectedHandler() {
        console.log(`Disconnected to ${Database.MongooseURI}`);
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
