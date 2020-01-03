const mongoose = require("mongoose");
const config   = require("../config.js");

mongoose.connect(
    config.get("dbConnectionString.connString"),
    {
	useFindAndModify: false,
	useNewUrlParser: true,
	useCreateIndex: true,

	autoReconnect: true,
	bufferMaxEntries: 0,
	bufferCommands: 0,
	keepAlive: true,
	keepAliveInitialDeplay: 450000,
	poolSize: 350

    },
    error => error && console.log(error)
);

const db = mongoose.connection;

db.on("connected", console.log.bind(console, `successfully connected to db - ${config.get("dbConnectionString.connString")}`));

db.on("disconnected", () => console.log(
    `successfully disconnected from db - ${config.get("dbConnectionString.connString")}`
));

db.on("error", () => console.error.bind(console, `error while connecting to db - ${config.get("dbConnectionString.connString")}`));

module.exports = db;
