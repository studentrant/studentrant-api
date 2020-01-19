const convict = require("convict");

//${db_name}?replicaSet=${replica_set_name}&readPreference=primary&retryWrites=true&maxIdleTimeMS=10000&compressors=zlib`

const config  = convict({

    externalApis: {
	doc: "Credentials for external apis",
	loomai: {
	    client_id: "jow7m83kI03ipUDcCrvDZKVqhinFTZbf",
	    client_secret: "vPnhDLp-IC0iagencnnxjLSikRdSOBI1652RjuHUJMeIMsHJ4f1gfxnJXm3k0ZFl"
	}
    },

    dbConnectionString: {

        doc: "Connection string for database",

        connString: {
	    format: String,
	    default: ""
        },

        extraArgument: {
	    format: String,
	    default: "readPreference=primary&retryWrites=true&maxIdleTimeMS=10000&compressors=zlib"
        },

        dbName: {
	    default: "studentrant"
        },

        replicaSetName: {
	    default: "studentrant_test"
        },

        replOne: {
	    host: {
                format: String,
                default: "localhost"
	    },
	    port: {
                format: Number,
                default: 27017
	    }
        },
        replTwo: {
	    host: {
                format: String,
                default: "localhost"
	    },
	    port: {
                format: Number,
                default: 27018
	    }
        },
        replThree: {
	    host: {
                format: String,
                default: "localhost"
	    },
	    port: {
                format: Number,
                default: 27019
	    }
        }
    },
    env: {
        doc: "Environment",
        format: [ "dev" , "prod", "test" ],
        default: "dev",
        env: "NODE_ENV"
    },
    session_secret: {
	format: String,
	default: "this_is_my_secret"
    }
});


if ( config.get("env") === "prod" ) {
    config.set("dbConnectionString.replOne.host", "");
    config.set("dbConnectionString.replTwo.host", "");
    config.set("dbConnectionString.replThree.host", "");

    config.set("dbConnectionString.replOne.port", "");
    config.set("dbConnectionString.replTwo.port", "");
    config.set("dbConnectionString.replThree.port", "");
    config.set("dbConnectionString.replicaSetName", "");
    config.set("dbConnectionString.extraArgument", "ssl=true&authSource=admin");
}

if ( config.get("env") === "test" ) {
    config.set("dbConnectionString.replOne.port", 27017);
    config.set("dbConnectionString.replTwo.port", 27018);
    config.set("dbConnectionString.replThree.port", 27019);
}



const [
    hostp1,
    hostp2,
    hostp3
] = [
    `${config.get("dbConnectionString.replOne.host")}:${config.get("dbConnectionString.replOne.port")}`,

    `${config.get("dbConnectionString.replTwo.host")}:${config.get("dbConnectionString.replTwo.port")}`,

    `${config.get("dbConnectionString.replThree.host")}:${config.get("dbConnectionString.replThree.port")}`,
];

config.set(
    "dbConnectionString.connString",
    `mongodb://${hostp1},${hostp2},${hostp3}/${config.get("dbConnectionString.dbName")}?${config.get("dbConnectionString.extraArgument")}&replicaSet=${config.get("dbConnectionString.replicaSetName")}`
);

module.exports = config;
